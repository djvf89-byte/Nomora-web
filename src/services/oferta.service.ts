import { prisma } from "@/lib/prisma"

export async function listarOfertas() {
  return prisma.ofertaTemporada.findMany({
    include: { productos: { select: { id: true, nombre: true } } },
    orderBy: { creadoEn: "desc" },
  })
}

export async function crearOferta(datos: {
  nombre: string
  porcentaje: number
  fechaInicio: Date
  fechaFin: Date
  productoIds: string[]
}) {
  return prisma.ofertaTemporada.create({
    data: {
      nombre: datos.nombre,
      porcentaje: datos.porcentaje,
      fechaInicio: datos.fechaInicio,
      fechaFin: datos.fechaFin,
      productos: { connect: datos.productoIds.map((id) => ({ id })) },
    },
  })
}

export async function desactivarOferta(id: string) {
  return prisma.ofertaTemporada.update({ where: { id }, data: { activo: false } })
}

// Mapa productoId -> % de descuento, solo ofertas vigentes hoy.
// Si un producto tiene más de una oferta activa (no debería pasar en el flujo normal
// del admin, pero por las dudas) se toma el porcentaje más alto.
export async function obtenerOfertasActivasPorProducto(): Promise<Record<string, number>> {
  const ahora = new Date()
  const ofertas = await prisma.ofertaTemporada.findMany({
    where: { activo: true, fechaInicio: { lte: ahora }, fechaFin: { gte: ahora } },
    include: { productos: { select: { id: true } } },
  })

  const mapa: Record<string, number> = {}
  for (const oferta of ofertas) {
    for (const producto of oferta.productos) {
      mapa[producto.id] = Math.max(mapa[producto.id] ?? 0, oferta.porcentaje)
    }
  }
  return mapa
}

export async function obtenerOfertaActivaPorProducto(productoId: string): Promise<number> {
  const mapa = await obtenerOfertasActivasPorProducto()
  return mapa[productoId] ?? 0
}
