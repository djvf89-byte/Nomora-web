import { listarOfertas } from "@/services/oferta.service"
import { listarProductosBasico } from "@/services/producto.service"
import { dbSafe } from "@/lib/db-safe"
import { formatFecha } from "@/lib/format"
import { CrearOfertaForm } from "@/components/admin/crear-oferta-form"
import { AccionDesactivar } from "@/components/admin/accion-desactivar"
import { desactivarOfertaAction } from "@/app/actions/admin.actions"

export default async function OfertasPage() {
  const [{ data: ofertas, dbError }, { data: productos }] = await Promise.all([
    dbSafe(() => listarOfertas(), []),
    dbSafe(() => listarProductosBasico(), []),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Ofertas de temporada</h1>
        <p className="text-muted-foreground">
          % de descuento aplicado a productos específicos durante un rango de fechas. Se muestra como precio tachado
          en el catálogo.
        </p>
      </div>

      <CrearOfertaForm productos={productos} />

      {dbError && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          No se pudo conectar a la base de datos. No se pueden cargar ofertas por ahora.
        </div>
      )}

      {!dbError && ofertas.length === 0 && (
        <p className="text-sm text-muted-foreground">Todavía no hay ofertas creadas.</p>
      )}

      {ofertas.length > 0 && (
        <ul className="divide-y divide-border border border-border">
          {ofertas.map((oferta) => (
            <li key={oferta.id} className="flex flex-wrap items-center justify-between gap-4 px-4 py-4">
              <div className="text-sm">
                <p className="font-medium text-foreground">
                  {oferta.nombre} — {oferta.porcentaje}%
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatFecha(oferta.fechaInicio)} — {formatFecha(oferta.fechaFin)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {oferta.productos.map((p) => p.nombre).join(", ")}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {oferta.activo ? (
                  <span className="rounded-full bg-secondary px-2.5 py-1 text-xs text-secondary-foreground">
                    Activa
                  </span>
                ) : (
                  <span className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">Inactiva</span>
                )}
                {oferta.activo && <AccionDesactivar id={oferta.id} action={desactivarOfertaAction} />}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
