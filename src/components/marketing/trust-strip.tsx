"use client"

import { useLocale } from "@/lib/i18n/locale-context"

const ICONOS = [
  <path key="1" d="M3 7h11v10H3z M14 10h4l3 3v4h-7z M7 19a1.6 1.6 0 1 0 0-.01 M17.5 19a1.6 1.6 0 1 0 0-.01" />,
  <path key="2" d="M4 4v6h6 M4.5 14a8 8 0 1 0 2-8.5L4 10" />,
  <path key="3" d="M12 2 3 7l9 5 9-5-9-5Z M3 12l9 5 9-5 M3 17l9 5 9-5" />,
]

export function TrustStrip() {
  const { t } = useLocale()

  return (
    <section className="bg-[var(--nomora-negro)] text-[var(--nomora-blanco-hueso)]">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-7 px-6 py-10 sm:grid-cols-3">
        {t.trust.items.map((item, i) => (
          <div key={item.titulo} className="flex items-start gap-3.5">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--nomora-terracota)"
              strokeWidth="1.6"
              className="mt-0.5 shrink-0"
              aria-hidden="true"
            >
              {ICONOS[i]}
            </svg>
            <div>
              <h4 className="mb-1 text-[13.5px] font-semibold">{item.titulo}</h4>
              <p className="text-[13px] text-white/68">{item.texto}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
