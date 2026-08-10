import { Hero } from "@/components/marketing/hero"
import { Statement } from "@/components/marketing/statement"
import { CatalogoGrid } from "@/components/marketing/catalogo-grid"
import { ComoFunciona } from "@/components/marketing/como-funciona"
import { TrustStrip } from "@/components/marketing/trust-strip"
import { obtenerOfertasActivasPorProducto } from "@/services/oferta.service"
import { dbSafe } from "@/lib/db-safe"

export default async function Home() {
  const { data: ofertas } = await dbSafe(() => obtenerOfertasActivasPorProducto(), {})

  return (
    <main>
      <Hero />
      <Statement />
      <CatalogoGrid ofertas={ofertas} />
      <ComoFunciona />
      <TrustStrip />
    </main>
  )
}
