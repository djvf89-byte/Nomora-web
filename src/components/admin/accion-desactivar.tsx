"use client"

import { useActionState } from "react"

const initialState = { error: undefined as string | undefined, ok: undefined as boolean | undefined }

export function AccionDesactivar({
  id,
  action,
}: {
  id: string
  action: (formData: FormData) => Promise<{ error: string | undefined; ok: boolean | undefined }>
}) {
  const [state, formAction, isPending] = useActionState(
    async (_prev: typeof initialState, formData: FormData) => {
      return (await action(formData)) ?? initialState
    },
    initialState
  )

  if (state?.ok) return <span className="text-xs text-muted-foreground">Desactivado</span>

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        disabled={isPending}
        className="rounded-[2px] border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:border-destructive hover:text-destructive disabled:opacity-50"
      >
        Desactivar
      </button>
      {state?.error && <p className="mt-1 text-xs text-destructive">{state.error}</p>}
    </form>
  )
}
