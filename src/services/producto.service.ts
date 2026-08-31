import { prisma } from "@/lib/prisma"
import type { Producto } from "@/constants/catalogo"

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

// La tienda mostraba el stock del catálogo estático (src/constants/catalogo.ts); el panel de
// admin editaba Variante.stock en la BD, una tabla que la tienda nunca leía. Esto sincroniza:
// la BD es la única fuente de verdad real, el catálogo estático queda solo como valor de respaldo
// (por si la BD no responde) y como semilla inicial (ver prisma/seed.ts).
export async function obtenerStockPorVariante(): Promise<Record<string, number>> {
  const variantes = await prisma.variante.findMany({ select: { id: true, stock: true } })
  const mapa: Record<string, number> = {}
  for (const v of variantes) mapa[v.id] = v.stock
  return mapa
}

export function aplicarStockReal(producto: Producto, stockPorVariante: Record<string, number>): Producto {
  return {
    ...producto,
    variantes: producto.variantes.map((variante) => ({
      ...variante,
      stock: Math.max(0, stockPorVariante[variante.id] ?? variante.stock),
    })),
  }
}
