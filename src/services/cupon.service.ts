import { prisma } from "@/lib/prisma"

export async function listarCupones() {
  return prisma.cupon.findMany({ orderBy: { creadoEn: "desc" } })
}

export async function crearCupon(datos: {
  codigo: string
  porcentaje: number
  fechaInicio?: Date
  fechaFin?: Date
  usosMaximos?: number
}) {
  return prisma.cupon.create({
    data: {
      codigo: datos.codigo.trim().toUpperCase(),
      porcentaje: datos.porcentaje,
      fechaInicio: datos.fechaInicio ?? null,
      fechaFin: datos.fechaFin ?? null,
      usosMaximos: datos.usosMaximos ?? null,
    },
  })
}

export async function desactivarCupon(id: string) {
  return prisma.cupon.update({ where: { id }, data: { activo: false } })
}

export interface ResultadoValidacionCupon {
  valido: boolean
  porcentaje: number
  error?: string
}

// Valida un código de cupón (existe, activo, dentro de vigencia, con usos disponibles).
// No incrementa el contador de usos acá — eso se hace al confirmar el pedido.
export async function validarCupon(codigo: string): Promise<ResultadoValidacionCupon> {
  const cupon = await prisma.cupon.findUnique({ where: { codigo: codigo.trim().toUpperCase() } })

  if (!cupon || !cupon.activo) return { valido: false, porcentaje: 0, error: "Cupón no válido." }

  const ahora = new Date()
  if (cupon.fechaInicio && ahora < cupon.fechaInicio) {
    return { valido: false, porcentaje: 0, error: "Este cupón todavía no está activo." }
  }
  if (cupon.fechaFin && ahora > cupon.fechaFin) {
    return { valido: false, porcentaje: 0, error: "Este cupón ya venció." }
  }
  if (cupon.usosMaximos !== null && cupon.usosActuales >= cupon.usosMaximos) {
    return { valido: false, porcentaje: 0, error: "Este cupón alcanzó su límite de usos." }
  }

  return { valido: true, porcentaje: cupon.porcentaje }
}

export async function registrarUsoCupon(codigo: string) {
  await prisma.cupon.update({
    where: { codigo: codigo.trim().toUpperCase() },
    data: { usosActuales: { increment: 1 } },
  })
}
