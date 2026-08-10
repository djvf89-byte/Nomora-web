# Matriz de Riesgos — NOMORA v1.0

**Escala de probabilidad:** 1 (muy baja) → 5 (muy alta)
**Escala de impacto:** 1 (mínimo) → 5 (crítico)
**Puntuación = Probabilidad × Impacto**

---

## Riesgos operativos

| # | Riesgo | Prob. | Impacto | Score | Mitigación |
|---|--------|-------|---------|-------|------------|
| O1 | Sobreventa: dos clientes compran la última unidad de una variante al mismo tiempo | 3 | 4 | 12 | Descuento de stock atómico en DB al confirmar pago; verificación de stock antes de marcar `PAGADO` |
| O2 | Cliente paga por Yape/Plin y el admin tarda en verificar el comprobante | 4 | 3 | 12 | SLA interno de verificación (por definir); panel de admin con pedidos pendientes destacados |
| O3 | Comprobante de pago falso o adulterado | 2 | 4 | 8 | Revisión manual del comprobante contra montos esperados; cruce con estado de cuenta bancaria |
| O4 | Cliente solicita devolución/cambio fuera de condiciones (producto usado, sin empaque) y disputa la decisión del admin | 2 | 3 | 6 | Política de devoluciones publicada en checkout y confirmación de pedido; criterios claros de aceptación |
| O5 | Error de stock por variante (talla/color mal descontado) | 2 | 3 | 6 | Pruebas de checkout por variante; logs de movimiento de stock |
| O6 | Demora en despacho por gestión manual de envíos | 3 | 2 | 6 | Definir plazo de despacho; dashboard de pedidos `PAGADO` sin `ENVIADO` |

---

## Riesgos técnicos

| # | Riesgo | Prob. | Impacto | Score | Mitigación |
|---|--------|-------|---------|-------|------------|
| T1 | Condición de carrera en descuento de stock (compras simultáneas) | 3 | 4 | 12 | Transacción atómica en DB al confirmar pago; bloqueo optimista con Prisma |
| T2 | Manipulación de precios o totales desde el frontend | 2 | 5 | 10 | Todo cálculo de precio/total se valida en el servidor; nunca confiar en el cliente |
| T3 | Webhook de MercadoPago falla o no llega (pedido pagado pero no marcado) | 2 | 4 | 8 | Reconciliación manual desde panel admin; endpoint de verificación de estado por `payment_id` |
| T4 | Escalada no autorizada de rol (CUSTOMER accede a rutas ADMIN) | 2 | 5 | 10 | Middleware de autorización en todas las rutas de API; validación server-side siempre |
| T5 | Exposición de datos sensibles (direcciones, comprobantes de pago) | 2 | 4 | 8 | HTTPS obligatorio; comprobantes en Cloudinary con acceso restringido a admin |
| T6 | Pérdida de imágenes de comprobantes en Cloudinary | 2 | 3 | 6 | Política de no eliminación de evidencia de pago |

---

## Riesgos legales / regulatorios

| # | Riesgo | Prob. | Impacto | Score | Mitigación |
|---|--------|-------|---------|-------|------------|
| L1 | Incumplimiento de Código de Protección al Consumidor (derecho de retracto, garantías) | 2 | 4 | 8 | Política de devoluciones definida (7 días, dinero o cambio) y visible en checkout; validar con asesoría legal antes de lanzamiento |
| L2 | Violación a Ley de Protección de Datos Personales (Ley 29733) | 2 | 4 | 8 | Política de privacidad; consentimiento explícito; retención mínima de datos |
| L3 | Reclamos por demoras de envío sin política de compensación clara | 2 | 3 | 6 | Definir SLA de envío y comunicarlo al cliente en checkout |

---

## Resumen por prioridad

| Prioridad | Riesgos | Acción requerida |
|-----------|---------|-------------------|
| Crítica (≥15) | — | Ninguno identificado aún |
| Alta (10–14) | O1, O2, T1, T2, T4 | Mitigar antes del lanzamiento |
| Media (6–9) | O3, O4, O5, O6, T3, T5, T6, L1, L2, L3 | Monitorear; mitigar en siguientes versiones |
| Baja (≤5) | — | — |

---

## Pendientes de decisión (afectan riesgos)

- SLA de verificación de pagos manuales (O2).
- SLA de despacho tras pago confirmado (O6, L3).
- Precio final por producto (dentro del rango S/ 80–150).
- Validación legal formal de la política de devoluciones (L1).
