import { prisma } from "@/lib/prisma"

export interface VentaPorDia {
  fecha: string // YYYY-MM-DD
  totalCentimos: number
  pedidos: number
}

// Ventas de los últimos N días, contando solo pedidos que llegaron a pagarse
// (PAGADO/ENVIADO/ENTREGADO) — un PENDIENTE o CANCELADO no es venta real todavía.
export async function obtenerVentasPorDia(dias = 14): Promise<VentaPorDia[]> {
  const desde = new Date()
  desde.setDate(desde.getDate() - (dias - 1))
  desde.setHours(0, 0, 0, 0)

  const pedidos = await prisma.pedido.findMany({
    where: {
      creadoEn: { gte: desde },
      estado: { in: ["PAGADO", "ENVIADO", "ENTREGADO"] },
    },
    select: { creadoEn: true, totalCentimos: true },
  })

  const porDia = new Map<string, { totalCentimos: number; pedidos: number }>()
  for (let i = 0; i < dias; i++) {
    const d = new Date(desde)
    d.setDate(d.getDate() + i)
    porDia.set(d.toISOString().slice(0, 10), { totalCentimos: 0, pedidos: 0 })
  }

  for (const pedido of pedidos) {
    const key = pedido.creadoEn.toISOString().slice(0, 10)
    const actual = porDia.get(key)
    if (actual) {
      actual.totalCentimos += pedido.totalCentimos
      actual.pedidos += 1
    }
  }

  return Array.from(porDia.entries()).map(([fecha, valores]) => ({ fecha, ...valores }))
}

export interface ProductoVendido {
  nombre: string
  unidades: number
}

export async function obtenerTopProductos(limite = 5): Promise<ProductoVendido[]> {
  const items = await prisma.pedidoItem.findMany({
    where: { pedido: { estado: { in: ["PAGADO", "ENVIADO", "ENTREGADO"] } } },
    select: { cantidad: true, variante: { select: { producto: { select: { nombre: true } } } } },
  })

  const porProducto = new Map<string, number>()
  for (const item of items) {
    const nombre = item.variante.producto.nombre
    porProducto.set(nombre, (porProducto.get(nombre) ?? 0) + item.cantidad)
  }

  return Array.from(porProducto.entries())
    .map(([nombre, unidades]) => ({ nombre, unidades }))
    .sort((a, b) => b.unidades - a.unidades)
    .slice(0, limite)
}

export interface ResumenPedidosPorGrupo {
  pendientes: number
  enProceso: number
  completados: number
  cancelados: number
}

export async function obtenerResumenPedidosPorGrupo(): Promise<ResumenPedidosPorGrupo> {
  const grupos = await prisma.pedido.groupBy({ by: ["estado"], _count: true })
  const conteo: Record<string, number> = {}
  for (const g of grupos) conteo[g.estado] = g._count

  return {
    pendientes: conteo.PENDIENTE ?? 0,
    enProceso: (conteo.PAGADO ?? 0) + (conteo.ENVIADO ?? 0),
    completados: conteo.ENTREGADO ?? 0,
    cancelados: conteo.CANCELADO ?? 0,
  }
}
