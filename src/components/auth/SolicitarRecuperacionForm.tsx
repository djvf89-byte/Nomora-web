"use client"

import { useActionState } from "react"
import { solicitarRecuperacionAction } from "@/app/actions/auth.actions"

const initialState = {
  error: undefined as string | undefined,
  devLink: undefined as string | undefined,
  enviado: undefined as boolean | undefined,
}

export function SolicitarRecuperacionForm() {
  const [state, action, isPending] = useActionState(
    async (_prev: typeof initialState, formData: FormData) => {
      return (await solicitarRecuperacionAction(formData)) ?? initialState
    },
    initialState
  )

  return (
    <div className="space-y-4">
      <form action={action} className="space-y-4">
        {state?.error && (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3">
            <p className="text-sm text-destructive">{state.error}</p>
          </div>
        )}

        {state?.enviado && (
          <div className="rounded-md border border-border bg-muted px-4 py-3">
            <p className="text-sm text-muted-foreground">
              Si el correo corresponde a una cuenta admin, se envió un link para restablecer la contraseña.
            </p>
          </div>
        )}

        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium">
            Email
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

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium tracking-wide text-primary-foreground uppercase transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {isPending ? "Enviando..." : "Enviar link de recuperación"}
        </button>
      </form>

      {state?.devLink && (
        <div className="rounded-md border border-dashed border-accent/50 bg-accent/10 px-4 py-3">
          <p className="text-xs font-medium text-accent uppercase">Modo desarrollo (sin Resend configurado)</p>
          <a href={state.devLink} className="mt-1 block text-sm break-all text-accent underline">
            {state.devLink}
          </a>
        </div>
      )}
    </div>
  )
}
