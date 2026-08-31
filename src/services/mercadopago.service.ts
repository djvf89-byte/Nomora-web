import { mpPreference } from "@/lib/mercadopago"
import { SITE_URL } from "@/lib/site"

// Un solo ítem por preferencia con el total ya calculado (descuento + envío incluidos)
// en vez de desglosar producto por producto — así el monto que cobra MercadoPago siempre
// coincide exactamente con pedido.totalCentimos, sin riesgo de redondeo por línea.
export async function crearPreferenciaPago(
  pedidoId: string,
  descripcion: string,
  totalCentimos: number,
  email: string
) {
  const esHttps = SITE_URL.startsWith("https")

  const preferencia = await mpPreference.create({
    body: {
      items: [
        {
          id: pedidoId,
          title: descripcion,
          quantity: 1,
          currency_id: "PEN",
          unit_price: totalCentimos / 100,
        },
      ],
      payer: { email },
      external_reference: pedidoId,
      back_urls: {
        success: `${SITE_URL}/pedido-confirmado/${pedidoId}`,
        pending: `${SITE_URL}/pedido-confirmado/${pedidoId}`,
        failure: `${SITE_URL}/checkout`,
      },
      // auto_return exige back_urls https — en dev (localhost) se omite y el usuario
      // vuelve manualmente con el botón de MercadoPago.
      auto_return: esHttps ? "approved" : undefined,
      notification_url: `${SITE_URL}/api/mercadopago/webhook`,
    },
  })

  return preferencia
}
