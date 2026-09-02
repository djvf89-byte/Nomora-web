import Link from "next/link"
import { listarPagosPendientes } from "@/services/pago.service"
import { dbSafe } from "@/lib/db-safe"
import { formatSoles, formatFecha } from "@/lib/format"
import { AccionesPago } from "@/components/admin/acciones-pago"

const METODO_LABEL: Record<string, string> = {
  YAPE: "Yape",
  PLIN: "Plin",
  TRANSFERENCIA_BANCARIA: "Transferencia bancaria",
  TARJETA: "Tarjeta",
  PAGO_EFECTIVO: "Pago Efectivo",
}

export default async function PagosPage() {
  const { data: pagos, dbError } = await dbSafe(() => listarPagosPendientes(), [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Pagos por verificar</h1>
        <p className="text-muted-foreground">
          Yape, Plin y transferencia requieren verificación manual antes de marcar el pedido como pagado.
        </p>
      </div>

      {dbError && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          No se pudo conectar a la base de datos. No se pueden cargar pagos por ahora.
        </div>
      )}

      {!dbError && pagos.length === 0 && (
        <p className="text-sm text-muted-foreground">No hay pagos pendientes de verificación.</p>
      )}

      {pagos.length > 0 && (
        <ul className="divide-y divide-border border border-border">
          {pagos.map((pago) => (
            <li key={pago.id} className="flex flex-wrap items-center justify-between gap-4 px-4 py-4">
              <div className="text-sm">
                <Link href={`/admin/pedidos/${pago.pedidoId}`} className="font-mono text-xs hover:text-accent">
                  Pedido #{pago.pedidoId.slice(-8)}
                </Link>
                <p className="mt-1 text-foreground">{pago.pedido.nombreCliente}</p>
                <p className="text-muted-foreground">
                  {pago.tipo ? (METODO_LABEL[pago.tipo] ?? pago.tipo) : "Método aún no elegido"} ·{" "}
                  {formatSoles(pago.montoCentimos)} · {formatFecha(pago.creadoEn)}
                </p>
              </div>
              <AccionesPago pagoId={pago.id} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
