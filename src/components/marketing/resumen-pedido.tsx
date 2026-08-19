"use client"

import { useState, useTransition } from "react"
import Image from "next/image"
import type { Producto, Variante } from "@/constants/catalogo"
import { COLOR_TRANSLATIONS, PRODUCT_TRANSLATIONS } from "@/lib/i18n/translations"
import { useLocale } from "@/lib/i18n/locale-context"
import { validarCuponAction } from "@/app/actions/checkout.actions"
import { calcularPrecioConDescuento } from "@/lib/precios"
import { ProductoIcono } from "./producto-icono"

interface CuponAplicado {
  codigo: string
  porcentaje: number
}

export function ResumenPedido({
  producto,
  variante,
  cantidad,
  ofertaPorcentaje,
  onCuponChange,
}: {
  producto: Producto
  variante: Variante
  cantidad: number
  ofertaPorcentaje: number
  onCuponChange: (cupon: CuponAplicado | null) => void
}) {
  const { t, locale } = useLocale()
  const [codigo, setCodigo] = useState("")
  const [cupon, setCupon] = useState<CuponAplicado | null>(null)
  const [errorCupon, setErrorCupon] = useState<string | undefined>()
  const [isPending, startTransition] = useTransition()

  const texto = PRODUCT_TRANSLATIONS[producto.slug][locale]
  const colorTraducido = variante.color ? (COLOR_TRANSLATIONS[variante.color]?.[locale] ?? variante.color) : null
  const subtotalCentimos = producto.precioDesde * 100 * cantidad

  const { descuentoCentimos, precioFinalCentimos, porcentajeAplicado } = calcularPrecioConDescuento(
    subtotalCentimos,
    ofertaPorcentaje,
    cupon?.porcentaje ?? 0
  )
  const cuponEsElAplicado = !!cupon && cupon.porcentaje >= ofertaPorcentaje

  function aplicarCupon() {
    setErrorCupon(undefined)
    startTransition(async () => {
      const resultado = await validarCuponAction(codigo)
      if (!resultado.valido) {
        setCupon(null)
        onCuponChange(null)
        setErrorCupon(resultado.error ?? t.checkout.couponInvalid)
        return
      }
      const aplicado = { codigo: codigo.trim().toUpperCase(), porcentaje: resultado.porcentaje }
      setCupon(aplicado)
      onCuponChange(aplicado)
    })
  }

  return (
    <aside className="h-fit border border-border p-5">
      <p className="mb-3 text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
        {t.checkout.yourOrder}
      </p>
      <div className="relative flex h-44 items-center justify-center overflow-hidden bg-muted p-6">
        {variante.imagen ? (
          <Image
            src={variante.imagen}
            alt={texto.nombre}
            fill
            unoptimized
            sizes="320px"
            className="object-contain p-4"
          />
        ) : (
          <ProductoIcono slug={producto.slug} />
        )}
      </div>
      <div className="mt-3.5">
        <p className="text-sm font-medium text-foreground">{texto.nombre}</p>
        <p className="text-xs text-muted-foreground">
          {[variante.talla, colorTraducido].filter(Boolean).join(" · ")}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {t.checkout.quantity}: {cantidad} × S/ {producto.precioDesde}
        </p>
      </div>

      {ofertaPorcentaje > 0 && !cuponEsElAplicado && (
        <p className="mt-3 text-xs font-medium text-accent">
          {t.checkout.seasonOffer} −{ofertaPorcentaje}%
        </p>
      )}

      <div className="mt-4 border-t border-border pt-4">
        <label htmlFor="cuponInput" className="text-xs font-medium text-muted-foreground uppercase">
          {t.checkout.couponLabel}
        </label>
        <div className="mt-1.5 flex gap-2">
          <input
            id="cuponInput"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            placeholder={t.checkout.couponPlaceholder}
            className="min-w-0 flex-1 rounded-[2px] border border-input bg-card px-3 py-2 text-sm outline-none focus:border-ring"
          />
          <button
            type="button"
            onClick={aplicarCupon}
            disabled={isPending || !codigo.trim()}
            className="shrink-0 rounded-[2px] border border-foreground px-3 py-2 text-xs font-semibold tracking-[0.06em] uppercase disabled:opacity-40"
          >
            {isPending ? "..." : t.checkout.couponApply}
          </button>
        </div>
        {errorCupon && <p className="mt-1.5 text-xs text-destructive">{errorCupon}</p>}
        {cuponEsElAplicado && (
          <p className="mt-1.5 text-xs font-medium text-accent">
            {t.checkout.couponApplied} {cupon!.codigo} (−{cupon!.porcentaje}%)
          </p>
        )}
      </div>

      <div className="mt-4 space-y-1.5 border-t border-border pt-4 text-sm">
        <div className="flex items-center justify-between text-muted-foreground">
          <span>{t.checkout.subtotal}</span>
          <span>S/ {(subtotalCentimos / 100).toFixed(2)}</span>
        </div>
        {porcentajeAplicado > 0 && (
          <div className="flex items-center justify-between text-accent">
            <span>
              {t.checkout.discount} (−{porcentajeAplicado}%)
            </span>
            <span>− S/ {(descuentoCentimos / 100).toFixed(2)}</span>
          </div>
        )}
        <div className="flex items-baseline justify-between pt-1.5 text-base">
          <span className="text-muted-foreground">{t.checkout.total}</span>
          <b className="text-lg text-foreground">S/ {(precioFinalCentimos / 100).toFixed(2)}</b>
        </div>
      </div>

      <p className="mt-3 text-xs text-muted-foreground">{t.checkout.shippingNote}</p>
    </aside>
  )
}
