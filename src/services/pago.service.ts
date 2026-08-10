import { prisma } from "@/lib/prisma"

export async function listarPagosPendientes() {
  return prisma.pago.findMany({
    where: { estado: "PENDIENTE" },
    include: { pedido: true },
    orderBy: { creadoEn: "asc" },
    take: 100,
  })
}

// Verificar un pago manual (Yape/Plin/transferencia) confirma también el pedido — ver docs/business-rules.md.
export async function verificarPago(pagoId: string, adminId: string) {
  const pago = await prisma.pago.findUniqueOrThrow({ where: { id: pagoId } })

  return prisma.$transaction([
    prisma.pago.update({
      where: { id: pagoId },
      data: { estado: "VERIFICADO", verificadoPorId: adminId, verificadoEn: new Date() },
    }),
    prisma.pedido.update({
      where: { id: pago.pedidoId },
      data: { estado: "PAGADO" },
    }),
  ])
}

export async function rechazarPago(pagoId: string, adminId: string) {
  return prisma.pago.update({
    where: { id: pagoId },
    data: { estado: "RECHAZADO", verificadoPorId: adminId, verificadoEn: new Date() },
  })
}
