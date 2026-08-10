"use client"

import { useActionState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { loginAction } from "@/app/actions/auth.actions"
import { useLocale } from "@/lib/i18n/locale-context"

const initialState = { error: undefined as string | undefined }

export function LoginForm() {
  const { t } = useLocale()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") ?? "/admin"
  const passwordCambiada = searchParams.get("passwordCambiada") === "1"
  const [state, action, isPending] = useActionState(
    async (_prev: typeof initialState, formData: FormData) => {
      formData.set("callbackUrl", callbackUrl)
      return (await loginAction(formData)) ?? initialState
    },
    initialState
  )

  return (
    <form action={action} className="space-y-4">
      {passwordCambiada && !state?.error && (
        <div className="rounded-md border border-border bg-muted px-4 py-3">
          <p className="text-sm text-muted-foreground">Contraseña actualizada. Inicia sesión de nuevo.</p>
        </div>
      )}

      {state?.error && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3">
          <p className="text-sm text-destructive">{state.error}</p>
        </div>
      )}

      <div className="space-y-1.5">
        <label htmlFor="email" className="text-sm font-medium">
          {t.login.email}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="tu@email.com"
          required
          autoComplete="email"
          className="w-full rounded-md border border-input bg-card px-4 py-2.5 text-sm outline-none transition focus:border-ring"
        />
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="text-sm font-medium">
            {t.login.password}
          </label>
          <Link href="/auth/olvide-password" className="text-xs text-muted-foreground hover:text-foreground">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          required
          autoComplete="current-password"
          className="w-full rounded-md border border-input bg-card px-4 py-2.5 text-sm outline-none transition focus:border-ring"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium tracking-wide text-primary-foreground uppercase transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {isPending ? t.login.submitting : t.login.submit}
      </button>
    </form>
  )
}
