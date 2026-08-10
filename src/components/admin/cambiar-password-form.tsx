"use client"

import { useActionState } from "react"
import { cambiarPasswordAction } from "@/app/actions/admin.actions"

const initialState = { error: undefined as string | undefined, ok: undefined as boolean | undefined }

const inputClass =
  "w-full rounded-[2px] border border-input bg-card px-3 py-2 text-sm outline-none focus:border-ring"

export function CambiarPasswordForm() {
  const [state, action, isPending] = useActionState(
    async (_prev: typeof initialState, formData: FormData) => {
      return (await cambiarPasswordAction(formData)) ?? initialState
    },
    initialState
  )

  return (
    <form action={action} className="max-w-sm space-y-4 border border-border p-4">
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}

      <div className="space-y-1">
        <label htmlFor="passwordActual" className="text-xs font-medium text-muted-foreground uppercase">
          Contraseña actual
        </label>
        <input
          id="passwordActual"
          name="passwordActual"
          type="password"
          autoComplete="current-password"
          required
          className={inputClass}
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="passwordNueva" className="text-xs font-medium text-muted-foreground uppercase">
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

      <div className="space-y-1">
        <label htmlFor="passwordConfirmar" className="text-xs font-medium text-muted-foreground uppercase">
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
        className="rounded-[2px] bg-foreground px-5 py-2 text-xs font-semibold tracking-[0.08em] text-background uppercase disabled:opacity-50"
      >
        {isPending ? "Guardando..." : "Cambiar contraseña"}
      </button>
    </form>
  )
}
