import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
}

// Lockup completo (ícono + wordmark + subrayado), color vía currentColor.
export function LogoNomoraFull({ className }: LogoProps) {
  return (
    <svg className={cn("h-[0.69em] w-[1em]", className)} viewBox="0 0 290 200" aria-hidden="true">
      <use href="#nomora-logo-raw" />
    </svg>
  )
}

// Solo el ícono (montaña), recortado del mismo logo real — para el sello circular.
export function LogoNomoraMark({ className }: LogoProps) {
  return (
    <svg className={cn("h-[0.74em] w-[1em]", className)} viewBox="98 35 114 84" aria-hidden="true">
      <use href="#nomora-logo-raw" />
    </svg>
  )
}
