"use client"

import { useActionState } from "react"
import { cambiarEstadoPedidoAction } from "@/app/actions/admin.actions"
import { ESTADO_PEDIDO_LABEL } from "@/lib/format"

const initialState = { error: undefined as string | undefined, ok: undefined as boolean | undefined }

const SIGUIENTES: Record<string, string[]> = {
  PENDIENTE: ["PAGADO", "CANCELADO"],
  PAGADO: ["ENVIADO", "CANCELADO"],
  ENVIADO: ["ENTREGADO"],
  ENTREGADO: [],
  CANCELADO: [],
}

export function AccionesPedido({ pedidoId, estado }: { pedidoId: string; estado: string }) {
  const [state, action, isPending] = useActionState(
    async (_prev: typeof initialState, formData: FormData) => {
      return (await cambiarEstadoPedidoAction(formData)) ?? initialState
    },
    initialState
  )

  const opciones = SIGUIENTES[estado] ?? []

  if (opciones.length === 0) {
    return <p className="text-sm text-muted-foreground">No hay más transiciones disponibles para este pedido.</p>
  }

  return (
    <div className="space-y-3">
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      {state?.ok && <p className="text-sm text-secondary-foreground">Pedido actualizado.</p>}
      <div className="flex flex-wrap gap-2">
        {opciones.map((nuevoEstado) => (
          <form key={nuevoEstado} action={action}>
            <input type="hidden" name="pedidoId" value={pedidoId} />
            <input type="hidden" name="nuevoEstado" value={nuevoEstado} />
            <button
              type="submit"
              disabled={isPending}
              className="rounded-[2px] border border-foreground px-4 py-2 text-xs font-semibold tracking-[0.08em] uppercase transition-colors hover:bg-foreground hover:text-background disabled:opacity-50"
            >
              Marcar como {ESTADO_PEDIDO_LABEL[nuevoEstado]}
            </button>
          </form>
        ))}
      </div>
    </div>
  )
}
