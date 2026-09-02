import { mpPayment } from "@/lib/mercadopago"
import { SITE_URL } from "@/lib/site"

// Checkout API: el pago se cobra directo desde nuestro servidor (con datos tokenizados en
// el navegador del cliente — nunca vemos número de tarjeta ni CVV) en vez de redirigir a la
// página hospedada de MercadoPago (Checkout Pro, que se usaba antes). El webhook
// (/api/mercadopago/webhook) sigue siendo agnóstico al método — no necesitó cambios.

interface PayerCheckoutApi {
  email: string
  identification?: { type: string; number: string }
  first_name?: string
  last_name?: string
}

export interface DatosPagoBrick {
  token?: string
  issuer_id?: string | number
  payment_method_id: string
  installments?: number
  payer: PayerCheckoutApi
}

// Tarjeta y Pago Efectivo — ambos los arma el Payment Brick de MercadoPago en el navegador,
// nosotros solo reenviamos su formData al cobro real. El monto SIEMPRE es el que calculó
// el servidor (pedido.totalCentimos) — nunca uno que venga del cliente.
export async function crearPagoCheckoutApi(pedidoId: string, totalCentimos: number, datos: DatosPagoBrick) {
  return mpPayment.create({
    body: {
      transaction_amount: totalCentimos / 100,
      token: datos.token,
      issuer_id: datos.issuer_id ? Number(datos.issuer_id) : undefined,
      payment_method_id: datos.payment_method_id,
      installments: datos.installments ?? 1,
      payer: datos.payer,
      external_reference: pedidoId,
      description: `Pedido Nomora #${pedidoId.slice(-8)}`,
      notification_url: `${SITE_URL}/api/mercadopago/webhook`,
    },
    requestOptions: { idempotencyKey: pedidoId },
  })
}

// Yape no lo cubre el Payment Brick — es un formulario propio (teléfono + OTP de 6 dígitos)
// que genera un token vía el SDK de MercadoPago.js, y ese token se cobra igual que una tarjeta.
export async function crearPagoYape(pedidoId: string, totalCentimos: number, token: string, email: string) {
  return mpPayment.create({
    body: {
      transaction_amount: totalCentimos / 100,
      token,
      payment_method_id: "yape",
      payer: { email },
      external_reference: pedidoId,
      description: `Pedido Nomora #${pedidoId.slice(-8)}`,
      notification_url: `${SITE_URL}/api/mercadopago/webhook`,
    },
    requestOptions: { idempotencyKey: `${pedidoId}-yape` },
  })
}
