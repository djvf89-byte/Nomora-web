import { Resend } from "resend"

export const EMAIL_FROM = process.env.RESEND_FROM_EMAIL ?? "pedidos@somosnomora.com"

let cliente: Resend | null = null

// El SDK de Resend valida el API key en el constructor y lanza si está vacío — hay que
// crear el cliente recién al enviar (no al importar el módulo), para no romper el build
// ni ninguna otra ruta cuando todavía no hay credenciales configuradas.
export function obtenerClienteResend(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return null
  if (!cliente) cliente = new Resend(apiKey)
  return cliente
}
