import { prisma } from "@/lib/prisma"

export async function listarProductosConVariantes() {
  return prisma.producto.findMany({
    include: { variantes: { orderBy: [{ talla: "asc" }, { color: "asc" }] } },
    orderBy: { nombre: "asc" },
  })
}

export async function listarProductosBasico() {
  return prisma.producto.findMany({
    select: { id: true, nombre: true, precioCentimos: true },
    orderBy: { nombre: "asc" },
  })
}

export async function actualizarStockVariante(varianteId: string, stock: number) {
  if (stock < 0) throw new Error("El stock no puede ser negativo")
  return prisma.variante.update({
    where: { id: varianteId },
    data: { stock },
  })
}

export async function actualizarPrecioProducto(productoId: string, precioCentimos: number) {
  if (precioCentimos <= 0) throw new Error("El precio debe ser mayor a 0")
  return prisma.producto.update({
    where: { id: productoId },
    data: { precioCentimos },
  })
}
