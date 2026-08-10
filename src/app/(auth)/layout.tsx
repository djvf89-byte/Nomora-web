"use client"

import Link from "next/link"
import { useLocale } from "@/lib/i18n/locale-context"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { t } = useLocale()

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          {t.login.backToStore}
        </Link>
        <p className="mb-8 text-center text-lg font-semibold tracking-[0.2em] uppercase">Nomora</p>
        {children}
      </div>
    </div>
  )
}
