export function formatSoles(centimos: number) {
  return `S/ ${(centimos / 100).toFixed(2)}`
}

export function formatFecha(fecha: Date) {
  return new Intl.DateTimeFormat("es-PE", { dateStyle: "medium", timeStyle: "short" }).format(fecha)
}

export const ESTADO_PEDIDO_LABEL: Record<string, string> = {
  PENDIENTE: "Pendiente",
  PAGADO: "Pagado",
  ENVIADO: "Enviado",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
}

export const ESTADO_PEDIDO_CLASS: Record<string, string> = {
  PENDIENTE: "bg-accent/15 text-accent",
  PAGADO: "bg-secondary text-secondary-foreground",
  ENVIADO: "bg-muted text-foreground",
  ENTREGADO: "bg-foreground text-background",
  CANCELADO: "bg-destructive/15 text-destructive",
}
