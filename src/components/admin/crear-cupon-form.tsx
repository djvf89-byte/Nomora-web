"use client"

import { useActionState, useRef } from "react"
import { crearCuponAction } from "@/app/actions/admin.actions"

const initialState = { error: undefined as string | undefined, ok: undefined as boolean | undefined }

const inputClass =
  "w-full rounded-[2px] border border-input bg-card px-3 py-2 text-sm outline-none focus:border-ring"

export function CrearCuponForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [state, action, isPending] = useActionState(
    async (_prev: typeof initialState, formData: FormData) => {
      const res = (await crearCuponAction(formData)) ?? initialState
      if (res.ok) formRef.current?.reset()
      return res
    },
    initialState
  )

  return (
    <form ref={formRef} action={action} className="grid grid-cols-2 gap-3 border border-border p-4 sm:grid-cols-4">
      {state?.error && <p className="col-span-full text-sm text-destructive">{state.error}</p>}
      {state?.ok && <p className="col-span-full text-sm text-muted-foreground">Cupón creado.</p>}

      <div className="col-span-2 space-y-1">
        <label htmlFor="codigo" className="text-xs font-medium text-muted-foreground uppercase">
          Código
        </label>
        <input id="codigo" name="codigo" placeholder="VERANO10" required className={inputClass} />
      </div>

      <div className="space-y-1">
        <label htmlFor="porcentaje" className="text-xs font-medium text-muted-foreground uppercase">
          % Descuento
        </label>
        <input
          id="porcentaje"
          name="porcentaje"
          type="number"
          min={1}
          max={100}
          required
          className={inputClass}
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="usosMaximos" className="text-xs font-medium text-muted-foreground uppercase">
          Usos máx. (opcional)
        </label>
        <input id="usosMaximos" name="usosMaximos" type="number" min={1} className={inputClass} />
      </div>

      <div className="space-y-1">
        <label htmlFor="fechaInicio" className="text-xs font-medium text-muted-foreground uppercase">
          Desde (opcional)
        </label>
        <input id="fechaInicio" name="fechaInicio" type="date" className={inputClass} />
      </div>

      <div className="space-y-1">
        <label htmlFor="fechaFin" className="text-xs font-medium text-muted-foreground uppercase">
          Hasta (opcional)
        </label>
        <input id="fechaFin" name="fechaFin" type="date" className={inputClass} />
      </div>

      <div className="col-span-full flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-[2px] bg-foreground px-5 py-2 text-xs font-semibold tracking-[0.08em] text-background uppercase disabled:opacity-50"
        >
          {isPending ? "Creando..." : "Crear cupón"}
        </button>
      </div>
    </form>
  )
}
