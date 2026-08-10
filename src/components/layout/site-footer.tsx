"use client"

import Link from "next/link"
import { Sello } from "@/components/brand/sello"
import { useLocale } from "@/lib/i18n/locale-context"

const REDES = [
  {
    nombre: "Instagram",
    href: "https://instagram.com/nomora",
    icono: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
      </>
    ),
  },
  {
    nombre: "TikTok",
    href: "https://tiktok.com/@nomora",
    icono: (
      <path d="M14 3v10.5a3 3 0 1 1-2.4-2.94 M14 3c.4 2.2 1.9 3.7 4 4v3c-1.5 0-2.9-.4-4-1.2" />
    ),
  },
  {
    nombre: "WhatsApp",
    href: "https://wa.me/51900000000",
    icono: (
      <path d="M7 17l-1.4 3.4L9 19a8 8 0 1 0-3.2-3.1L7 17Z M8.7 8.7c0 3 2.6 5.6 5.6 5.6l1-2-2.4-1-.9 1a5 5 0 0 1-2.3-2.3l1-.9-1-2.4-2 1Z" />
    ),
  },
]

export function SiteFooter() {
  const { t } = useLocale()

  return (
    <footer className="bg-background">
      <div className="mx-auto max-w-6xl px-6 pt-16 pb-10 sm:pt-20">
        <div className="grid grid-cols-1 gap-10 border-b border-border pb-11 sm:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            <span className="text-[17px] font-black tracking-[0.3em] text-foreground uppercase">Nomora</span>
            <p className="mt-4 max-w-[32ch] text-[13.5px] text-muted-foreground">{t.footer.tagline}</p>
            <div className="mt-5 flex gap-3">
              {REDES.map((red) => (
                <a
                  key={red.nombre}
                  href={red.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={red.nombre}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-accent hover:text-accent"
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    {red.icono}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h5 className="mb-4 text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
              {t.footer.tienda}
            </h5>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li>
                <Link href="/catalogo" className="text-foreground hover:text-accent">
                  {t.footer.catalogo}
                </Link>
              </li>
              <li>
                <Link href="/#album" className="text-foreground hover:text-accent">
                  {t.footer.album}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="mb-4 text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
              {t.footer.newsletterTitle}
            </h5>
            <form className="flex max-w-[340px]">
              <input
                type="email"
                placeholder={t.footer.emailPlaceholder}
                aria-label={t.footer.emailPlaceholder}
                className="min-w-0 flex-1 border border-foreground bg-transparent px-3.5 py-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-accent"
              />
              <button
                type="submit"
                className="border border-foreground bg-foreground px-4 text-[11px] font-semibold tracking-[0.12em] text-background uppercase"
              >
                {t.footer.subscribe}
              </button>
            </form>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-6">
          <small className="text-xs text-muted-foreground">{t.footer.rights}</small>
          <div className="flex gap-2">
            <Sello variante="negro" size={22} />
            <Sello variante="hueso" size={22} />
            <Sello variante="beige" size={22} />
          </div>
        </div>
      </div>
    </footer>
  )
}
