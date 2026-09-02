"use server"

import type { TipoPago } from "@prisma/client"
import { checkoutSchema } from "@/lib/validators/checkout.schema"
import { buscarVariante } from "@/constants/catalogo"
import { crearPedidoInvitado, actualizarEstadoPedido } from "@/services/pedido.service"
import { validarCupon, registrarUsoCupon } from "@/services/cupon.service"
import { obtenerOfertasActivasPorProducto } from "@/services/oferta.service"
import { obtenerStockPorVariante } from "@/services/producto.service"
import { crearPagoCheckoutApi, crearPagoYape, type DatosPagoBrick } from "@/services/mercadopago.service"
import { enviarEmailPedidoRecibido } from "@/services/email.service"
import { calcularPrecioConDescuento, calcularEnvioCentimos } from "@/lib/precios"
import { prisma } from "@/lib/prisma"

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

// Mapa productoSlug -> % de oferta activa, para mostrar el descuento de cada línea
// del carrito en el checkout antes de enviar el pedido.
export async function obtenerOfertasActivasAction(): Promise<Record<string, number>> {
  try {
    return await obtenerOfertasActivasPorProducto()
  } catch {
    return {}
  }
}

// Mapa varianteId -> stock real en BD, para resolver el carrito (/carrito y /checkout) contra el
// inventario real en vez del catálogo estático (que el admin no edita — ver aplicarStockReal).
export async function obtenerStockCarritoAction(): Promise<Record<string, number>> {
  try {
    return await obtenerStockPorVariante()
  } catch {
    return {}
  }
}

// Usado mientras se muestra el StatusScreen de Pago Efectivo (pago pendiente) para saber
// cuándo el webhook ya confirmó el pago y redirigir a la confirmación — el Brick no avisa
// solo cuándo el estado final cambió, así que este polling liviano lo hacemos nosotros.
export async function obtenerEstadoPedidoAction(pedidoId: string): Promise<string | null> {
  try {
    const pedido = await prisma.pedido.findUnique({ where: { id: pedidoId }, select: { estado: true } })
    return pedido?.estado ?? null
  } catch {
    return null
  }
}

interface ResultadoCrearPedido {
  error?: string
  pedidoId?: string
  totalCentimos?: number
}

