import { listarProductosConVariantes } from "@/services/producto.service"
import { dbSafe } from "@/lib/db-safe"
import { formatSoles } from "@/lib/format"
import { EditorStock } from "@/components/admin/editor-stock"

export default async function CatalogoAdminPage() {
  const { data: productos, dbError } = await dbSafe(() => listarProductosConVariantes(), [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Catálogo</h1>
        <p className="text-muted-foreground">Stock por variante. Para poblar el catálogo real, corre `npm run seed`.</p>
      </div>

      {dbError && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          No se pudo conectar a la base de datos. No se puede cargar el catálogo por ahora.
        </div>
      )}

      {!dbError && productos.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No hay productos cargados todavía. Corre <code>npm run seed</code> con una base de datos conectada.
        </p>
      )}

      {productos.length > 0 && (
        <div className="space-y-6">
          {productos.map((producto) => (
            <section key={producto.id} className="border border-border">
              <header className="flex items-center justify-between border-b border-border px-4 py-3">
                <div>
                  <h2 className="text-sm font-semibold text-foreground">{producto.nombre}</h2>
                  <p className="text-xs text-muted-foreground">{formatSoles(producto.precioCentimos)}</p>
                </div>
              </header>
              <ul className="divide-y divide-border">
                {producto.variantes.map((variante) => (
                  <li key={variante.id} className="flex items-center justify-between px-4 py-3 text-sm">
                    <span className="text-muted-foreground">
                      {[variante.talla, variante.color].filter(Boolean).join(" · ") || "Única"}
                    </span>
                    <EditorStock varianteId={variante.id} stockInicial={variante.stock} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
