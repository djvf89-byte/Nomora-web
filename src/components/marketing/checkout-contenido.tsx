"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useLocale } from "@/lib/i18n/locale-context"
import { useLineasCarrito } from "@/lib/carrito"
import { obtenerOfertasActivasAction, obtenerStockCarritoAction } from "@/app/actions/checkout.actions"
import { CheckoutForm } from "./checkout-form"
import { ResumenPedido } from "./resumen-pedido"
import { PagoBrick } from "./pago-brick"
import { PagoYape } from "./pago-yape"

interface PedidoCreado {
  pedidoId: string
  totalCentimos: number
  email: string
}

export function CheckoutContenido() {
  const { t } = useLocale()
  const [cupon, setCupon] = useState<{ codigo: string; porcentaje: number } | null>(null)
  const [provincia, setProvincia] = useState("")
  const [ofertas, setOfertas] = useState<Record<string, number>>({})
  const [stockPorVariante, setStockPorVariante] = useState<Record<string, number>>()
  const [pedidoCreado, setPedidoCreado] = useState<PedidoCreado | null>(null)
  const [metodoPago, setMetodoPago] = useState<"tarjeta" | "yape">("tarjeta")

  useEffect(() => {
    let activo = true
    obtenerOfertasActivasAction().then((mapa) => {
      if (activo) setOfertas(mapa)
    })
    obtenerStockCarritoAction().then((mapa) => {
      if (activo) setStockPorVariante(mapa)
    })
    return () => {
      activo = false
    }
  }, [])

  const lineas = useLineasCarrito(stockPorVariante)

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
        {pedidoCreado ? (
          <div className="space-y-5">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setMetodoPago("tarjeta")}
                className={`flex-1 rounded-[2px] border px-4 py-2.5 text-xs font-semibold tracking-[0.08em] uppercase transition-colors ${
                  metodoPago === "tarjeta"
                    ? "border-foreground bg-foreground text-background"
                    : "border-input text-muted-foreground hover:border-foreground"
                }`}
              >
                {t.checkout.payWithCardOrTicket}
              </button>
              <button
                type="button"
                onClick={() => setMetodoPago("yape")}
                className={`flex-1 rounded-[2px] border px-4 py-2.5 text-xs font-semibold tracking-[0.08em] uppercase transition-colors ${
                  metodoPago === "yape"
                    ? "border-foreground bg-foreground text-background"
                    : "border-input text-muted-foreground hover:border-foreground"
                }`}
              >
                {t.checkout.payWithYape}
              </button>
            </div>

            {metodoPago === "tarjeta" ? (
              <PagoBrick
                pedidoId={pedidoCreado.pedidoId}
                totalCentimos={pedidoCreado.totalCentimos}
                email={pedidoCreado.email}
              />
            ) : (
              <PagoYape pedidoId={pedidoCreado.pedidoId} email={pedidoCreado.email} />
            )}
          </div>
        ) : (
          <CheckoutForm
            lineas={lineas}
            cuponCodigo={cupon?.codigo}
            onProvinciaChange={setProvincia}
            onPedidoCreado={setPedidoCreado}
          />
        )}

        <ResumenPedido
          lineas={lineasConOferta}
          provincia={provincia}
          onCuponChange={setCupon}
          bloqueado={!!pedidoCreado}
        />
      </div>
    </main>
  )
}
