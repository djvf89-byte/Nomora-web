"use server"

import { redirect } from "next/navigation"
import { checkoutSchema } from "@/lib/validators/checkout.schema"
import { buscarVariante } from "@/constants/catalogo"
import { crearPedidoInvitado } from "@/services/pedido.service"
import { validarCupon, registrarUsoCupon } from "@/services/cupon.service"
import { obtenerOfertasActivasPorProducto } from "@/services/oferta.service"
import { obtenerStockPorVariante } from "@/services/producto.service"
import { crearPreferenciaPago } from "@/services/mercadopago.service"
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

// Mapa productoSlug -> % de oferta activa, para mostrar el descuento de cada línea
// del carrito en el checkout antes de enviar el pedido.
export async function obtenerOfertasActivasAction(): Promise<Record<string, number>> {
  try {
    return await obtenerOfertasActivasPorProducto()
  } catch {
    return {}
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

  // Yape, transferencia bancaria y tarjeta van todas al checkout hospedado de MercadoPago
  // (ahí el cliente elige el método real: Yape, banca y agentes, o tarjeta). El webhook
  // confirma el pago solo (ver /api/mercadopago/webhook) y marca PAGADO — sin verificación
  // manual del admin ni comprobante que subir.
  let checkoutUrl: string | undefined
  const totalCentimos = precioFinalCentimos + envioCentimos
  try {
    const preferencia = await crearPreferenciaPago(
      pedidoId,
      `Pedido Nomora #${pedidoId.slice(-8)}`,
      totalCentimos,
      parsed.data.email
    )
    checkoutUrl = preferencia.sandbox_init_point ?? preferencia.init_point
  } catch (err) {
    // El pedido ya quedó como PENDIENTE — si MercadoPago falla, lo mandamos a la
    // confirmación igual; el admin puede procesar el pago manualmente después.
    console.error("Error creando preferencia de MercadoPago:", err)
  }

  // redirect() lanza internamente — nunca debe llamarse dentro de un try/catch.
  if (checkoutUrl) redirect(checkoutUrl)
  redirect(`/pedido-confirmado/${pedidoId}`)
}
