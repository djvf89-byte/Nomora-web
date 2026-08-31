"use client"

import { useEffect, useState } from "react"
import type { Producto, Variante } from "@/constants/catalogo"
import { useLocale } from "@/lib/i18n/locale-context"
import { marcarPedidoPendiente } from "@/lib/pedido-pendiente"
import { CheckoutForm } from "./checkout-form"
import { ResumenPedido } from "./resumen-pedido"

export function CheckoutContenido({
  producto,
  variante,
  cantidad,
  ofertaPorcentaje,
}: {
  producto: Producto
  variante: Variante
  cantidad: number
  ofertaPorcentaje: number
}) {
  const { t } = useLocale()
  const [cupon, setCupon] = useState<{ codigo: string; porcentaje: number } | null>(null)
  const [provincia, setProvincia] = useState("")

  useEffect(() => {
    marcarPedidoPendiente({ productoSlug: producto.slug, varianteId: variante.id, cantidad })
  }, [producto.slug, variante.id, cantidad])

  return (
    <main className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
      <h1 className="mb-8 text-2xl font-black tracking-[-0.02em] text-foreground sm:text-3xl">{t.checkout.title}</h1>

      <div className="grid grid-cols-1 gap-10 sm:grid-cols-[1fr_320px]">
        <CheckoutForm
          productoSlug={producto.slug}
          varianteId={variante.id}
          cantidad={cantidad}
          cuponCodigo={cupon && cupon.porcentaje >= ofertaPorcentaje ? cupon.codigo : undefined}
          onProvinciaChange={setProvincia}
        />

        <ResumenPedido
          producto={producto}
          variante={variante}
          cantidad={cantidad}
          ofertaPorcentaje={ofertaPorcentaje}
          provincia={provincia}
          onCuponChange={setCupon}
        />
      </div>
    </main>
  )
}
