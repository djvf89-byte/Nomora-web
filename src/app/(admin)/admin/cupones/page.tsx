import { listarCupones } from "@/services/cupon.service"
import { dbSafe } from "@/lib/db-safe"
import { formatFecha } from "@/lib/format"
import { CrearCuponForm } from "@/components/admin/crear-cupon-form"
import { AccionDesactivar } from "@/components/admin/accion-desactivar"
import { desactivarCuponAction } from "@/app/actions/admin.actions"

export default async function CuponesPage() {
  const { data: cupones, dbError } = await dbSafe(() => listarCupones(), [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Cupones</h1>
        <p className="text-muted-foreground">Códigos de descuento por porcentaje, aplicables en el checkout.</p>
      </div>

      <CrearCuponForm />

      {dbError && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          No se pudo conectar a la base de datos. No se pueden cargar cupones por ahora.
        </div>
      )}

      {!dbError && cupones.length === 0 && (
        <p className="text-sm text-muted-foreground">Todavía no hay cupones creados.</p>
      )}

      {cupones.length > 0 && (
        <div className="overflow-x-auto border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground uppercase">
                <th className="px-4 py-3 font-medium">Código</th>
                <th className="px-4 py-3 font-medium">%</th>
                <th className="px-4 py-3 font-medium">Vigencia</th>
                <th className="px-4 py-3 font-medium">Usos</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {cupones.map((cupon) => (
                <tr key={cupon.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-mono text-xs">{cupon.codigo}</td>
                  <td className="px-4 py-3">{cupon.porcentaje}%</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {cupon.fechaInicio ? formatFecha(cupon.fechaInicio) : "Sin inicio"} —{" "}
                    {cupon.fechaFin ? formatFecha(cupon.fechaFin) : "Sin fin"}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {cupon.usosActuales}
                    {cupon.usosMaximos ? ` / ${cupon.usosMaximos}` : ""}
                  </td>
                  <td className="px-4 py-3">
                    {cupon.activo ? (
                      <span className="rounded-full bg-secondary px-2.5 py-1 text-xs text-secondary-foreground">
                        Activo
                      </span>
                    ) : (
                      <span className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                        Inactivo
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {cupon.activo && <AccionDesactivar id={cupon.id} action={desactivarCuponAction} />}
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
