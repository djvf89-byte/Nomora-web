import { obtenerClienteResend, EMAIL_FROM } from "@/lib/resend"
import { formatSoles } from "@/lib/format"
import { SITE_URL } from "@/lib/site"

const NEGRO = "#0b0b0b"
const BLANCO_HUESO = "#f2efe9"
const BEIGE = "#cdba9b"
const VERDE_OLIVA = "#6b705c"
const TERRACOTA = "#e07a5f"

interface ItemEmail {
  nombre: string
  detalle?: string
  cantidad: number
  precioUnitarioCentimos: number
  imagen?: string
}

interface DireccionEmail {
  direccion: string
  distrito: string
  provincia: string
  departamento: string
  referencia?: string
}

interface PedidoEmailData {
  pedidoId: string
  nombreCliente: string
  emailCliente: string
  items: ItemEmail[]
  direccion: DireccionEmail
  subtotalCentimos: number
  descuentoCentimos: number
  envioCentimos: number
  totalCentimos: number
}

function numeroPedido(pedidoId: string) {
  return pedidoId.slice(-8).toUpperCase()
}

function urlAbsoluta(ruta: string) {
  return ruta.startsWith("http") ? ruta : `${SITE_URL}${ruta}`
}

// Envoltorio compartido — tablas y estilos inline (los clientes de correo no aplican CSS
// externo ni la mayoría de selectores modernos; las tablas son lo más confiable entre clientes).
function plantillaBase(emoji: string, titulo: string, subtitulo: string, contenidoHtml: string) {
  return `
    <div style="background:${BLANCO_HUESO};padding:28px 12px;font-family:Arial,Helvetica,sans-serif;">
      <table role="presentation" width="100%" style="max-width:560px;margin:0 auto;border-collapse:collapse;background:#ffffff;">
        <tr>
          <td style="background:${NEGRO};padding:24px 28px;text-align:center;">
            <img src="${SITE_URL}/email/logo.png" width="140" alt="Nomora" style="display:inline-block;width:140px;height:auto;" />
          </td>
        </tr>
        <tr>
          <td style="background:linear-gradient(135deg, ${TERRACOTA} 0%, ${VERDE_OLIVA} 100%);padding:28px;text-align:center;">
            <div style="font-size:32px;line-height:1;">${emoji}</div>
            <div style="margin-top:8px;color:#ffffff;font-size:22px;font-weight:800;">${titulo}</div>
            <div style="margin-top:4px;color:rgba(255,255,255,0.9);font-size:14px;">${subtitulo}</div>
          </td>
        </tr>
        <tr>
          <td style="padding:28px;">
            ${contenidoHtml}
          </td>
        </tr>
        <tr>
          <td style="padding:20px 28px;border-top:1px solid #eee;text-align:center;">
            <p style="margin:0;color:#8a8578;font-size:12px;">Nomora — productos para la aventura, hechos en el Perú.</p>
            <p style="margin:6px 0 0;color:#8a8578;font-size:12px;">
              ¿Dudas? Escríbenos a
              <a href="mailto:${EMAIL_FROM}" style="color:${TERRACOTA};text-decoration:none;">${EMAIL_FROM}</a>
            </p>
          </td>
        </tr>
      </table>
    </div>
  `
}

function chipPedido(pedidoId: string) {
  return `
    <div style="text-align:center;margin-bottom:24px;">
      <span style="display:inline-block;background:${BEIGE}33;color:${NEGRO};font-family:'Courier New',monospace;font-size:12px;letter-spacing:0.08em;padding:6px 14px;border-radius:20px;">
        PEDIDO #${numeroPedido(pedidoId)}
      </span>
    </div>
  `
}

function tablaItems(items: ItemEmail[]) {
  return `
    <table role="presentation" width="100%" style="border-collapse:collapse;">
      ${items
        .map(
          (item) => `
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #f0ede6;width:56px;">
            ${
              item.imagen
                ? `<img src="${urlAbsoluta(item.imagen)}" width="56" height="56" alt="${item.nombre}" style="display:block;width:56px;height:56px;object-fit:contain;background:${BLANCO_HUESO};border-radius:4px;" />`
                : `<div style="width:56px;height:56px;background:${BLANCO_HUESO};border-radius:4px;"></div>`
            }
          </td>
          <td style="padding:12px 0 12px 14px;border-bottom:1px solid #f0ede6;">
            <div style="font-weight:700;color:${NEGRO};font-size:14px;">${item.nombre}</div>
            ${item.detalle ? `<div style="color:#8a8578;font-size:12.5px;margin-top:2px;">${item.detalle}</div>` : ""}
            <div style="color:#8a8578;font-size:12.5px;margin-top:2px;">Cantidad: ${item.cantidad}</div>
          </td>
          <td style="padding:12px 0;border-bottom:1px solid #f0ede6;text-align:right;white-space:nowrap;vertical-align:top;font-weight:600;color:${NEGRO};font-size:14px;">
            ${formatSoles(item.precioUnitarioCentimos * item.cantidad)}
          </td>
        </tr>
      `
        )
        .join("")}
    </table>
  `
}

