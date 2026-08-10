import Link from "next/link"
import { listarPedidos } from "@/services/pedido.service"
import { dbSafe } from "@/lib/db-safe"
import { formatSoles, formatFecha, ESTADO_PEDIDO_LABEL, ESTADO_PEDIDO_CLASS } from "@/lib/format"
import type { EstadoPedido } from "@prisma/client"

const ESTADOS: EstadoPedido[] = ["PENDIENTE", "PAGADO", "ENVIADO", "ENTREGADO", "CANCELADO"]

export default async function PedidosPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string }>
}) {
  const { estado } = await searchParams
  const estadoFiltro = ESTADOS.includes(estado as EstadoPedido) ? (estado as EstadoPedido) : undefined

  const { data: pedidos, dbError } = await dbSafe(() => listarPedidos(estadoFiltro), [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Pedidos</h1>
        <p className="text-muted-foreground">Ver y actualizar el estado de los pedidos.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          href="/admin/pedidos"
          className={`rounded-[2px] border px-3 py-1.5 text-xs font-medium uppercase ${!estadoFiltro ? "border-foreground bg-foreground text-background" : "border-border text-foreground"}`}
        >
          Todos
        </Link>
        {ESTADOS.map((e) => (
          <Link
            key={e}
            href={`/admin/pedidos?estado=${e}`}
            className={`rounded-[2px] border px-3 py-1.5 text-xs font-medium uppercase ${estadoFiltro === e ? "border-foreground bg-foreground text-background" : "border-border text-foreground"}`}
          >
            {ESTADO_PEDIDO_LABEL[e]}
          </Link>
        ))}
      </div>

      {dbError && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          No se pudo conectar a la base de datos. No se pueden cargar pedidos por ahora.
        </div>
      )}

      {!dbError && pedidos.length === 0 && (
        <p className="text-sm text-muted-foreground">No hay pedidos{estadoFiltro ? ` en estado ${ESTADO_PEDIDO_LABEL[estadoFiltro]}` : ""}.</p>
      )}

      {pedidos.length > 0 && (
        <div className="overflow-x-auto border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground uppercase">
                <th className="px-4 py-3 font-medium">Pedido</th>
                <th className="px-4 py-3 font-medium">Cliente</th>
                <th className="px-4 py-3 font-medium">Fecha</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((pedido) => (
                <tr key={pedido.id} className="border-b border-border last:border-0 hover:bg-muted">
                  <td className="px-4 py-3">
                    <Link href={`/admin/pedidos/${pedido.id}`} className="font-mono text-xs hover:text-accent">
                      #{pedido.id.slice(-8)}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <p>{pedido.nombreCliente}</p>
                    <p className="text-xs text-muted-foreground">{pedido.emailCliente}</p>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{formatFecha(pedido.creadoEn)}</td>
                  <td className="px-4 py-3 font-medium">{formatSoles(pedido.totalCentimos)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${ESTADO_PEDIDO_CLASS[pedido.estado]}`}
                    >
                      {ESTADO_PEDIDO_LABEL[pedido.estado]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
