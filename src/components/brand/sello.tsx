import { cn } from "@/lib/utils"
import { LogoNomoraMark } from "./isotipo"

const VARIANTES = {
  negro: "bg-[var(--nomora-negro)] text-[var(--nomora-blanco-hueso)]",
  hueso: "bg-[var(--nomora-blanco-hueso)] text-[var(--nomora-negro)] border border-[var(--nomora-negro)]",
  beige: "bg-[var(--nomora-beige)] text-[var(--nomora-negro)]",
} as const

interface SelloProps {
  variante?: keyof typeof VARIANTES
  /** Tamaño fijo en px. Omítelo y usa `className` (ej. "h-8 w-8 sm:h-10 sm:w-10") para tamaños responsive. */
  size?: number
  className?: string
}

export function Sello({ variante = "negro", size, className }: SelloProps) {
  return (
    <span
      className={cn("flex shrink-0 items-center justify-center rounded-full", VARIANTES[variante], className)}
      style={size ? { width: size, height: size } : undefined}
    >
      <LogoNomoraMark className="h-[52%] w-[52%]" />
    </span>
  )
}
