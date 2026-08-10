"use client"

import { useLocale } from "@/lib/i18n/locale-context"

export function LanguageToggle() {
  const { locale, setLocale } = useLocale()
  const isEn = locale === "en"

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isEn}
      aria-label={isEn ? "Switch to Spanish" : "Cambiar a inglés"}
      onClick={() => setLocale(isEn ? "es" : "en")}
      className="relative flex h-7 w-[52px] shrink-0 items-center rounded-full border border-border bg-muted px-[3px] transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
    >
      <span
        className="pointer-events-none absolute top-[3px] left-[3px] flex h-[22px] w-[22px] items-center justify-center rounded-full bg-foreground text-[9px] font-bold text-background shadow-sm transition-transform duration-200 ease-out"
        style={{ transform: isEn ? "translateX(24px)" : "translateX(0px)" }}
      >
        {isEn ? "EN" : "ES"}
      </span>
      <span className="sr-only">{isEn ? "English" : "Español"}</span>
    </button>
  )
}
