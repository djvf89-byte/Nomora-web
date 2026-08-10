"use client"

import Link from "next/link"
import type { Producto } from "@/constants/catalogo"
import { PRODUCT_TRANSLATIONS } from "@/lib/i18n/translations"
import { useLocale } from "@/lib/i18n/locale-context"
import { ProductoIcono } from "./producto-icono"
import { SelectorVariante } from "./selector-variante"

export function ProductoDetalle({
  producto,
  ofertaPorcentaje = 0,
}: {
  producto: Producto
  ofertaPorcentaje?: number
}) {
  const { t, locale } = useLocale()
  const texto = PRODUCT_TRANSLATIONS[producto.slug][locale]

  return (
    <main className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
      <Link href="/catalogo" className="mb-8 inline-block text-xs font-medium text-muted-foreground hover:text-foreground">
        {t.product.backToCatalog}
      </Link>

      <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 sm:gap-16">
        <div className="flex aspect-square items-center justify-center bg-muted p-16">
          <ProductoIcono slug={producto.slug} />
        </div>

        <div>
          <h1 className="text-3xl font-black tracking-[-0.02em] text-foreground sm:text-4xl">{texto.nombre}</h1>
          <p className="mt-3 font-mono text-xs tracking-[0.06em] text-muted-foreground uppercase">{texto.spec}</p>
          <p className="mt-5 max-w-[48ch] text-[15px] text-muted-foreground">{texto.descripcion}</p>

          <div className="mt-8">
            <SelectorVariante producto={producto} ofertaPorcentaje={ofertaPorcentaje} />
          </div>
        </div>
      </div>
    </main>
  )
}
