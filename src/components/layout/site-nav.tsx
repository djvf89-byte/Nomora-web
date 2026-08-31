"use client"

import Link from "next/link"
import { Sello } from "@/components/brand/sello"
import { LanguageToggle } from "./language-toggle"
import { useLocale } from "@/lib/i18n/locale-context"
import { useLineasCarrito } from "@/lib/carrito"

function renderMensaje(texto: string) {
  const partes = texto.split(/(\{b\}.*?\{\/b\})/g)
  return partes.map((parte, i) => {
    const match = parte.match(/^\{b\}(.*)\{\/b\}$/)
    if (match) {
      return (
        <b key={i} className="text-white">
          {match[1]}
        </b>
      )
    }
    return <span key={i}>{parte}</span>
  })
}

function TiraMensajes({ mensajes }: { mensajes: readonly string[] }) {
  return (
    <div className="flex shrink-0 items-center gap-10 pr-10">
      {mensajes.map((mensaje, i) => (
        <span key={i} className="text-[11px] font-semibold tracking-[0.16em] text-white/80 uppercase">
          {renderMensaje(mensaje)}
        </span>
      ))}
    </div>
  )
}

export function SiteNav() {
  const { t } = useLocale()
  const lineas = useLineasCarrito()
  const cantidadCarrito = lineas.reduce((acc, l) => acc + l.cantidad, 0)
  const cartHref = lineas.length > 0 ? "/carrito" : "/catalogo"

  return (
    <>
      <div className="overflow-hidden bg-[var(--nomora-negro)] py-2.5">
        <div className="marquee flex w-max">
          <TiraMensajes mensajes={t.nav.marquee} />
          <TiraMensajes mensajes={t.nav.marquee} />
        </div>
      </div>

      <nav className="sticky top-0 z-20 border-b border-border bg-background">
        <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto_minmax(max-content,1fr)] items-center gap-3 px-6 py-5">
          <span aria-hidden="true" />

          <Link href="/" className="flex items-center gap-2 justify-self-center sm:gap-3">
            <Sello className="h-7 w-7 sm:h-10 sm:w-10" />
            <span className="text-sm font-black tracking-[0.14em] text-foreground uppercase sm:text-[27px] sm:tracking-[0.34em]">
              Nomora
            </span>
          </Link>

          <div className="flex items-center justify-self-end gap-2.5 sm:gap-4">
            <LanguageToggle />
            <Link
              href={cartHref}
              aria-label={cantidadCarrito > 0 ? `${t.nav.cart} — ${t.nav.cartPending}` : t.nav.cart}
              className="relative text-foreground"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M3 6h2l2.4 12.2a2 2 0 0 0 2 1.8h8.4a2 2 0 0 0 2-1.6L22 9H6" />
                <circle cx="10" cy="21" r="1" />
                <circle cx="18" cy="21" r="1" />
              </svg>
              {cantidadCarrito > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-accent-foreground">
                  {cantidadCarrito > 9 ? "9+" : cantidadCarrito}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>
    </>
  )
}
