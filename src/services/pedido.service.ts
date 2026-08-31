import { prisma } from "@/lib/prisma"
import type { CheckoutInput } from "@/lib/validators/checkout.schema"
import type { EstadoPedido } from "@prisma/client"

interface DescuentoResuelto {
  descuentoCentimos: number
  envioCentimos?: number
  cuponCodigo?: string
}

// Checkout de invitado (sin cuenta) — ver docs/business-rules.md.
// El stock se descuenta recién cuando el pedido pasa a PAGADO, no al crearse.
// `descuento` ya viene resuelto (oferta de temporada vs. cupón, el mayor de los dos,
// nunca combinados — ver checkoutAction) para que este servicio no tenga que validar nada.
export async function crearPedidoInvitado(
  datos: CheckoutInput,
  precioUnitarioCentimos: number,
  descuento: DescuentoResuelto = { descuentoCentimos: 0 }
) {
  const subtotalCentimos = precioUnitarioCentimos * datos.cantidad
  const envioCentimos = descuento.envioCentimos ?? 0
  const totalCentimos = Math.max(subtotalCentimos - descuento.descuentoCentimos, 0) + envioCentimos

  return prisma.$transaction(async (tx) => {
    const direccion = await tx.direccion.create({
      data: {
        destinatario: datos.nombre,
        telefono: datos.telefono,
        direccion: datos.direccion,
        distrito: datos.distrito,
        provincia: datos.provincia,
        departamento: datos.departamento,
        referencia: datos.referencia || null,
      },
    })

    const pedido = await tx.pedido.create({
      data: {
        nombreCliente: datos.nombre,
        emailCliente: datos.email,
        direccionId: direccion.id,
        subtotalCentimos,
        descuentoCentimos: descuento.descuentoCentimos,
        envioCentimos,
        cuponCodigo: descuento.cuponCodigo ?? null,
        totalCentimos,
        items: {
          create: [
            {
              varianteId: datos.varianteId,
              cantidad: datos.cantidad,
              precioUnitarioCentimos,
            },
          ],
        },
        pago: {
          create: {
            tipo: datos.metodoPago,
            montoCentimos: totalCentimos,
          },
        },
      },
    })

    return pedido
  })
}

export async function buscarPedidoPorId(id: string) {
  return prisma.pedido.findUnique({
    where: { id },
    include: { items: true, direccion: true, pago: true },
  })
}

// ─── Admin ─────────────────────────────────────────────────────────────────

export async function listarPedidos(estado?: EstadoPedido) {
  return prisma.pedido.findMany({
    where: estado ? { estado } : undefined,
    include: { pago: true },
    orderBy: { creadoEn: "desc" },
    take: 100,
  })
}

export async function contarPedidosPorEstado() {
  const grupos = await prisma.pedido.groupBy({
    by: ["estado"],
    _count: true,
  })
  const conteo: Record<EstadoPedido, number> = {
    PENDIENTE: 0,
    PAGADO: 0,
    ENVIADO: 0,
    ENTREGADO: 0,
    CANCELADO: 0,
  }
  for (const g of grupos) conteo[g.estado] = g._count
  return conteo
}

export async function obtenerPedidoDetalle(id: string) {
  return prisma.pedido.findUnique({
    where: { id },
    include: {
      items: { include: { variante: { include: { producto: true } } } },
      direccion: true,
      pago: true,
      devolucion: true,
    },
  })
}

const TRANSICIONES_VALIDAS: Record<EstadoPedido, EstadoPedido[]> = {
  PENDIENTE: ["PAGADO", "CANCELADO"],
  PAGADO: ["ENVIADO", "CANCELADO"],
  ENVIADO: ["ENTREGADO"],
  ENTREGADO: [],
  CANCELADO: [],
}

export async function actualizarEstadoPedido(id: string, nuevoEstado: EstadoPedido) {
  const pedido = await prisma.pedido.findUniqueOrThrow({ where: { id } })

  if (!TRANSICIONES_VALIDAS[pedido.estado].includes(nuevoEstado)) {
    throw new Error(`No se puede pasar de ${pedido.estado} a ${nuevoEstado}`)
  }

  const timestamps: Record<string, Date> = {}
  if (nuevoEstado === "ENVIADO") timestamps.enviadoEn = new Date()
  if (nuevoEstado === "ENTREGADO") timestamps.entregadoEn = new Date()
  if (nuevoEstado === "CANCELADO") timestamps.canceladoEn = new Date()

  return prisma.pedido.update({
    where: { id },
    data: { estado: nuevoEstado, ...timestamps },
  })
}
