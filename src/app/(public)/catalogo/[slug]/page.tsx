import { notFound } from "next/navigation"
import { buscarProducto, CATALOGO } from "@/constants/catalogo"
import { ProductoDetalle } from "@/components/marketing/producto-detalle"
import { obtenerOfertaActivaPorProducto } from "@/services/oferta.service"
import { dbSafe } from "@/lib/db-safe"

export function generateStaticParams() {
  return CATALOGO.map((producto) => ({ slug: producto.slug }))
}

export default async function ProductoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const producto = buscarProducto(slug)
  if (!producto) notFound()

  const { data: ofertaPorcentaje } = await dbSafe(() => obtenerOfertaActivaPorProducto(slug), 0)

  return <ProductoDetalle producto={producto} ofertaPorcentaje={ofertaPorcentaje} />
}
