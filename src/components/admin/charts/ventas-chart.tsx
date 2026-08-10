"use client"

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import type { VentaPorDia } from "@/services/metricas.service"
import { formatSoles } from "@/lib/format"

function formatEje(fecha: string) {
  const [, mes, dia] = fecha.split("-")
  return `${dia}/${mes}`
}

function TooltipVentas({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="border border-border bg-card px-3 py-2 text-xs shadow-sm">
      <p className="mb-1 font-medium text-foreground">{label ? formatEje(label) : ""}</p>
      <p className="text-muted-foreground">
        Ventas: <span className="font-medium text-foreground">{formatSoles(payload[0].value)}</span>
      </p>
    </div>
  )
}

export function VentasChart({ datos, dias = 14 }: { datos: VentaPorDia[]; dias?: number }) {
  const total = datos.reduce((acc, d) => acc + d.totalCentimos, 0)

  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between">
        <p className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
          Ventas ({dias} días)
        </p>
        <p className="text-lg font-semibold text-foreground">{formatSoles(total)}</p>
      </div>
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={datos} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="ventasFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--nomora-terracota)" stopOpacity={0.28} />
                <stop offset="100%" stopColor="var(--nomora-terracota)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="0" />
            <XAxis
              dataKey="fecha"
              tickFormatter={formatEje}
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              axisLine={{ stroke: "var(--border)" }}
              tickLine={false}
              minTickGap={24}
            />
            <YAxis
              tickFormatter={(v) => `S/${Math.round(v / 100)}`}
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              axisLine={false}
              tickLine={false}
              width={48}
            />
            <Tooltip content={<TooltipVentas />} cursor={{ stroke: "var(--border)" }} />
            <Area
              type="monotone"
              dataKey="totalCentimos"
              stroke="var(--nomora-terracota)"
              strokeWidth={2}
              fill="url(#ventasFill)"
              dot={false}
              activeDot={{ r: 4, fill: "var(--nomora-terracota)", stroke: "var(--card)", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