function filaTotal(etiqueta: string, valor: string, destacado = false) {
  return `
    <tr>
      <td style="padding:${destacado ? "10px" : "4px"} 0 4px;${destacado ? `font-weight:800;font-size:17px;color:${NEGRO};border-top:1px solid #f0ede6;` : "color:#8a8578;font-size:14px;"}">${etiqueta}</td>
      <td style="padding:${destacado ? "10px" : "4px"} 0 4px;text-align:right;${destacado ? `font-weight:800;font-size:17px;color:${NEGRO};border-top:1px solid #f0ede6;` : "color:#8a8578;font-size:14px;"}">${valor}</td>
    </tr>
  `
}

function bloqueDireccion(direccion: DireccionEmail) {
  return `
    <div style="margin-top:24px;padding:16px 18px;background:${BLANCO_HUESO};border-radius:6px;">
      <div style="font-size:11px;font-weight:700;letter-spacing:0.1em;color:#8a8578;text-transform:uppercase;">Enviamos tu pedido a</div>
      <div style="margin-top:6px;color:${NEGRO};font-size:14px;line-height:1.5;">
        ${direccion.direccion}<br />
        ${direccion.distrito}, ${direccion.provincia}, ${direccion.departamento}
        ${direccion.referencia ? `<br />Ref: ${direccion.referencia}` : ""}
      </div>
    </div>
  `
}

// Se envía apenas se crea el pedido (estado PENDIENTE) — antes de que se confirme el pago.
export async function enviarEmailPedidoRecibido(datos: PedidoEmailData) {
  const contenido = `
    ${chipPedido(datos.pedidoId)}
    <p style="color:#4a4a4a;line-height:1.6;font-size:15px;margin:0 0 20px;">
      Hola ${datos.nombreCliente}, recibimos tu pedido. Te escribimos de nuevo apenas confirmemos tu pago.
    </p>
    ${tablaItems(datos.items)}
    <table role="presentation" width="100%" style="border-collapse:collapse;margin-top:6px;">
      ${filaTotal("Subtotal", formatSoles(datos.subtotalCentimos))}
      ${datos.descuentoCentimos > 0 ? filaTotal("Descuento", `−${formatSoles(datos.descuentoCentimos)}`) : ""}
      ${filaTotal("Envío", datos.envioCentimos > 0 ? formatSoles(datos.envioCentimos) : "Gratis")}
      ${filaTotal("Total", formatSoles(datos.totalCentimos), true)}
    </table>
    ${bloqueDireccion(datos.direccion)}
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
      html: plantillaBase("🎒", "¡Pedido recibido!", "Ya lo estamos procesando", contenido),
    })
  } catch (err) {
    // Un fallo de email nunca debe tumbar el checkout.
    console.error("Error enviando email de pedido recibido:", err)
  }
}

// Se envía cuando el pedido pasa a ENVIADO (admin marca despacho).
export async function enviarEmailPedidoEnviado(pedidoId: string, nombreCliente: string, emailCliente: string) {
  const contenido = `
    ${chipPedido(pedidoId)}
    <p style="color:#4a4a4a;line-height:1.6;font-size:15px;margin:0;">
      Hola ${nombreCliente}, tu pedido ya salió de nuestro almacén y está en camino.
      Te avisaremos cuando llegue a tus manos.
    </p>
  `

  const resend = obtenerClienteResend()
  if (!resend) {
    console.warn("RESEND_API_KEY no configurado — no se envió el email de pedido enviado.")
    return
  }

  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to: emailCliente,
      subject: `¡Tu pedido está en camino! Pedido #${numeroPedido(pedidoId)}`,
      html: plantillaBase("🚚", "¡Pedido en camino!", "Tu aventura está por llegar", contenido),
    })
  } catch (err) {
    console.error("Error enviando email de pedido enviado:", err)
  }
}

// Se envía cuando el pedido pasa a PAGADO (verificación manual o webhook de MercadoPago).
export async function enviarEmailPagoConfirmado(pedidoId: string, nombreCliente: string, emailCliente: string, totalCentimos: number) {
  const contenido = `
    ${chipPedido(pedidoId)}
    <p style="color:#4a4a4a;line-height:1.6;font-size:15px;margin:0;">
      Hola ${nombreCliente}, confirmamos tu pago por <b style="color:${NEGRO};">${formatSoles(totalCentimos)}</b>.
      Ya estamos preparando tu envío — te avisaremos cuando esté en camino.
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
      html: plantillaBase("✅", "¡Pago confirmado!", "Tu aventura está en camino", contenido),
    })
  } catch (err) {
    console.error("Error enviando email de pago confirmado:", err)
  }
}
