"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import type { Producto, Variante } from "@/constants/catalogo"
import { COLOR_TRANSLATIONS, DISENO_TRANSLATIONS } from "@/lib/i18n/translations"
import { useLocale } from "@/lib/i18n/locale-context"

const MAX_POR_PEDIDO = 10

export function SelectorVariante({
  producto,
  ofertaPorcentaje = 0,
  onVarianteChange,
}: {
  producto: Producto
  ofertaPorcentaje?: number
  onVarianteChange?: (variante: Variante | undefined) => void
}) {
  const router = useRouter()
  const { t, locale } = useLocale()

  const tallas = useMemo(
    () => [...new Set(producto.variantes.map((v) => v.talla).filter(Boolean))] as string[],
    [producto]
  )
  const colores = useMemo(
    () => [...new Set(producto.variantes.map((v) => v.color).filter(Boolean))] as string[],
    [producto]
  )
  const disenos = useMemo(
    () => [...new Set(producto.variantes.map((v) => v.diseno).filter(Boolean))] as string[],
    [producto]
  )

  const [talla, setTalla] = useState<string | undefined>(tallas[0])
  const [color, setColor] = useState<string | undefined>(colores[0])
  const [diseno, setDiseno] = useState<string | undefined>(disenos[0])
  const [cantidadElegida, setCantidadElegida] = useState(1)

  const variante = producto.variantes.find(
    (v) => v.talla === talla && v.color === color && v.diseno === diseno
  )

  useEffect(() => {
    onVarianteChange?.(variante)
  }, [variante, onVarianteChange])
  const disponible = (variante?.stock ?? 0) > 0
  const maxCantidad = Math.min(variante?.stock ?? 1, MAX_POR_PEDIDO)
  // Si al cambiar de variante la cantidad elegida ya no cabe en el stock disponible, se recorta acá
  // (derivado en el render, no en un efecto — evita el re-render en cascada de sincronizar estado con estado).
  const cantidad = Math.min(cantidadElegida, Math.max(maxCantidad, 1))

  const totalLinea = producto.precioDesde * cantidad
  const totalConDescuento =
    ofertaPorcentaje > 0 ? Math.round((totalLinea * (100 - ofertaPorcentaje)) / 100) : null

  return (
    <div className="flex flex-col gap-6">
      {tallas.length > 0 && (
        <div>
          <p className="mb-2.5 text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
            {t.product.size}
          </p>
          <div className="flex flex-wrap gap-2">
            {tallas.map((valor) => (
              <button
                key={valor}
                type="button"
                onClick={() => setTalla(valor)}
                className={`min-w-11 rounded-[2px] border px-3.5 py-2 text-sm font-medium transition-colors ${
                  talla === valor
                    ? "border-foreground bg-foreground text-background"
                    : "border-border text-foreground hover:border-foreground"
                }`}
              >
                {valor}
              </button>
            ))}
          </div>
          {variante?.medida && (
            <p className="mt-2 text-xs text-muted-foreground">
              {t.product.dimensions}: {variante.medida}
            </p>
          )}
        </div>
      )}

      {colores.length > 0 && (
        <div>
          <p className="mb-2.5 text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
            {t.product.color}
          </p>
          <div className="flex flex-wrap gap-2">
            {colores.map((valor) => (
              <button
                key={valor}
                type="button"
                onClick={() => setColor(valor)}
                className={`rounded-[2px] border px-3.5 py-2 text-sm font-medium transition-colors ${
                  color === valor
                    ? "border-foreground bg-foreground text-background"
                    : "border-border text-foreground hover:border-foreground"
                }`}
              >
                {COLOR_TRANSLATIONS[valor]?.[locale] ?? valor}
              </button>
            ))}
          </div>
        </div>
      )}

      {disenos.length > 0 && (
        <div>
          <p className="mb-1 text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
            {t.product.design}
          </p>
          <p className="mb-2.5 text-[13px] text-accent">{t.product.designNote}</p>
          <div className="flex flex-wrap gap-2">
            {disenos.map((valor) => (
              <button
                key={valor}
                type="button"
                onClick={() => setDiseno(valor)}
                className={`rounded-[2px] border px-3.5 py-2 text-sm font-medium transition-colors ${
                  diseno === valor
                    ? "border-foreground bg-foreground text-background"
                    : "border-border text-foreground hover:border-foreground"
                }`}
              >
                {DISENO_TRANSLATIONS[valor]?.[locale] ?? valor}
              </button>
            ))}
          </div>
        </div>
      )}

      {disponible && (
        <div>
          <p className="mb-2.5 text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
            {t.product.quantity}
          </p>
          <div className="inline-flex items-center border border-border">
            <button
              type="button"
              onClick={() => setCantidadElegida((c) => Math.max(1, c - 1))}
              disabled={cantidad <= 1}
              aria-label={t.product.quantityMinus}
              className="flex h-10 w-10 items-center justify-center text-foreground hover:bg-muted disabled:opacity-30"
            >
              −
            </button>
            <span className="flex h-10 w-10 items-center justify-center text-sm font-medium tabular-nums">
              {cantidad}
            </span>
            <button
              type="button"
              onClick={() => setCantidadElegida((c) => Math.min(maxCantidad, c + 1))}
              disabled={cantidad >= maxCantidad}
              aria-label={t.product.quantityPlus}
              className="flex h-10 w-10 items-center justify-center text-foreground hover:bg-muted disabled:opacity-30"
            >
              +
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between border-t border-border pt-5">
        {totalConDescuento !== null ? (
          <span className="flex items-baseline gap-2.5">
            <span className="text-base text-muted-foreground line-through">S/ {totalLinea}</span>
            <span className="text-2xl font-semibold text-accent">S/ {totalConDescuento}</span>
            <span className="rounded-full bg-accent px-2 py-0.5 text-[11px] font-semibold text-accent-foreground">
              −{ofertaPorcentaje}%
            </span>
          </span>
        ) : (
          <span className="text-2xl font-semibold text-foreground">S/ {totalLinea}</span>
        )}
        {!variante ? (
          <span className="text-sm text-muted-foreground">{t.product.combinationUnavailable}</span>
        ) : disponible ? (
          <span className="text-sm text-muted-foreground">
            {variante.stock} {t.product.available}
          </span>
        ) : (
          <span className="text-sm font-medium text-destructive">{t.product.soldOut}</span>
        )}
      </div>

      <button
        type="button"
        disabled={!variante || !disponible}
        onClick={() =>
          router.push(`/checkout?producto=${producto.slug}&variante=${variante?.id}&cantidad=${cantidad}`)
        }
        className="w-full rounded-[2px] bg-foreground px-6 py-3.5 text-sm font-semibold tracking-[0.08em] text-background uppercase transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {disponible ? t.product.buyNow : t.product.soldOut}
      </button>
      <p className="text-center text-xs text-muted-foreground">{t.product.noAccountNote}</p>
    </div>
  )
}
