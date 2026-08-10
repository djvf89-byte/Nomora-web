"use client"

import { useActionState, useRef } from "react"
import { crearOfertaAction } from "@/app/actions/admin.actions"
import { formatSoles } from "@/lib/format"

const initialState = { error: undefined as string | undefined, ok: undefined as boolean | undefined }

const inputClass =
  "w-full rounded-[2px] border border-input bg-card px-3 py-2 text-sm outline-none focus:border-ring"

interface ProductoBasico {
  id: string
  nombre: string
  precioCentimos: number
}

export function CrearOfertaForm({ productos }: { productos: ProductoBasico[] }) {
  const formRef = useRef<HTMLFormElement>(null)
  const [state, action, isPending] = useActionState(
    async (_prev: typeof initialState, formData: FormData) => {
      const res = (await crearOfertaAction(formData)) ?? initialState
      if (res.ok) formRef.current?.reset()
      return res
    },
    initialState
  )

  return (
    <form ref={formRef} action={action} className="space-y-4 border border-border p-4">
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      {state?.ok && <p className="text-sm text-muted-foreground">Oferta creada.</p>}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="col-span-2 space-y-1">
          <label htmlFor="nombre" className="text-xs font-medium text-muted-foreground uppercase">
            Nombre de la oferta
          </label>
          <input id="nombre" name="nombre" placeholder="Ofertas de verano" required className={inputClass} />
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
          <label htmlFor="fechaInicio" className="text-xs font-medium text-muted-foreground uppercase">
            Desde
          </label>
          <input id="fechaInicio" name="fechaInicio" type="date" required className={inputClass} />
        </div>
        <div className="col-span-2 space-y-1">
          <label htmlFor="fechaFin" className="text-xs font-medium text-muted-foreground uppercase">
            Hasta
          </label>
          <input id="fechaFin" name="fechaFin" type="date" required className={inputClass} />
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground uppercase">Productos incluidos</p>
        {productos.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No hay productos cargados todavía (corre <code>npm run seed</code>).
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {productos.map((producto) => (
              <label
                key={producto.id}
                className="flex items-center gap-2.5 border border-border px-3 py-2 text-sm has-[:checked]:border-foreground"
              >
                <input type="checkbox" name="productoIds" value={producto.id} />
                <span className="flex-1">{producto.nombre}</span>
                <span className="text-xs text-muted-foreground">{formatSoles(producto.precioCentimos)}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending || productos.length === 0}
          className="rounded-[2px] bg-foreground px-5 py-2 text-xs font-semibold tracking-[0.08em] text-background uppercase disabled:opacity-50"
        >
          {isPending ? "Creando..." : "Crear oferta"}
        </button>
      </div>
    </form>
  )
}
