"use client"

import { useActionState } from "react"
import { actualizarStockAction } from "@/app/actions/admin.actions"

const initialState = { error: undefined as string | undefined, ok: undefined as boolean | undefined }

export function EditorStock({ varianteId, stockInicial }: { varianteId: string; stockInicial: number }) {
  const [state, action, isPending] = useActionState(
    async (_prev: typeof initialState, formData: FormData) => {
      return (await actualizarStockAction(formData)) ?? initialState
    },
    initialState
  )

  return (
    <form action={action} className="flex items-center justify-end gap-2">
      <input type="hidden" name="varianteId" value={varianteId} />
      <input
        type="number"
        name="stock"
        min={0}
        defaultValue={stockInicial}
        className="w-16 rounded-[2px] border border-input bg-card px-2 py-1 text-right text-sm outline-none focus:border-ring"
      />
      <button
        type="submit"
        disabled={isPending}
        className="rounded-[2px] border border-border px-2.5 py-1 text-xs font-medium text-foreground hover:border-foreground disabled:opacity-50"
      >
        Guardar
      </button>
      {state?.error && <span className="text-xs text-destructive">{state.error}</span>}
      {state?.ok && <span className="text-xs text-muted-foreground">✓</span>}
    </form>
  )
}
