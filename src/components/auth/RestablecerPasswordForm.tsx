"use client"

import { useActionState } from "react"
import { restablecerPasswordAction } from "@/app/actions/auth.actions"

const initialState = { error: undefined as string | undefined }

const inputClass =
  "w-full rounded-md border border-input bg-card px-4 py-2.5 text-sm outline-none transition focus:border-ring"

export function RestablecerPasswordForm({ token }: { token: string }) {
  const [state, action, isPending] = useActionState(
    async (_prev: typeof initialState, formData: FormData) => {
      formData.set("token", token)
      return (await restablecerPasswordAction(formData)) ?? initialState
    },
    initialState
  )

  return (
    <form action={action} className="space-y-4">
      {state?.error && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3">
          <p className="text-sm text-destructive">{state.error}</p>
        </div>
      )}

      <div className="space-y-1.5">
        <label htmlFor="passwordNueva" className="text-sm font-medium">
          Nueva contraseña
        </label>
        <input
          id="passwordNueva"
          name="passwordNueva"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          className={inputClass}
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="passwordConfirmar" className="text-sm font-medium">
          Confirmar nueva contraseña
        </label>
        <input
          id="passwordConfirmar"
          name="passwordConfirmar"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          className={inputClass}
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium tracking-wide text-primary-foreground uppercase transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {isPending ? "Guardando..." : "Restablecer contraseña"}
      </button>
    </form>
  )
}
