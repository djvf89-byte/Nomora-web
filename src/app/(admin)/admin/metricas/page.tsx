import { obtenerVentasPorDia, obtenerTopProductos, obtenerResumenPedidosPorGrupo } from "@/services/metricas.service"
import { dbSafe } from "@/lib/db-safe"
import { formatSoles } from "@/lib/format"
import { VentasChart } from "@/components/admin/charts/ventas-chart"
import { TopProductosChart } from "@/components/admin/charts/top-productos-chart"
import { PedidosEstadoChart } from "@/components/admin/charts/pedidos-estado-chart"

export default async function MetricasPage() {
  const [ventas, productos, resumen] = await Promise.all([
    dbSafe(() => obtenerVentasPorDia(14), []),
    dbSafe(() => obtenerTopProductos(5), []),
    dbSafe(() => obtenerResumenPedidosPorGrupo(), { pendientes: 0, enProceso: 0, completados: 0, cancelados: 0 }),
  ])

  const dbError = ventas.dbError || productos.dbError || resumen.dbError

  const totalVentas = ventas.data.reduce((acc, d) => acc + d.totalCentimos, 0)
  const totalPedidosPagados = ventas.data.reduce((acc, d) => acc + d.pedidos, 0)
  const ticketPromedio = totalPedidosPagados > 0 ? totalVentas / totalPedidosPagados : 0

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold">Métricas</h1>
        <p className="text-muted-foreground">Ventas, pedidos y productos — últimos 14 días.</p>
      </div>

      {dbError && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          No se pudo conectar a la base de datos. Las gráficas de abajo están vacías hasta que haya una conexión
          real.
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="border border-border p-4">
          <p className="text-2xl font-semibold text-foreground">{formatSoles(totalVentas)}</p>
          <p className="mt-1 text-xs text-muted-foreground uppercase">Ventas (14 días)</p>
        </div>
        <div className="border border-border p-4">
          <p className="text-2xl font-semibold text-foreground">{totalPedidosPagados}</p>
          <p className="mt-1 text-xs text-muted-foreground uppercase">Pedidos pagados</p>
        </div>
        <div className="border border-border p-4">
          <p className="text-2xl font-semibold text-foreground">{formatSoles(ticketPromedio)}</p>
          <p className="mt-1 text-xs text-muted-foreground uppercase">Ticket promedio</p>
        </div>
        <div className="border border-border p-4">
          <p className="text-2xl font-semibold text-foreground">{resumen.data.pendientes}</p>
          <p className="mt-1 text-xs text-muted-foreground uppercase">Por cobrar</p>
        </div>
      </div>

      <div className="border border-border p-5">
        <VentasChart datos={ventas.data} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="border border-border p-5">
          <PedidosEstadoChart datos={resumen.data} />
        </div>
        <div className="border border-border p-5">
          <TopProductosChart datos={productos.data} />
        </div>
      </div>
    </div>
  )
}
