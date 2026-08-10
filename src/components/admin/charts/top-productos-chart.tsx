"use client"

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList, Cell } from "recharts"
import type { ProductoVendido } from "@/services/metricas.service"

function TooltipProducto({ active, payload }: { active?: boolean; payload?: { payload: ProductoVendido }[] }) {
  if (!active || !payload?.length) return null
  const p = payload[0].payload
  return (
    <div className="border border-border bg-card px-3 py-2 text-xs shadow-sm">
      <p className="font-medium text-foreground">{p.nombre}</p>
      <p className="text-muted-foreground">{p.unidades} unidades vendidas</p>
    </div>
  )
}

export function TopProductosChart({ datos }: { datos: ProductoVendido[] }) {
  if (datos.length === 0) {
    return <p className="text-sm text-muted-foreground">Todavía no hay ventas registradas.</p>
  }

  const alturaFila = 34
  const altura = Math.max(datos.length * alturaFila, 80)

  return (
    <div>
      <p className="mb-3 text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
        Más vendidos
      </p>
      <div style={{ height: altura }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={datos} layout="vertical" margin={{ top: 0, right: 28, left: 0, bottom: 0 }} barCategoryGap={10}>
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="nombre"
              tick={{ fontSize: 12, fill: "var(--foreground)" }}
              axisLine={false}
              tickLine={false}
              width={128}
            />
            <Tooltip content={<TooltipProducto />} cursor={{ fill: "var(--muted)" }} />
            <Bar dataKey="unidades" radius={[0, 4, 4, 0]} maxBarSize={18}>
              {datos.map((_, i) => (
                <Cell key={i} fill="var(--nomora-verde-oliva)" />
              ))}
              <LabelList
                dataKey="unidades"
                position="right"
                style={{ fill: "var(--foreground)", fontSize: 12, fontWeight: 600 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
