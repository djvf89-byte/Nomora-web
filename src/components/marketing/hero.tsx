"use client"

import Link from "next/link"
import { LogoNomoraFull } from "@/components/brand/isotipo"
import { HeroVideoBackground } from "@/components/marketing/hero-video-background"
import { useLocale } from "@/lib/i18n/locale-context"

export function Hero() {
  const { t } = useLocale()

  return (
    <header className="relative overflow-hidden border-b border-white/10 bg-[var(--nomora-negro)]">
      <HeroVideoBackground />
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(ellipse 900px 500px at 50% 82%, color-mix(in srgb, var(--nomora-terracota) 30%, transparent) 0%, transparent 62%), linear-gradient(to bottom, color-mix(in srgb, var(--nomora-negro) 78%, transparent) 0%, color-mix(in srgb, var(--nomora-negro) 60%, transparent) 45%, var(--nomora-negro) 100%)",
        }}
      />
      <div className="relative z-[2] mx-auto flex max-w-6xl flex-col items-center px-6 pt-16 text-center sm:pt-24">
        <LogoNomoraFull className="mb-7 h-auto w-[220px] text-[var(--nomora-blanco-hueso)] sm:w-[280px]" />
        <p
          className="mb-5 text-xs font-semibold tracking-[0.3em] uppercase"
          style={{ color: "color-mix(in srgb, var(--nomora-terracota) 55%, var(--nomora-blanco-hueso) 45%)" }}
        >
          {t.hero.eyebrow}
        </p>
        <h1 className="text-[52px] leading-[0.96] font-black tracking-[-0.03em] text-balance text-[var(--nomora-blanco-hueso)] sm:text-[88px] lg:text-[124px]">
          {t.hero.headline1}
          <br />
          {t.hero.headline2}
        </h1>
        <p className="mt-6 max-w-[46ch] text-base text-white/70 sm:text-lg">{t.hero.deck}</p>

        <div className="mt-9 flex flex-wrap justify-center gap-3.5">
          <Link
            href="/catalogo"
            className="inline-flex items-center rounded-[2px] border border-[var(--nomora-blanco-hueso)] bg-[var(--nomora-blanco-hueso)] px-8 py-3.5 text-xs font-semibold tracking-[0.16em] text-[var(--nomora-negro)] uppercase transition-colors hover:border-[var(--nomora-terracota)] hover:bg-[var(--nomora-terracota)]"
          >
            {t.hero.ctaPrimary}
          </Link>
        </div>

        <svg
          className="mt-10 w-full sm:mt-16"
          viewBox="0 0 1180 300"
          preserveAspectRatio="none"
          role="img"
          aria-label="Silueta de montañas al amanecer"
        >
          <circle cx="590" cy="220" r="100" fill="var(--nomora-terracota)" />
          <path
            d="M0 300 L0 210 L140 110 L230 190 L330 80 L470 210 L560 140 L660 220 L760 90 L880 200 L980 120 L1080 210 L1180 170 L1180 300 Z"
            fill="var(--nomora-beige)"
            opacity="0.22"
          />
          <path
            d="M0 300 L0 240 L110 170 L210 230 L340 140 L430 240 L540 180 L650 250 L740 160 L860 245 L960 185 L1070 250 L1180 220 L1180 300 Z"
            fill="var(--nomora-verde-oliva)"
            opacity="0.4"
          />
          <path
            d="M0 300 L0 262 L120 205 L220 258 L350 185 L450 262 L560 212 L670 268 L770 195 L890 264 L1000 210 L1090 264 L1180 248 L1180 300 Z"
            fill="var(--nomora-negro)"
          />
        </svg>
      </div>
    </header>
  )
}
