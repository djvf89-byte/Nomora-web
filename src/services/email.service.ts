import { obtenerClienteResend, EMAIL_FROM } from "@/lib/resend"
import { formatSoles } from "@/lib/format"

interface ItemEmail {
  nombre: string
  detalle?: string
  cantidad: number
  precioUnitarioCentimos: number
}

interface PedidoEmailData {
  pedidoId: string
  nombreCliente: string
  emailCliente: string
  items: ItemEmail[]
  subtotalCentimos: number
  descuentoCentimos: number
  envioCentimos: number
  totalCentimos: number
}

function numeroPedido(pedidoId: string) {
  return pedidoId.slice(-8).toUpperCase()
}

// Envoltorio compartido — HTML simple con estilos inline (los clientes de correo
// no aplican CSS externo ni la mayoría de selectores modernos).
function plantillaBase(titulo: string, contenidoHtml: string) {
  return `
    <div style="background:#f2efe9;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;color:#1a1a1a;">
      <div style="max-width:520px;margin:0 auto;background:#ffffff;border:1px solid #e5e1d8;">
        <div style="background:#1a1a1a;padding:20px 24px;">
          <span style="color:#ffffff;font-weight:900;letter-spacing:0.14em;font-size:18px;">NOMORA</span>
        </div>
        <div style="padding:28px 24px;">
          <h1 style="font-size:20px;margin:0 0 16px;">${titulo}</h1>
          ${contenidoHtml}
        </div>
        <div style="padding:16px 24px;border-top:1px solid #e5e1d8;color:#8a8578;font-size:12px;">
          Nomora — productos para la aventura, hechos en el Perú.
        </div>
      </div>
    </div>
  `
}

function tablaItems(items: ItemEmail[]) {
  return items
    .map(
      (item) => `
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #eee;">
            <div style="font-weight:600;">${item.nombre}</div>
            ${item.detalle ? `<div style="color:#8a8578;font-size:13px;">${item.detalle}</div>` : ""}
            <div style="color:#8a8578;font-size:13px;">Cantidad: ${item.cantidad}</div>
          </td>
          <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;white-space:nowrap;">
            ${formatSoles(item.precioUnitarioCentimos * item.cantidad)}
          </td>
        </tr>
      `
    )
    .join("")
}

function filaTotal(etiqueta: string, valor: string, destacado = false) {
  return `
    <tr>
      <td style="padding:4px 0;${destacado ? "font-weight:700;font-size:16px;" : "color:#8a8578;"}">${etiqueta}</td>
      <td style="padding:4px 0;text-align:right;${destacado ? "font-weight:700;font-size:16px;" : "color:#8a8578;"}">${valor}</td>
    </tr>
  `
}

// Se envía apenas se crea el pedido (estado PENDIENTE) — antes de que se confirme el pago.
export async function enviarEmailPedidoRecibido(datos: PedidoEmailData) {
  const contenido = `
    <p style="color:#4a4a4a;line-height:1.5;">
      Hola ${datos.nombreCliente}, recibimos tu pedido <b>#${numeroPedido(datos.pedidoId)}</b>.
      Te escribimos de nuevo apenas confirmemos tu pago.
    </p>
    <table style="width:100%;border-collapse:collapse;margin-top:16px;">
      ${tablaItems(datos.items)}
    </table>
    <table style="width:100%;border-collapse:collapse;margin-top:12px;">
      ${filaTotal("Subtotal", formatSoles(datos.subtotalCentimos))}
      ${datos.descuentoCentimos > 0 ? filaTotal("Descuento", `−${formatSoles(datos.descuentoCentimos)}`) : ""}
      ${filaTotal("Envío", datos.envioCentimos > 0 ? formatSoles(datos.envioCentimos) : "Gratis")}
      ${filaTotal("Total", formatSoles(datos.totalCentimos), true)}
    </table>
  `

  const resend = obtenerClienteResend()
  if (!resend) {
    console.warn("RESEND_API_KEY no configurado — no se envió el email de pedido recibido.")
    return
  }

  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to: datos.emailCliente,
      subject: `Recibimos tu pedido #${numeroPedido(datos.pedidoId)}`,
      html: plantillaBase("¡Pedido recibido!", contenido),
    })
  } catch (err) {
    // Un fallo de email nunca debe tumbar el checkout.
    console.error("Error enviando email de pedido recibido:", err)
  }
}

// Se envía cuando el pedido pasa a PAGADO (verificación manual o webhook de MercadoPago).
export async function enviarEmailPagoConfirmado(pedidoId: string, nombreCliente: string, emailCliente: string, totalCentimos: number) {
  const contenido = `
    <p style="color:#4a4a4a;line-height:1.5;">
      Hola ${nombreCliente}, confirmamos tu pago del pedido <b>#${numeroPedido(pedidoId)}</b> por
      <b>${formatSoles(totalCentimos)}</b>. Ya estamos preparando tu envío.
    </p>
  `

  const resend = obtenerClienteResend()
  if (!resend) {
    console.warn("RESEND_API_KEY no configurado — no se envió el email de pago confirmado.")
    return
  }

  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to: emailCliente,
      subject: `¡Tu pago fue confirmado! Pedido #${numeroPedido(pedidoId)}`,
      html: plantillaBase("¡Pago confirmado!", contenido),
    })
  } catch (err) {
    console.error("Error enviando email de pago confirmado:", err)
  }
}
