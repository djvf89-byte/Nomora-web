"use client"

import { useLocale } from "@/lib/i18n/locale-context"

export function CatalogoHeader() {
  const { t } = useLocale()

  return (
    <div className="mx-auto max-w-6xl px-6 pt-12 sm:pt-16">
      <h1 className="text-3xl font-black tracking-[-0.02em] text-foreground sm:text-4xl">{t.catalog.pageTitle}</h1>
      <p className="mt-3 max-w-[48ch] text-[15px] text-muted-foreground">{t.catalog.pageSubtitle}</p>
    </div>
  )
}
