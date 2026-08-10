"use client"

import { useLocale } from "@/lib/i18n/locale-context"

export function ComoFunciona() {
  const { t } = useLocale()

  return (
    <section
      id="album"
      className="border-b border-border py-16 sm:py-24"
      style={{ background: "color-mix(in srgb, var(--nomora-blanco-hueso) 100%, white 40%)" }}
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6 sm:mb-13">
          <div>
            <p
              className="text-xs font-semibold tracking-[0.16em] uppercase"
              style={{ color: "color-mix(in srgb, var(--nomora-terracota) 78%, var(--nomora-negro) 22%)" }}
            >
              {t.comoFunciona.eyebrow}
            </p>
            <h2 className="mt-2.5 text-3xl font-black tracking-[-0.02em] text-foreground sm:text-4xl">
              {t.comoFunciona.heading}
            </h2>
          </div>
          <p className="max-w-[42ch] text-[15px] text-muted-foreground">{t.comoFunciona.subheading}</p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-12">
          {t.comoFunciona.steps.map((paso, i) => (
            <div key={paso.titulo} className="flex flex-col gap-3.5">
              <span
                className="font-mono text-[13px] tracking-[0.08em]"
                style={{ color: "color-mix(in srgb, var(--nomora-terracota) 78%, var(--nomora-negro) 22%)" }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-[19px] font-semibold tracking-[-0.01em] text-foreground">{paso.titulo}</h3>
              <p className="max-w-[30ch] text-[14.5px] text-muted-foreground">{paso.texto}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
