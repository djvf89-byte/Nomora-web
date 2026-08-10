import { notFound } from "next/navigation"
import { buscarVariante } from "@/constants/catalogo"
import { CheckoutContenido } from "@/components/marketing/checkout-contenido"
import { obtenerOfertaActivaPorProducto } from "@/services/oferta.service"
import { dbSafe } from "@/lib/db-safe"

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ producto?: string; variante?: string; cantidad?: string }>
}) {
  const { producto: productoSlug, variante: varianteId, cantidad: cantidadParam } = await searchParams
  const encontrado = productoSlug && varianteId ? buscarVariante(productoSlug, varianteId) : null
  if (!encontrado) notFound()

  const cantidadPedida = Number(cantidadParam)
  const cantidad =
    Number.isInteger(cantidadPedida) && cantidadPedida >= 1
      ? Math.min(cantidadPedida, encontrado.variante.stock, 10)
      : 1

  const { data: ofertaPorcentaje } = await dbSafe(() => obtenerOfertaActivaPorProducto(productoSlug!), 0)

  return (
    <CheckoutContenido
      producto={encontrado.producto}
      variante={encontrado.variante}
      cantidad={cantidad}
      ofertaPorcentaje={ofertaPorcentaje}
    />
  )
}
