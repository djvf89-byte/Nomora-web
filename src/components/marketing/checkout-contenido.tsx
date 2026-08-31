"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useLocale } from "@/lib/i18n/locale-context"
import { useLineasCarrito } from "@/lib/carrito"
import { obtenerOfertasActivasAction } from "@/app/actions/checkout.actions"
import { CheckoutForm } from "./checkout-form"
import { ResumenPedido } from "./resumen-pedido"

export function CheckoutContenido() {
  const { t } = useLocale()
  const lineas = useLineasCarrito()
  const [cupon, setCupon] = useState<{ codigo: string; porcentaje: number } | null>(null)
  const [provincia, setProvincia] = useState("")
  const [ofertas, setOfertas] = useState<Record<string, number>>({})

  useEffect(() => {
    let activo = true
    obtenerOfertasActivasAction().then((mapa) => {
      if (activo) setOfertas(mapa)
    })
    return () => {
      activo = false
    }
  }, [])

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

  const lineasConOferta = lineas.map((linea) => ({
    ...linea,
    ofertaPorcentaje: ofertas[linea.producto.slug] ?? 0,
  }))

  return (
    <main className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
      <h1 className="mb-8 text-2xl font-black tracking-[-0.02em] text-foreground sm:text-3xl">{t.checkout.title}</h1>

      <div className="grid grid-cols-1 gap-10 sm:grid-cols-[1fr_320px]">
        <CheckoutForm lineas={lineas} cuponCodigo={cupon?.codigo} onProvinciaChange={setProvincia} />

        <ResumenPedido lineas={lineasConOferta} provincia={provincia} onCuponChange={setCupon} />
      </div>
    </main>
  )
}
