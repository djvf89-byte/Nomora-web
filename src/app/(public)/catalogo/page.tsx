import type { Metadata } from "next"
import { CatalogoGrid } from "@/components/marketing/catalogo-grid"
import { CatalogoHeader } from "@/components/marketing/catalogo-header"
import { obtenerOfertasActivasPorProducto } from "@/services/oferta.service"
import { dbSafe } from "@/lib/db-safe"
import { SITE_URL } from "@/lib/site"

const TITULO = "Catálogo"
const DESCRIPCION =
  "Productos para la aventura, con stock por variante y envío gratis en Lima y Callao desde S/100."

export const metadata: Metadata = {
  title: TITULO,
  description: DESCRIPCION,
  alternates: { canonical: `${SITE_URL}/catalogo` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/catalogo`,
    title: TITULO,
    description: DESCRIPCION,
  },
}

export default async function CatalogoPage() {
  const { data: ofertas } = await dbSafe(() => obtenerOfertasActivasPorProducto(), {})

  return (
    <main>
      <CatalogoHeader />
      <CatalogoGrid ofertas={ofertas} />
    </main>
  )
}
