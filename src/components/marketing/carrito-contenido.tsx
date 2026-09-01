"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useLocale } from "@/lib/i18n/locale-context"
import { COLOR_TRANSLATIONS, DISENO_TRANSLATIONS, PRODUCT_TRANSLATIONS } from "@/lib/i18n/translations"
import { useLineasCarrito, actualizarCantidadCarrito, quitarDelCarrito } from "@/lib/carrito"
import { obtenerStockCarritoAction } from "@/app/actions/checkout.actions"
import { ProductoIcono } from "./producto-icono"

export function CarritoContenido() {
  const { t, locale } = useLocale()
  const router = useRouter()
  const [stockPorVariante, setStockPorVariante] = useState<Record<string, number>>()

  useEffect(() => {
    let activo = true
    obtenerStockCarritoAction().then((mapa) => {
      if (activo) setStockPorVariante(mapa)
    })
    return () => {
      activo = false
    }
  }, [])

  const lineas = useLineasCarrito(stockPorVariante)
  const subtotalCentimos = lineas.reduce((acc, l) => acc + l.producto.precioDesde * 100 * l.cantidad, 0)

  if (lineas.length === 0) {
    return (
      <main className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-6 py-16 text-center">
        <p className="text-muted-foreground">{t.cart.empty}</p>
        <Link
          href="/catalogo"
          className="mt-6 inline-flex items-center rounded-[2px] bg-foreground px-6 py-3 text-xs font-semibold tracking-[0.14em] text-background uppercase"
        >
          {t.cart.emptyCta}
        </Link>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-12 sm:py-16">
      <h1 className="mb-8 text-2xl font-black tracking-[-0.02em] text-foreground sm:text-3xl">{t.cart.title}</h1>

      <div className="space-y-4">
        {lineas.map((linea) => {
          const texto = PRODUCT_TRANSLATIONS[linea.producto.slug][locale]
          const colorTraducido = linea.variante.color
            ? (COLOR_TRANSLATIONS[linea.variante.color]?.[locale] ?? linea.variante.color)
            : null
          const disenoTraducido = linea.variante.diseno
            ? (DISENO_TRANSLATIONS[linea.variante.diseno]?.[locale] ?? linea.variante.diseno)
            : null
          const maxCantidad = Math.min(linea.variante.stock, 10)

          return (
            <div key={linea.varianteId} className="flex gap-4 border-b border-border pb-4">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden bg-muted">
                {linea.variante.imagen ? (
                  <Image
                    src={linea.variante.imagen}
                    alt={texto.nombre}
                    fill
                    unoptimized
                    sizes="80px"
                    className="object-contain p-2"
                  />
                ) : (
                  <ProductoIcono slug={linea.producto.slug} />
                )}
              </div>

              <div className="flex min-w-0 flex-1 flex-col justify-between">
                <div>
                  <p className="truncate text-sm font-medium text-foreground">{texto.nombre}</p>
                  <p className="text-xs text-muted-foreground">
                    {[linea.variante.talla, colorTraducido, disenoTraducido].filter(Boolean).join(" · ")}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center border border-border">
                    <button
                      type="button"
                      onClick={() => actualizarCantidadCarrito(linea.productoSlug, linea.varianteId, linea.cantidad - 1)}
                      aria-label={t.product.quantityMinus}
                      className="flex h-8 w-8 items-center justify-center text-foreground hover:bg-muted"
                    >
                      −
                    </button>
                    <span className="flex h-8 w-8 items-center justify-center text-sm font-medium tabular-nums">
                      {linea.cantidad}
                    </span>
                    <button
                      type="button"
                      disabled={linea.cantidad >= maxCantidad}
                      onClick={() => actualizarCantidadCarrito(linea.productoSlug, linea.varianteId, linea.cantidad + 1)}
                      aria-label={t.product.quantityPlus}
                      className="flex h-8 w-8 items-center justify-center text-foreground hover:bg-muted disabled:opacity-30"
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => quitarDelCarrito(linea.productoSlug, linea.varianteId)}
                    className="text-xs font-medium text-muted-foreground hover:text-destructive"
                  >
                    {t.cart.remove}
                  </button>
                </div>
              </div>

              <span className="shrink-0 text-sm font-medium text-foreground">
                S/ {linea.producto.precioDesde * linea.cantidad}
              </span>
            </div>
          )
        })}
      </div>

      <div className="mt-6 flex items-center justify-between text-base">
        <span className="text-muted-foreground">{t.cart.subtotal}</span>
        <b className="text-lg text-foreground">S/ {(subtotalCentimos / 100).toFixed(2)}</b>
      </div>

      <button
        type="button"
        onClick={() => router.push("/checkout")}
        className="mt-6 w-full rounded-[2px] bg-foreground px-6 py-3.5 text-sm font-semibold tracking-[0.08em] text-background uppercase transition-opacity hover:opacity-90"
      >
        {t.cart.continueToCheckout}
      </button>
      <Link
        href="/catalogo"
        className="mt-4 block text-center text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        {t.cart.continueShopping}
      </Link>
    </main>
  )
}
