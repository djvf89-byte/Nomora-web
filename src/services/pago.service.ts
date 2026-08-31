import { prisma } from "@/lib/prisma"
import { actualizarEstadoPedido } from "./pedido.service"

export async function listarPagosPendientes() {
  return prisma.pago.findMany({
    where: { estado: "PENDIENTE" },
    include: { pedido: true },
    orderBy: { creadoEn: "asc" },
    take: 100,
  })
}

// Verificar un pago manual (Yape/Plin/transferencia) confirma también el pedido — ver docs/business-rules.md.
// La transición del pedido pasa por actualizarEstadoPedido (pedido.service.ts), la misma función
// que usa "Marcar como Pagado" en el detalle del pedido, para que ambos caminos queden coordinados
// y el stock se descuente una sola vez. Si el pedido ya no está PENDIENTE (p.ej. ya lo marcaron
// pagado por el otro camino), la transición falla y el pago NO queda marcado como verificado.
export async function verificarPago(pagoId: string, adminId: string) {
  const pago = await prisma.pago.findUniqueOrThrow({ where: { id: pagoId } })

  await actualizarEstadoPedido(pago.pedidoId, "PAGADO")

  return prisma.pago.update({
    where: { id: pagoId },
    data: { estado: "VERIFICADO", verificadoPorId: adminId, verificadoEn: new Date() },
  })
}

export async function rechazarPago(pagoId: string, adminId: string) {
  return prisma.pago.update({
    where: { id: pagoId },
    data: { estado: "RECHAZADO", verificadoPorId: adminId, verificadoEn: new Date() },
  })
}
