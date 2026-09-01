import { prisma } from "@/lib/prisma"
import type { CheckoutInput } from "@/lib/validators/checkout.schema"
import type { EstadoPedido } from "@prisma/client"
import { enviarEmailPagoConfirmado, enviarEmailPedidoEnviado } from "./email.service"

interface DescuentoResuelto {
  descuentoCentimos: number
  envioCentimos?: number
  cuponCodigo?: string
}

interface ItemPedido {
  varianteId: string
  cantidad: number
  precioUnitarioCentimos: number
}

// Checkout de invitado (sin cuenta) — ver docs/business-rules.md.
// El stock se descuenta recién cuando el pedido pasa a PAGADO, no al crearse.
// `descuento` ya viene resuelto (oferta de temporada vs. cupón, el mayor de los dos por línea,
// nunca combinados — ver checkoutAction) para que este servicio no tenga que validar nada.
export async function crearPedidoInvitado(
  datos: CheckoutInput,
  items: ItemPedido[],
  descuento: DescuentoResuelto = { descuentoCentimos: 0 }
) {
  const subtotalCentimos = items.reduce((acc, item) => acc + item.precioUnitarioCentimos * item.cantidad, 0)
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
          create: items.map((item) => ({
            varianteId: item.varianteId,
            cantidad: item.cantidad,
            precioUnitarioCentimos: item.precioUnitarioCentimos,
          })),
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

// Único punto de transición de estado de un pedido — lo usan tanto "Marcar como Pagado" en el
// detalle del pedido como la verificación de pago en /admin/pagos (ver pago.service.ts), para que
// nunca queden desincronizados. Al pasar a PAGADO descuenta el stock real (ver business-rules.md);
// V1 no reserva stock al crear el pedido, así que dos pedidos PENDIENTE pueden competir por la
// última unidad — quien se confirme como PAGADO primero se la lleva, el stock puede quedar en 0.
export async function actualizarEstadoPedido(id: string, nuevoEstado: EstadoPedido) {
  const resultado = await prisma.$transaction(async (tx) => {
    const pedido = await tx.pedido.findUniqueOrThrow({ where: { id }, include: { items: true } })

    if (!TRANSICIONES_VALIDAS[pedido.estado].includes(nuevoEstado)) {
      throw new Error(`No se puede pasar de ${pedido.estado} a ${nuevoEstado}`)
    }

    if (nuevoEstado === "PAGADO") {
      for (const item of pedido.items) {
        await tx.variante.update({
          where: { id: item.varianteId },
          data: { stock: { decrement: item.cantidad } },
        })
      }
    }

    const timestamps: Record<string, Date> = {}
    if (nuevoEstado === "ENVIADO") timestamps.enviadoEn = new Date()
    if (nuevoEstado === "ENTREGADO") timestamps.entregadoEn = new Date()
    if (nuevoEstado === "CANCELADO") timestamps.canceladoEn = new Date()

    return tx.pedido.update({
      where: { id },
      data: { estado: nuevoEstado, ...timestamps },
    })
  })

  if (nuevoEstado === "PAGADO") {
    await enviarEmailPagoConfirmado(resultado.id, resultado.nombreCliente, resultado.emailCliente, resultado.totalCentimos)
  }
  if (nuevoEstado === "ENVIADO") {
    await enviarEmailPedidoEnviado(resultado.id, resultado.nombreCliente, resultado.emailCliente)
  }

  return resultado
}
