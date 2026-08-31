import { NextResponse } from "next/server"
import { createHmac } from "node:crypto"
import { revalidatePath } from "next/cache"
import { mpPayment } from "@/lib/mercadopago"
import { prisma } from "@/lib/prisma"
import { actualizarEstadoPedido } from "@/services/pedido.service"

// Verifica la firma que manda MercadoPago (header x-signature) según su algoritmo documentado:
// HMAC-SHA256 de "id:{dataId};request-id:{x-request-id};ts:{ts};" con el secreto del webhook.
// Sin MP_WEBHOOK_SECRET configurado no hay forma de verificar — se deja pasar con un aviso en
// logs (útil mientras se configura), pero en producción esa variable debe estar seteada.
function firmaValida(request: Request, dataId: string): boolean {
  const secreto = process.env.MP_WEBHOOK_SECRET
  if (!secreto) {
    console.warn("MP_WEBHOOK_SECRET no configurado — webhook aceptado sin verificar firma.")
    return true
  }

  const signature = request.headers.get("x-signature")
  const requestId = request.headers.get("x-request-id")
  if (!signature || !requestId) return false

  const partes: Record<string, string> = {}
  for (const parte of signature.split(",")) {
    const [clave, valor] = parte.split("=").map((s) => s.trim())
    if (clave && valor) partes[clave] = valor
  }
  const { ts, v1 } = partes
  if (!ts || !v1) return false

  const manifest = `id:${dataId};request-id:${requestId};ts:${ts};`
  const hmac = createHmac("sha256", secreto).update(manifest).digest("hex")

  return hmac === v1
}

export async function POST(request: Request) {
  const url = new URL(request.url)

  let body: { data?: { id?: string }; type?: string } | null = null
  try {
    body = await request.json()
  } catch {
    body = null
  }

  const dataId = body?.data?.id ?? url.searchParams.get("data.id") ?? url.searchParams.get("id")
  const tipo = body?.type ?? url.searchParams.get("type") ?? url.searchParams.get("topic")

  // MercadoPago manda notificaciones de varios tipos (merchant_order, etc.) — solo nos
  // interesan las de pago. Respondemos 200 igual para que no reintenten indefinidamente.
  if (!dataId || tipo !== "payment") {
    return NextResponse.json({ ok: true })
  }

  if (!firmaValida(request, String(dataId))) {
    console.error("Firma de webhook de MercadoPago inválida — dataId:", dataId)
    return NextResponse.json({ error: "Firma inválida" }, { status: 401 })
  }

  try {
    // Nunca confiar en el estado que viene en la notificación — siempre se vuelve a
    // consultar el pago directamente a la API de MercadoPago.
    const pago = await mpPayment.get({ id: String(dataId) })
    const pedidoId = pago.external_reference
    if (!pedidoId || pago.status !== "approved") {
      return NextResponse.json({ ok: true })
    }

    const pedido = await prisma.pedido.findUnique({ where: { id: pedidoId }, include: { pago: true } })
    if (!pedido || pedido.estado !== "PENDIENTE") {
      return NextResponse.json({ ok: true })
    }

    await actualizarEstadoPedido(pedidoId, "PAGADO")
    if (pedido.pago) {
      await prisma.pago.update({
        where: { id: pedido.pago.id },
        data: { estado: "VERIFICADO", referenciaExterna: String(dataId), verificadoEn: new Date() },
      })
    }
    revalidatePath("/catalogo/[slug]", "page")
  } catch (err) {
    console.error("Error procesando webhook de MercadoPago:", err)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}

// MercadoPago a veces hace una prueba GET al guardar la URL del webhook en su panel.
export async function GET() {
  return NextResponse.json({ ok: true })
}
