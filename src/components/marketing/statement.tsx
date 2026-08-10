"use client"

import { useLocale } from "@/lib/i18n/locale-context"

export function Statement() {
  const { t } = useLocale()

  return (
    <section className="border-b border-border bg-[var(--nomora-verde-oliva)] text-[var(--nomora-blanco-hueso)]">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
        <p className="mb-5 text-xs font-semibold tracking-[0.22em] text-white/70 uppercase">{t.statement.eyebrow}</p>
        <blockquote className="max-w-[22ch] text-3xl leading-[1.06] font-black tracking-[-0.02em] text-balance sm:text-5xl">
          {t.statement.quote}
        </blockquote>
      </div>
    </section>
  )
}
