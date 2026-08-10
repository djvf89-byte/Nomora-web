"use client"

import Link from "next/link"
import { CATALOGO } from "@/constants/catalogo"
import { PRODUCT_TRANSLATIONS } from "@/lib/i18n/translations"
import { useLocale } from "@/lib/i18n/locale-context"
import { ProductoIcono } from "./producto-icono"

export function CatalogoGrid({ ofertas = {} }: { ofertas?: Record<string, number> }) {
  const { t, locale } = useLocale()

  return (
    <section id="catalogo-destacado" className="border-b border-border py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6 sm:mb-13">
          <div>
            <p
              className="text-xs font-semibold tracking-[0.16em] uppercase"
              style={{ color: "color-mix(in srgb, var(--nomora-terracota) 78%, var(--nomora-negro) 22%)" }}
            >
              {t.catalog.eyebrow}
            </p>
            <h2 className="mt-2.5 text-3xl font-black tracking-[-0.02em] text-foreground sm:text-4xl">
              {t.catalog.heading}
            </h2>
          </div>
          <p className="max-w-[42ch] text-[15px] text-muted-foreground">{t.catalog.subheading}</p>
        </div>

        <div className="grid grid-cols-1 gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {CATALOGO.map((producto) => {
            const texto = PRODUCT_TRANSLATIONS[producto.slug][locale]
            const porcentaje = ofertas[producto.slug] ?? 0
            const precioRebajado =
              porcentaje > 0 ? Math.round((producto.precioDesde * (100 - porcentaje)) / 100) : null

            return (
              <Link
                key={producto.slug}
                href={`/catalogo/${producto.slug}`}
                className="relative flex min-h-[320px] flex-col gap-3.5 bg-background px-6 py-7 transition-colors hover:bg-muted"
              >
                {porcentaje > 0 && (
                  <span className="absolute top-4 right-4 rounded-full bg-accent px-2.5 py-1 text-[11px] font-semibold text-accent-foreground">
                    −{porcentaje}%
                  </span>
                )}
                <div className="flex h-[148px] items-center justify-center p-4">
                  <ProductoIcono slug={producto.slug} />
                </div>
                <h3 className="text-lg font-semibold tracking-[-0.01em] text-foreground">{texto.nombre}</h3>
                <p className="font-mono text-[10.5px] tracking-[0.06em] text-muted-foreground uppercase">
                  {texto.spec}
                </p>
                <div className="mt-auto flex items-baseline justify-between border-t border-border pt-3.5 text-[13px] text-foreground">
                  <span>{t.catalog.from}</span>
                  {precioRebajado !== null ? (
                    <span className="flex items-baseline gap-2">
                      <span className="text-xs text-muted-foreground line-through">S/ {producto.precioDesde}</span>
                      <b className="text-[15px] font-semibold text-accent">S/ {precioRebajado}</b>
                    </span>
                  ) : (
                    <b className="text-[15px] font-semibold">S/ {producto.precioDesde}</b>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
