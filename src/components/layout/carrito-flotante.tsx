"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useLocale } from "@/lib/i18n/locale-context"
import { useLineasCarritoConStockActual } from "@/lib/carrito"

// No tiene sentido flotar encima de una página que ya es el carrito/checkout.
const RUTAS_OCULTAS = ["/carrito", "/checkout"]

export function CarritoFlotante() {
  const { t } = useLocale()
  const pathname = usePathname()
  const lineas = useLineasCarritoConStockActual()
  const cantidad = lineas.reduce((acc, l) => acc + l.cantidad, 0)

  if (cantidad === 0) return null
  if (RUTAS_OCULTAS.some((ruta) => pathname.startsWith(ruta))) return null

  return (
    <Link
      href="/carrito"
      aria-label={`${t.nav.cart} — ${cantidad}`}
      className="fixed right-5 bottom-5 z-30 flex items-center gap-2.5 rounded-[2px] bg-foreground px-5 py-3.5 text-background shadow-lg transition-transform hover:scale-[1.03] sm:right-6 sm:bottom-6"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M3 6h2l2.4 12.2a2 2 0 0 0 2 1.8h8.4a2 2 0 0 0 2-1.6L22 9H6" />
        <circle cx="10" cy="21" r="1" />
        <circle cx="18" cy="21" r="1" />
      </svg>
      <span className="text-xs font-semibold tracking-[0.08em] uppercase">
        {t.cart.title} · {cantidad}
      </span>
    </Link>
  )
}
