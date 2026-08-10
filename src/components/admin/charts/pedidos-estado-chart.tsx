"use client"

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList, Cell } from "recharts"
import type { ResumenPedidosPorGrupo } from "@/services/metricas.service"

const GRUPOS: { key: keyof ResumenPedidosPorGrupo; label: string; color: string }[] = [
  { key: "pendientes", label: "Pendientes", color: "var(--nomora-terracota)" },
  { key: "enProceso", label: "En proceso", color: "var(--nomora-verde-oliva)" },
  { key: "completados", label: "Completados", color: "var(--nomora-negro)" },
  { key: "cancelados", label: "Cancelados", color: "var(--destructive)" },
]

function TooltipEstado({ active, payload }: { active?: boolean; payload?: { payload: { label: string; valor: number } }[] }) {
  if (!active || !payload?.length) return null
  const p = payload[0].payload
  return (
    <div className="border border-border bg-card px-3 py-2 text-xs shadow-sm">
      <p className="font-medium text-foreground">{p.label}</p>
      <p className="text-muted-foreground">{p.valor} pedidos</p>
    </div>
  )
}

export function PedidosEstadoChart({ datos }: { datos: ResumenPedidosPorGrupo }) {
  const filas = GRUPOS.map((g) => ({ label: g.label, valor: datos[g.key], color: g.color }))
  const total = filas.reduce((acc, f) => acc + f.valor, 0)

  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between">
        <p className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">Pedidos por estado</p>
        <p className="text-sm text-muted-foreground">{total} en total</p>
      </div>
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={filas} margin={{ top: 16, right: 8, left: 0, bottom: 0 }} barCategoryGap="24%">
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "var(--foreground)" }}
              axisLine={{ stroke: "var(--border)" }}
              tickLine={false}
            />
            <YAxis hide />
            <Tooltip content={<TooltipEstado />} cursor={{ fill: "var(--muted)" }} />
            <Bar dataKey="valor" radius={[4, 4, 0, 0]} maxBarSize={56}>
              {filas.map((fila, i) => (
                <Cell key={i} fill={fila.color} />
              ))}
              <LabelList
                dataKey="valor"
                position="top"
                style={{ fill: "var(--foreground)", fontSize: 13, fontWeight: 600 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
