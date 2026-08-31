import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { buscarProducto, CATALOGO } from "@/constants/catalogo"
import { ProductoDetalle } from "@/components/marketing/producto-detalle"
import { obtenerOfertaActivaPorProducto } from "@/services/oferta.service"
import { dbSafe } from "@/lib/db-safe"
import { PRODUCT_TRANSLATIONS } from "@/lib/i18n/translations"
import { SITE_URL } from "@/lib/site"

export function generateStaticParams() {
  return CATALOGO.map((producto) => ({ slug: producto.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const producto = buscarProducto(slug)
  if (!producto) return {}

  const texto = PRODUCT_TRANSLATIONS[slug].es
  const url = `${SITE_URL}/catalogo/${slug}`
  const imagen = producto.variantes[0]?.imagen

  return {
    title: `${texto.nombre} — desde S/ ${producto.precioDesde}`,
    description: texto.descripcion,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title: texto.nombre,
      description: texto.descripcion,
      images: imagen ? [{ url: imagen }] : undefined,
    },
    twitter: {
      card: imagen ? "summary_large_image" : "summary",
      title: texto.nombre,
      description: texto.descripcion,
      images: imagen ? [imagen] : undefined,
    },
  }
}

export default async function ProductoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const producto = buscarProducto(slug)
  if (!producto) notFound()

  const { data: ofertaPorcentaje } = await dbSafe(() => obtenerOfertaActivaPorProducto(slug), 0)

  return <ProductoDetalle producto={producto} ofertaPorcentaje={ofertaPorcentaje} />
}
