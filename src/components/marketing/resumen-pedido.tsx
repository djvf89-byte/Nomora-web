"use client"

import { useState, useTransition } from "react"
import Image from "next/image"
import type { LineaCarrito } from "@/lib/carrito"
import { COLOR_TRANSLATIONS, DISENO_TRANSLATIONS, PRODUCT_TRANSLATIONS } from "@/lib/i18n/translations"
import { useLocale } from "@/lib/i18n/locale-context"
import { validarCuponAction } from "@/app/actions/checkout.actions"
import {
  calcularPrecioConDescuento,
  calcularEnvioCentimos,
  esProvinciaLima,
  UMBRAL_ENVIO_GRATIS_LIMA_CENTIMOS,
} from "@/lib/precios"
import { ProductoIcono } from "./producto-icono"

interface CuponAplicado {
  codigo: string
  porcentaje: number
}

interface LineaConOferta extends LineaCarrito {
  ofertaPorcentaje: number
}

export function ResumenPedido({
  lineas,
  provincia,
  onCuponChange,
}: {
  lineas: LineaConOferta[]
  provincia: string
  onCuponChange: (cupon: CuponAplicado | null) => void
}) {
  const { t, locale } = useLocale()
  const [codigo, setCodigo] = useState("")
  const [cupon, setCupon] = useState<CuponAplicado | null>(null)
  const [errorCupon, setErrorCupon] = useState<string | undefined>()
  const [isPending, startTransition] = useTransition()

  let subtotalCentimos = 0
  let descuentoCentimos = 0
  for (const linea of lineas) {
    const lineaSubtotalCentimos = linea.producto.precioDesde * 100 * linea.cantidad
    subtotalCentimos += lineaSubtotalCentimos
    descuentoCentimos += calcularPrecioConDescuento(
      lineaSubtotalCentimos,
      linea.ofertaPorcentaje,
      cupon?.porcentaje ?? 0
    ).descuentoCentimos
  }
  const precioFinalCentimos = subtotalCentimos - descuentoCentimos
  const esLima = esProvinciaLima(provincia)
  const faltanteEnvioCentimos = UMBRAL_ENVIO_GRATIS_LIMA_CENTIMOS - precioFinalCentimos
  const envioCentimos = calcularEnvioCentimos(provincia, precioFinalCentimos)
  const totalConEnvioCentimos = precioFinalCentimos + envioCentimos

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

      <div className="space-y-3">
        {lineas.map((linea) => {
          const texto = PRODUCT_TRANSLATIONS[linea.producto.slug][locale]
          const colorTraducido = linea.variante.color
            ? (COLOR_TRANSLATIONS[linea.variante.color]?.[locale] ?? linea.variante.color)
            : null
          const disenoTraducido = linea.variante.diseno
            ? (DISENO_TRANSLATIONS[linea.variante.diseno]?.[locale] ?? linea.variante.diseno)
            : null

          return (
            <div key={linea.varianteId} className="flex items-center gap-3">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden bg-muted">
                {linea.variante.imagen ? (
                  <Image
                    src={linea.variante.imagen}
                    alt={texto.nombre}
                    fill
                    unoptimized
                    sizes="56px"
                    className="object-contain p-1.5"
                  />
                ) : (
                  <ProductoIcono slug={linea.producto.slug} />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{texto.nombre}</p>
                <p className="text-xs text-muted-foreground">
                  {[linea.variante.talla, colorTraducido, disenoTraducido].filter(Boolean).join(" · ")} ·{" "}
                  {t.checkout.quantity}: {linea.cantidad}
                </p>
              </div>
              <span className="shrink-0 text-sm font-medium text-foreground">
                S/ {linea.producto.precioDesde * linea.cantidad}
              </span>
            </div>
          )
        })}
      </div>

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
        {cupon && (
          <p className="mt-1.5 text-xs font-medium text-accent">
            {t.checkout.couponApplied} {cupon.codigo} (−{cupon.porcentaje}%)
          </p>
        )}
      </div>

      <div className="mt-4 space-y-1.5 border-t border-border pt-4 text-sm">
        <div className="flex items-center justify-between text-muted-foreground">
          <span>{t.checkout.subtotal}</span>
          <span>S/ {(subtotalCentimos / 100).toFixed(2)}</span>
        </div>
        {descuentoCentimos > 0 && (
          <div className="flex items-center justify-between text-accent">
            <span>{t.checkout.discount}</span>
            <span>− S/ {(descuentoCentimos / 100).toFixed(2)}</span>
          </div>
        )}
        <div className="flex items-center justify-between text-muted-foreground">
          <span>{t.checkout.shipping}</span>
          <span>
            {esLima
              ? envioCentimos > 0
                ? `S/ ${(envioCentimos / 100).toFixed(2)}`
                : t.checkout.shippingFree
              : t.checkout.shippingPending}
          </span>
        </div>
        <div className="flex items-baseline justify-between pt-1.5 text-base">
          <span className="text-muted-foreground">{t.checkout.total}</span>
          <b className="text-lg text-foreground">S/ {(totalConEnvioCentimos / 100).toFixed(2)}</b>
        </div>
      </div>

      {esLima ? (
        faltanteEnvioCentimos <= 0 ? (
          <p className="mt-3 text-xs font-medium text-accent">{t.checkout.freeShippingUnlocked}</p>
        ) : (
          <p className="mt-3 text-xs text-muted-foreground">
            {t.checkout.freeShippingMissingPrefix}
            {(faltanteEnvioCentimos / 100).toFixed(2)}
            {t.checkout.freeShippingMissingSuffix}
          </p>
        )
      ) : (
        <p className="mt-3 text-xs text-muted-foreground">{t.checkout.shippingProvincia}</p>
      )}
    </aside>
  )
}
