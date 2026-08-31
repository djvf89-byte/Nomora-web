"use server"

import { redirect } from "next/navigation"
import { checkoutSchema } from "@/lib/validators/checkout.schema"
import { buscarVariante } from "@/constants/catalogo"
import { crearPedidoInvitado } from "@/services/pedido.service"
import { validarCupon, registrarUsoCupon } from "@/services/cupon.service"
import { obtenerOfertaActivaPorProducto } from "@/services/oferta.service"
import { calcularPrecioConDescuento, calcularEnvioCentimos } from "@/lib/precios"

// Validación "en vivo" de un cupón, llamada desde el checkout antes de enviar el pedido.
// No confirma nada — solo informa si es válido y qué % da, para mostrarlo en la UI.
export async function validarCuponAction(codigo: string) {
  if (!codigo.trim()) return { valido: false, porcentaje: 0, error: "Ingresa un código." }
  try {
    return await validarCupon(codigo)
  } catch {
    return { valido: false, porcentaje: 0, error: "No se pudo validar el cupón." }
  }
}

export async function checkoutAction(formData: FormData) {
  const datos = {
    nombre: formData.get("nombre") as string,
    email: formData.get("email") as string,
    telefono: formData.get("telefono") as string,
    direccion: formData.get("direccion") as string,
    departamento: formData.get("departamento") as string,
    provincia: formData.get("provincia") as string,
    distrito: formData.get("distrito") as string,
    referencia: (formData.get("referencia") as string) || undefined,
    metodoPago: formData.get("metodoPago") as string,
    productoSlug: formData.get("productoSlug") as string,
    varianteId: formData.get("varianteId") as string,
    cantidad: formData.get("cantidad") as string,
    cuponCodigo: (formData.get("cuponCodigo") as string) || undefined,
  }

  const parsed = checkoutSchema.safeParse(datos)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Revisa los datos ingresados." }
  }

  const encontrado = buscarVariante(parsed.data.productoSlug, parsed.data.varianteId)
  if (!encontrado || encontrado.variante.stock <= 0) {
    return { error: "Esa variante ya no está disponible." }
  }
  if (parsed.data.cantidad > encontrado.variante.stock) {
    return { error: `Solo quedan ${encontrado.variante.stock} unidades disponibles.` }
  }

  // Oferta de temporada y cupón no se combinan — se aplica el mayor de los dos.
  let porcentajeOferta = 0
  let porcentajeCupon = 0
  try {
    porcentajeOferta = await obtenerOfertaActivaPorProducto(parsed.data.productoSlug)
  } catch {
    // Sin conexión a BD: seguimos sin oferta aplicada en vez de bloquear la compra.
  }

  if (parsed.data.cuponCodigo) {
    const resultado = await validarCuponAction(parsed.data.cuponCodigo)
    if (!resultado.valido) {
      return { error: resultado.error ?? "El cupón no es válido." }
    }
    porcentajeCupon = resultado.porcentaje
  }

  const precioUnitarioCentimos = encontrado.producto.precioDesde * 100
  const subtotalCentimos = precioUnitarioCentimos * parsed.data.cantidad
  const { precioFinalCentimos, descuentoCentimos, porcentajeAplicado } = calcularPrecioConDescuento(
    subtotalCentimos,
    porcentajeOferta,
    porcentajeCupon
  )
  const cuponGano = porcentajeAplicado > 0 && porcentajeCupon >= porcentajeOferta && !!parsed.data.cuponCodigo
  const envioCentimos = calcularEnvioCentimos(parsed.data.provincia, precioFinalCentimos)

  let pedidoId: string
  try {
    const pedido = await crearPedidoInvitado(parsed.data, precioUnitarioCentimos, {
      descuentoCentimos,
      envioCentimos,
      cuponCodigo: cuponGano ? parsed.data.cuponCodigo?.trim().toUpperCase() : undefined,
    })
    pedidoId = pedido.id
  } catch {
    return { error: "No se pudo registrar el pedido. Intenta de nuevo en unos minutos." }
  }

  if (cuponGano && parsed.data.cuponCodigo) {
    try {
      await registrarUsoCupon(parsed.data.cuponCodigo)
    } catch {
      // El pedido ya se creó — un fallo acá no debe tumbar la confirmación de compra.
    }
  }

  redirect(`/pedido-confirmado/${pedidoId}`)
}
