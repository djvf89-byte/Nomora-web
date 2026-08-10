import { CatalogoGrid } from "@/components/marketing/catalogo-grid"
import { CatalogoHeader } from "@/components/marketing/catalogo-header"
import { obtenerOfertasActivasPorProducto } from "@/services/oferta.service"
import { dbSafe } from "@/lib/db-safe"

export default async function CatalogoPage() {
  const { data: ofertas } = await dbSafe(() => obtenerOfertasActivasPorProducto(), {})

  return (
    <main>
      <CatalogoHeader />
      <CatalogoGrid ofertas={ofertas} />
    </main>
  )
}
