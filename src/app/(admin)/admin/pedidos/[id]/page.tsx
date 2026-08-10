import { notFound } from "next/navigation"
import Link from "next/link"
import { obtenerPedidoDetalle } from "@/services/pedido.service"
import { dbSafe } from "@/lib/db-safe"
import { formatSoles, formatFecha, ESTADO_PEDIDO_LABEL, ESTADO_PEDIDO_CLASS } from "@/lib/format"
import { AccionesPedido } from "@/components/admin/acciones-pedido"

export default async function PedidoDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data: pedido, dbError } = await dbSafe(() => obtenerPedidoDetalle(id), null)

  if (dbError) {
    return (
      <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
        No se pudo conectar a la base de datos.
      </div>
    )
  }

  if (!pedido) notFound()

  return (
    <div className="space-y-8">
      <div>
        <Link href="/admin/pedidos" className="text-xs text-muted-foreground hover:text-foreground">
          ← Volver a pedidos
        </Link>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="text-xl font-semibold">Pedido #{pedido.id.slice(-8)}</h1>
          <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${ESTADO_PEDIDO_CLASS[pedido.estado]}`}>
            {ESTADO_PEDIDO_LABEL[pedido.estado]}
          </span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{formatFecha(pedido.creadoEn)}</p>
      </div>

      <AccionesPedido pedidoId={pedido.id} estado={pedido.estado} />

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <section>
          <h2 className="mb-3 text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">Cliente</h2>
          <div className="space-y-1 text-sm">
            <p className="font-medium text-foreground">{pedido.nombreCliente}</p>
            <p className="text-muted-foreground">{pedido.emailCliente}</p>
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">Envío</h2>
          <div className="space-y-1 text-sm text-muted-foreground">
            <p className="text-foreground">{pedido.direccion.destinatario}</p>
            <p>{pedido.direccion.telefono}</p>
            <p>{pedido.direccion.direccion}</p>
            <p>
              {pedido.direccion.distrito}, {pedido.direccion.ciudad}
            </p>
            {pedido.direccion.referencia && <p>Ref: {pedido.direccion.referencia}</p>}
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">Pago</h2>
          {pedido.pago ? (
            <div className="space-y-1 text-sm text-muted-foreground">
              <p className="text-foreground">{pedido.pago.tipo}</p>
              <p>Estado: {pedido.pago.estado}</p>
              <p>{formatSoles(pedido.pago.montoCentimos)}</p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Sin información de pago.</p>
          )}
        </section>

        <section>
          <h2 className="mb-3 text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">Productos</h2>
          <ul className="space-y-2 text-sm">
            {pedido.items.map((item) => (
              <li key={item.id} className="flex items-center justify-between">
                <span>
                  {item.variante.producto.nombre}
                  {item.variante.talla || item.variante.color
                    ? ` (${[item.variante.talla, item.variante.color].filter(Boolean).join(" · ")})`
                    : ""}{" "}
                  × {item.cantidad}
                </span>
                <span className="font-medium">{formatSoles(item.precioUnitarioCentimos * item.cantidad)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-sm font-semibold">
            <span>Total</span>
            <span>{formatSoles(pedido.totalCentimos)}</span>
          </div>
        </section>
      </div>
    </div>
  )
}
