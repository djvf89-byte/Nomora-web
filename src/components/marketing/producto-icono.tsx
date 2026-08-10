const ICONOS: Record<string, React.ReactNode> = {
  tomatodo: (
    <svg viewBox="0 0 86 110" fill="none" aria-hidden="true" className="h-full w-full">
      <rect x="18" y="24" width="50" height="78" rx="10" fill="var(--nomora-negro)" />
      <rect x="30" y="8" width="26" height="20" rx="4" fill="var(--nomora-verde-oliva)" />
      <rect x="18" y="52" width="50" height="6" fill="var(--nomora-terracota)" />
      <path d="M35 18L51 18" stroke="var(--nomora-beige)" strokeWidth="2" />
    </svg>
  ),
  "poncho-playero": (
    <svg viewBox="0 0 96 110" fill="none" aria-hidden="true" className="h-full w-full">
      <path d="M48 6 L86 40 L70 40 L70 104 L26 104 L26 40 L10 40 Z" fill="var(--nomora-verde-oliva)" />
      <circle cx="48" cy="24" r="9" fill="var(--nomora-blanco-hueso)" />
    </svg>
  ),
  "toalla-playa": (
    <svg viewBox="0 0 100 90" fill="none" aria-hidden="true" className="h-full w-full">
      <rect x="8" y="10" width="84" height="70" rx="3" fill="var(--nomora-beige)" />
      <rect x="8" y="10" width="84" height="14" fill="var(--nomora-terracota)" />
      <rect x="8" y="66" width="84" height="14" fill="var(--nomora-negro)" opacity="0.75" />
    </svg>
  ),
  "medias-neopreno": (
    <svg viewBox="0 0 70 112" fill="none" aria-hidden="true" className="h-full w-full">
      <path
        d="M14 4 H56 V60 C56 60 66 78 60 104 H44 L38 66 H32 L26 104 H10 C4 78 14 60 14 60 Z"
        fill="var(--nomora-negro)"
      />
    </svg>
  ),
}

export function ProductoIcono({ slug }: { slug: string }) {
  return <>{ICONOS[slug] ?? null}</>
}
