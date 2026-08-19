"use client"

import { useCallback, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import type { Producto, Variante } from "@/constants/catalogo"
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
  const [variante, setVariante] = useState<Variante | undefined>(producto.variantes[0])
  const [imagenActiva, setImagenActiva] = useState<string | undefined>(producto.variantes[0]?.imagen)

  const handleVarianteChange = useCallback((nueva: Variante | undefined) => {
    setVariante(nueva)
    setImagenActiva(nueva?.imagen)
  }, [])

  const galeria = [
    variante?.imagen,
    ...(variante?.imagenesAdicionales ?? []),
    ...(producto.imagenesAdicionales ?? []),
  ].filter((src): src is string => Boolean(src))

  return (
    <main className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
      <Link href="/catalogo" className="mb-8 inline-block text-xs font-medium text-muted-foreground hover:text-foreground">
        {t.product.backToCatalog}
      </Link>

      <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 sm:gap-16">
        <div>
          <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-muted p-16">
            {imagenActiva ? (
              <Image
                src={imagenActiva}
                alt={texto.nombre}
                fill
                unoptimized
                sizes="(min-width: 640px) 50vw, 100vw"
                className="object-contain p-8"
              />
            ) : (
              <ProductoIcono slug={producto.slug} />
            )}
          </div>

          {galeria.length > 1 && (
            <div className="mt-3 flex gap-2">
              {galeria.map((src) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setImagenActiva(src)}
                  aria-label={texto.nombre}
                  className={`relative h-16 w-16 shrink-0 overflow-hidden bg-muted transition-opacity ${
                    imagenActiva === src ? "opacity-100 ring-2 ring-foreground" : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image src={src} alt="" fill unoptimized sizes="64px" className="object-contain p-2" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-black tracking-[-0.02em] text-foreground sm:text-4xl">{texto.nombre}</h1>
          <p className="mt-3 font-mono text-xs tracking-[0.06em] text-muted-foreground uppercase">{texto.spec}</p>
          <p className="mt-5 max-w-[48ch] text-[15px] text-muted-foreground">{texto.descripcion}</p>

          <div className="mt-8">
            <SelectorVariante
              producto={producto}
              ofertaPorcentaje={ofertaPorcentaje}
              onVarianteChange={handleVarianteChange}
            />
          </div>
        </div>
      </div>
    </main>
  )
}
