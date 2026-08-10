"use client"

import { useActionState } from "react"
import { verificarPagoAction, rechazarPagoAction } from "@/app/actions/admin.actions"

const initialState = { error: undefined as string | undefined, ok: undefined as boolean | undefined }

export function AccionesPago({ pagoId }: { pagoId: string }) {
  const [state, action, isPending] = useActionState(
    async (_prev: typeof initialState, formData: FormData) => {
      const intent = formData.get("intent")
      const fn = intent === "verificar" ? verificarPagoAction : rechazarPagoAction
      return (await fn(formData)) ?? initialState
    },
    initialState
  )

  if (state?.ok) return <span className="text-xs text-muted-foreground">Actualizado</span>

  return (
    <div className="flex flex-col items-end gap-1.5">
      {state?.error && <p className="text-xs text-destructive">{state.error}</p>}
      <div className="flex gap-2">
        <form action={action}>
          <input type="hidden" name="pagoId" value={pagoId} />
          <input type="hidden" name="intent" value="rechazar" />
          <button
            type="submit"
            disabled={isPending}
            className="rounded-[2px] border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:border-destructive hover:text-destructive disabled:opacity-50"
          >
            Rechazar
          </button>
        </form>
        <form action={action}>
          <input type="hidden" name="pagoId" value={pagoId} />
          <input type="hidden" name="intent" value="verificar" />
          <button
            type="submit"
            disabled={isPending}
            className="rounded-[2px] bg-foreground px-3 py-1.5 text-xs font-medium text-background disabled:opacity-50"
          >
            Verificar
          </button>
        </form>
      </div>
    </div>
  )
}
