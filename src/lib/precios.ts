// Envío dentro de Lima y Callao: gratis desde el umbral, S/13.50 por debajo de él.
// La tarifa de envío a provincia (resto del país) todavía no está definida — ver docs/business-rules.md.
export const UMBRAL_ENVIO_GRATIS_LIMA_CENTIMOS = 10000
export const COSTO_ENVIO_LIMA_CENTIMOS = 1350

// Deliberadamente estricto: solo las provincias "Lima" (Lima Metropolitana) y "Callao",
// no todo el departamento de Lima (que incluye provincias lejanas como Cañete o Huaral).
export function esProvinciaLima(provincia: string) {
  const valor = provincia.trim().toLowerCase()
  return valor === "lima" || valor === "callao"
}

// Calcula el costo de envío sobre el monto ya con descuento aplicado.
// Fuera de Lima/Callao devuelve 0 (sin cobrar) porque la tarifa aún no está definida.
export function calcularEnvioCentimos(provincia: string, totalConDescuentoCentimos: number) {
  if (!esProvinciaLima(provincia)) return 0
  return totalConDescuentoCentimos >= UMBRAL_ENVIO_GRATIS_LIMA_CENTIMOS ? 0 : COSTO_ENVIO_LIMA_CENTIMOS
}

// Cupones y ofertas de temporada no se combinan — se aplica el mayor de los dos.
// Ver docs/business-rules.md.
export function calcularPrecioConDescuento(
  precioCentimos: number,
  porcentajeOferta: number,
  porcentajeCupon: number
) {
  const porcentajeAplicado = Math.max(porcentajeOferta, porcentajeCupon, 0)
  const descuentoCentimos = Math.round((precioCentimos * porcentajeAplicado) / 100)
  const precioFinalCentimos = precioCentimos - descuentoCentimos

  return { precioFinalCentimos, descuentoCentimos, porcentajeAplicado }
}
