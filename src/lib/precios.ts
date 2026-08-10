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
