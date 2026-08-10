import Link from "next/link"
import { contarPedidosPorEstado } from "@/services/pedido.service"
import { listarPagosPendientes } from "@/services/pago.service"
import { dbSafe } from "@/lib/db-safe"

export default async function AdminDashboardPage() {
  const [pedidos, pagos] = await Promise.all([
    dbSafe(() => contarPedidosPorEstado(), {
      PENDIENTE: 0,
      PAGADO: 0,
      ENVIADO: 0,
      ENTREGADO: 0,
      CANCELADO: 0,
    }),
    dbSafe(() => listarPagosPendientes(), []),
  ])

  const dbError = pedidos.dbError || pagos.dbError

  const stats = [
    { label: "Pendientes de pago", value: pedidos.data.PENDIENTE, href: "/admin/pedidos?estado=PENDIENTE" },
    { label: "Pagos por verificar", value: pagos.data.length, href: "/admin/pagos" },
    { label: "Por despachar", value: pedidos.data.PAGADO, href: "/admin/pedidos?estado=PAGADO" },
    { label: "En camino", value: pedidos.data.ENVIADO, href: "/admin/pedidos?estado=ENVIADO" },
    { label: "Entregados", value: pedidos.data.ENTREGADO, href: "/admin/pedidos?estado=ENTREGADO" },
    { label: "Cancelados", value: pedidos.data.CANCELADO, href: "/admin/pedidos?estado=CANCELADO" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Resumen</h1>
        <p className="text-muted-foreground">Estado general de pedidos y pagos.</p>
      </div>

      {dbError && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          No se pudo conectar a la base de datos. Los números de abajo están en 0 hasta que haya una conexión real
          (ver <code>DATABASE_URL</code> en <code>.env.local</code>).
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="border border-border p-4 transition-colors hover:bg-muted"
          >
            <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
            <p className="mt-1 text-xs text-muted-foreground uppercase">{stat.label}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
