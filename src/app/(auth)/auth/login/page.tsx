"use client"

import { Suspense } from "react"
import { LoginForm } from "@/components/auth/LoginForm"
import { useLocale } from "@/lib/i18n/locale-context"

export default function LoginPage() {
  const { t } = useLocale()

  return (
    <>
      <div className="mb-6 text-center">
        <h1 className="text-xl font-semibold">{t.login.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t.login.subtitle}</p>
      </div>
      <Suspense>
        <LoginForm />
      </Suspense>
    </>
  )
}