// Fase 1 del checkout: valida datos + stock, crea el Pedido (PENDIENTE, sin método de pago
// todavía) y envía el email de "pedido recibido". No cobra nada — eso lo hace el Payment
// Brick / formulario de Yape en la fase 2, ver procesarPagoBrickAction/procesarPagoYapeAction.
export async function crearPedidoAction(formData: FormData): Promise<ResultadoCrearPedido> {
  const datos = {
    nombre: formData.get("nombre") as string,
    email: formData.get("email") as string,
    telefono: formData.get("telefono") as string,
    direccion: formData.get("direccion") as string,
    departamento: formData.get("departamento") as string,
    provincia: formData.get("provincia") as string,
    distrito: formData.get("distrito") as string,
    referencia: (formData.get("referencia") as string) || undefined,
    aceptaTerminos: formData.get("aceptaTerminos") as string,
    items: formData.get("items") as string,
    cuponCodigo: (formData.get("cuponCodigo") as string) || undefined,
  }

  const parsed = checkoutSchema.safeParse(datos)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Revisa los datos ingresados." }
  }

  const resueltos = parsed.data.items.map((item) => ({
    item,
    encontrado: buscarVariante(item.productoSlug, item.varianteId),
  }))

  // El stock real vive en la BD (lo edita el admin) — el catálogo estático solo tiene contenido
  // (nombre, precio, imágenes). Validar contra la BD evita vender una unidad que ya no existe.
  let stockPorVariante: Record<string, number>
  try {
    stockPorVariante = await obtenerStockPorVariante()
  } catch {
    return { error: "No se pudo verificar el stock disponible. Intenta de nuevo en unos minutos." }
  }

  for (const { item, encontrado } of resueltos) {
    if (!encontrado) {
      return { error: "Uno de los productos de tu carrito ya no está disponible." }
    }
    const stockReal = stockPorVariante[item.varianteId] ?? encontrado.variante.stock
    if (stockReal <= 0) {
      return { error: "Uno de los productos de tu carrito ya no está disponible." }
    }
    if (item.cantidad > stockReal) {
      return { error: `Solo quedan ${stockReal} unidades de ${encontrado.producto.nombre}.` }
    }
  }

  // Oferta de temporada y cupón no se combinan — por cada línea se aplica el mayor de los dos.
  let ofertasPorProducto: Record<string, number> = {}
  try {
    ofertasPorProducto = await obtenerOfertasActivasPorProducto()
  } catch {
    // Sin conexión a BD: seguimos sin ofertas aplicadas en vez de bloquear la compra.
  }

  let porcentajeCupon = 0
  if (parsed.data.cuponCodigo) {
    const resultado = await validarCuponAction(parsed.data.cuponCodigo)
    if (!resultado.valido) {
      return { error: resultado.error ?? "El cupón no es válido." }
    }
    porcentajeCupon = resultado.porcentaje
  }

  let subtotalCentimos = 0
  let descuentoCentimos = 0
  let cuponContribuyo = false
  const itemsPedido = resueltos.map(({ item, encontrado }) => {
    const producto = encontrado!.producto
    const precioUnitarioCentimos = producto.precioDesde * 100
    const lineaSubtotalCentimos = precioUnitarioCentimos * item.cantidad
    const porcentajeOferta = ofertasPorProducto[item.productoSlug] ?? 0
    const linea = calcularPrecioConDescuento(lineaSubtotalCentimos, porcentajeOferta, porcentajeCupon)

    subtotalCentimos += lineaSubtotalCentimos
    descuentoCentimos += linea.descuentoCentimos
    if (linea.porcentajeAplicado > 0 && porcentajeCupon > 0 && porcentajeCupon >= porcentajeOferta) {
      cuponContribuyo = true
    }

    return { varianteId: item.varianteId, cantidad: item.cantidad, precioUnitarioCentimos }
  })

  const precioFinalCentimos = subtotalCentimos - descuentoCentimos
  const envioCentimos = calcularEnvioCentimos(parsed.data.provincia, precioFinalCentimos)
  const cuponGano = cuponContribuyo && !!parsed.data.cuponCodigo

  let pedidoId: string
  try {
    const pedido = await crearPedidoInvitado(parsed.data, itemsPedido, {
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

  await enviarEmailPedidoRecibido({
    pedidoId,
    nombreCliente: parsed.data.nombre,
    emailCliente: parsed.data.email,
    items: resueltos.map(({ item, encontrado }) => ({
      nombre: encontrado!.producto.nombre,
      detalle: [encontrado!.variante.talla, encontrado!.variante.color, encontrado!.variante.diseno]
        .filter(Boolean)
        .join(" · "),
      cantidad: item.cantidad,
      precioUnitarioCentimos: encontrado!.producto.precioDesde * 100,
      imagen: encontrado!.variante.imagen,
    })),
    direccion: {
      direccion: parsed.data.direccion,
      distrito: parsed.data.distrito,
      provincia: parsed.data.provincia,
      departamento: parsed.data.departamento,
      referencia: parsed.data.referencia,
    },
    subtotalCentimos,
    descuentoCentimos,
    envioCentimos,
    totalCentimos: precioFinalCentimos + envioCentimos,
  })

  return { pedidoId, totalCentimos: precioFinalCentimos + envioCentimos }
}

interface ResultadoPago {
  error?: string
  status?: string
  paymentId?: string
}

// A partir del payment_method_id que realmente usó MercadoPago (nunca de lo que mande el
// cliente) — Tarjeta cubre todas las marcas (visa, master, amex, etc.) que no sean Yape/PagoEfectivo.
function mapearTipoPago(paymentMethodId: string | undefined): TipoPago {
  if (paymentMethodId === "yape") return "YAPE"
  if (paymentMethodId === "pagoefectivo_atm") return "PAGO_EFECTIVO"
  return "TARJETA"
}

// Deja el Pago en BD reflejando lo que MercadoPago realmente procesó, y si quedó aprobado
// transiciona el Pedido a PAGADO — de forma defensiva, ya que el webhook (que es la fuente
// de verdad asíncrona) puede llegar antes o después y ya es idempotente por su cuenta.
async function finalizarPago(pedidoId: string, resultado: { id?: number; status?: string; payment_method_id?: string }) {
  const pedido = await prisma.pedido.findUnique({ where: { id: pedidoId }, include: { pago: true } })

  if (pedido?.pago) {
    await prisma.pago.update({
      where: { id: pedido.pago.id },
      data: {
        tipo: mapearTipoPago(resultado.payment_method_id),
        referenciaExterna: resultado.id ? String(resultado.id) : undefined,
        estado: resultado.status === "approved" ? "VERIFICADO" : "PENDIENTE",
      },
    })
  }

  if (resultado.status === "approved") {
    try {
      await actualizarEstadoPedido(pedidoId, "PAGADO")
    } catch {
      // Ya lo hizo el webhook (u otra llamada) primero — no es un error real.
    }
  }
}

// Fase 2 del checkout — Tarjeta o Pago Efectivo, vía el Payment Brick embebido. `datos` es el
// formData que entrega el propio Brick (token/issuer/payment_method_id/payer ya tokenizados
// en el navegador del cliente — nunca vemos número de tarjeta ni CVV acá).
export async function procesarPagoBrickAction(pedidoId: string, datos: DatosPagoBrick): Promise<ResultadoPago> {
  const pedido = await prisma.pedido.findUnique({ where: { id: pedidoId } })
  if (!pedido) return { error: "Pedido no encontrado." }
  if (pedido.estado !== "PENDIENTE") return { error: "Este pedido ya fue procesado." }

  try {
    const resultado = await crearPagoCheckoutApi(pedidoId, pedido.totalCentimos, datos)
    await finalizarPago(pedidoId, resultado)
    return { status: resultado.status, paymentId: resultado.id ? String(resultado.id) : undefined }
  } catch (err) {
    console.error("Error procesando pago (Checkout API):", err)
    return { error: "No se pudo procesar el pago. Verifica los datos e intenta de nuevo." }
  }
}

// Fase 2 del checkout — Yape, vía el formulario propio de teléfono + OTP (no lo cubre el
// Payment Brick). `token` ya viene generado por el SDK de MercadoPago.js a partir del OTP.
export async function procesarPagoYapeAction(pedidoId: string, token: string, email: string): Promise<ResultadoPago> {
  const pedido = await prisma.pedido.findUnique({ where: { id: pedidoId } })
  if (!pedido) return { error: "Pedido no encontrado." }
  if (pedido.estado !== "PENDIENTE") return { error: "Este pedido ya fue procesado." }

  try {
    const resultado = await crearPagoYape(pedidoId, pedido.totalCentimos, token, email)
    await finalizarPago(pedidoId, resultado)
    return { status: resultado.status, paymentId: resultado.id ? String(resultado.id) : undefined }
  } catch (err) {
    console.error("Error procesando pago Yape:", err)
    return { error: "No se pudo procesar el pago con Yape. Verifica el código e intenta de nuevo." }
  }
}
