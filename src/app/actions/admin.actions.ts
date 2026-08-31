"use server"

import { revalidatePath } from "next/cache"
import { auth, signOut } from "@/lib/auth"
import {
  cambiarEstadoPedidoSchema,
  actualizarStockSchema,
  crearCuponSchema,
  crearOfertaSchema,
  cambiarPasswordSchema,
} from "@/lib/validators/admin.schema"
import { actualizarEstadoPedido } from "@/services/pedido.service"
import { verificarPago, rechazarPago } from "@/services/pago.service"
import { actualizarStockVariante } from "@/services/producto.service"
import { crearCupon, desactivarCupon } from "@/services/cupon.service"
import { crearOferta, desactivarOferta } from "@/services/oferta.service"
import { cambiarPasswordPropia } from "@/services/usuario.service"

interface ActionResult {
  error: string | undefined
  ok: boolean | undefined
}

async function requireAdmin() {
  const session = await auth()
  if (!session || session.user.rol !== "ADMIN") throw new Error("No autorizado")
  return session.user.id
}

export async function cambiarEstadoPedidoAction(formData: FormData): Promise<ActionResult> {
  await requireAdmin()

  const parsed = cambiarEstadoPedidoSchema.safeParse({
    pedidoId: formData.get("pedidoId"),
    nuevoEstado: formData.get("nuevoEstado"),
  })
  if (!parsed.success) return { error: "Datos inválidos.", ok: undefined }

  try {
    await actualizarEstadoPedido(parsed.data.pedidoId, parsed.data.nuevoEstado)
  } catch (err) {
    return { error: err instanceof Error ? err.message : "No se pudo actualizar el pedido.", ok: undefined }
  }

  revalidatePath("/admin/pedidos")
  revalidatePath(`/admin/pedidos/${parsed.data.pedidoId}`)
  // PAGADO descuenta stock real — las páginas de producto son estáticas (SSG) y quedarían
  // mostrando el stock congelado del último build si no se invalidan acá.
  if (parsed.data.nuevoEstado === "PAGADO") revalidatePath("/catalogo/[slug]", "page")
  return { error: undefined, ok: true }
}

export async function verificarPagoAction(formData: FormData): Promise<ActionResult> {
  const adminId = await requireAdmin()
  const pagoId = formData.get("pagoId") as string
  if (!pagoId) return { error: "Pago inválido.", ok: undefined }

  try {
    await verificarPago(pagoId, adminId)
  } catch (err) {
    return { error: err instanceof Error ? err.message : "No se pudo verificar el pago.", ok: undefined }
  }

  revalidatePath("/admin/pagos")
  // Verificar el pago pasa el pedido a PAGADO y descuenta stock real — invalidar el catálogo
  // estático (SSG) para que la tienda deje de mostrar el stock congelado del último build.
  revalidatePath("/catalogo/[slug]", "page")
  return { error: undefined, ok: true }
}

export async function rechazarPagoAction(formData: FormData): Promise<ActionResult> {
  const adminId = await requireAdmin()
  const pagoId = formData.get("pagoId") as string
  if (!pagoId) return { error: "Pago inválido.", ok: undefined }

  try {
    await rechazarPago(pagoId, adminId)
  } catch (err) {
    return { error: err instanceof Error ? err.message : "No se pudo rechazar el pago.", ok: undefined }
  }

  revalidatePath("/admin/pagos")
  return { error: undefined, ok: true }
}

export async function actualizarStockAction(formData: FormData): Promise<ActionResult> {
  await requireAdmin()

  const parsed = actualizarStockSchema.safeParse({
    varianteId: formData.get("varianteId"),
    stock: formData.get("stock"),
  })
  if (!parsed.success) return { error: "Stock inválido.", ok: undefined }

  try {
    await actualizarStockVariante(parsed.data.varianteId, parsed.data.stock)
  } catch (err) {
    return { error: err instanceof Error ? err.message : "No se pudo actualizar el stock.", ok: undefined }
  }

  revalidatePath("/admin/catalogo")
  revalidatePath("/catalogo/[slug]", "page")
  return { error: undefined, ok: true }
}

export async function crearCuponAction(formData: FormData): Promise<ActionResult> {
  await requireAdmin()

  const parsed = crearCuponSchema.safeParse({
    codigo: formData.get("codigo"),
    porcentaje: formData.get("porcentaje"),
    fechaInicio: formData.get("fechaInicio") || undefined,
    fechaFin: formData.get("fechaFin") || undefined,
    usosMaximos: formData.get("usosMaximos") || undefined,
  })
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos.", ok: undefined }

  try {
    await crearCupon(parsed.data)
  } catch (err) {
    const yaExiste = err instanceof Error && err.message.includes("Unique constraint")
    return {
      error: yaExiste ? "Ya existe un cupón con ese código." : "No se pudo crear el cupón.",
      ok: undefined,
    }
  }

  revalidatePath("/admin/cupones")
  return { error: undefined, ok: true }
}

export async function desactivarCuponAction(formData: FormData): Promise<ActionResult> {
  await requireAdmin()
  const id = formData.get("id") as string
  if (!id) return { error: "Cupón inválido.", ok: undefined }

  try {
    await desactivarCupon(id)
  } catch {
    return { error: "No se pudo desactivar el cupón.", ok: undefined }
  }

  revalidatePath("/admin/cupones")
  return { error: undefined, ok: true }
}

export async function crearOfertaAction(formData: FormData): Promise<ActionResult> {
  await requireAdmin()

  const parsed = crearOfertaSchema.safeParse({
    nombre: formData.get("nombre"),
    porcentaje: formData.get("porcentaje"),
    fechaInicio: formData.get("fechaInicio"),
    fechaFin: formData.get("fechaFin"),
    productoIds: formData.getAll("productoIds"),
  })
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos.", ok: undefined }

  if (parsed.data.fechaFin < parsed.data.fechaInicio) {
    return { error: "La fecha de fin debe ser posterior a la de inicio.", ok: undefined }
  }

  try {
    await crearOferta(parsed.data)
  } catch {
    return { error: "No se pudo crear la oferta.", ok: undefined }
  }

  revalidatePath("/admin/ofertas")
  revalidatePath("/catalogo")
  revalidatePath("/catalogo/[slug]", "page")
  revalidatePath("/")
  return { error: undefined, ok: true }
}

export async function desactivarOfertaAction(formData: FormData): Promise<ActionResult> {
  await requireAdmin()
  const id = formData.get("id") as string
  if (!id) return { error: "Oferta inválida.", ok: undefined }

  try {
    await desactivarOferta(id)
  } catch {
    return { error: "No se pudo desactivar la oferta.", ok: undefined }
  }

  revalidatePath("/admin/ofertas")
  revalidatePath("/catalogo")
  revalidatePath("/catalogo/[slug]", "page")
  revalidatePath("/")
  return { error: undefined, ok: true }
}

export async function cambiarPasswordAction(formData: FormData): Promise<ActionResult> {
  const adminId = await requireAdmin()

  const parsed = cambiarPasswordSchema.safeParse({
    passwordActual: formData.get("passwordActual"),
    passwordNueva: formData.get("passwordNueva"),
    passwordConfirmar: formData.get("passwordConfirmar"),
  })
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos.", ok: undefined }

  try {
    await cambiarPasswordPropia(adminId, parsed.data.passwordActual, parsed.data.passwordNueva)
  } catch (err) {
    return { error: err instanceof Error ? err.message : "No se pudo cambiar la contraseña.", ok: undefined }
  }

  await signOut({ redirectTo: "/auth/login?passwordCambiada=1" })
  return { error: undefined, ok: true }
}
