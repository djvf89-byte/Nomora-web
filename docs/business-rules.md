# Reglas de Negocio — NOMORA v1.0

## Catálogo y variantes

- Cada producto puede tener una o más **variantes** (talla, color, o combinación de ambas).
- El stock se controla **por variante**, no por producto.
- Un producto sin variantes definidas se trata como una variante única implícita.
- Un producto/variante con stock = 0 se muestra como "agotado" y no puede agregarse al carrito.
- El precio se define a nivel de producto (no varía por variante), salvo que se indique lo contrario más adelante.

---

## Métodos de pago aceptados (V1)

| Método | Verificación | Notas |
|--------|--------------|-------|
| Yape | Manual | Cliente sube comprobante; admin verifica antes de marcar `PAGADO` |
| Plin | Manual | Cliente sube comprobante; admin verifica antes de marcar `PAGADO` |
| Transferencia bancaria | Manual | Cliente sube comprobante; admin verifica antes de marcar `PAGADO` |
| Tarjeta Visa / Mastercard | Automática | Vía MercadoPago (webhook); pedido pasa a `PAGADO` sin intervención manual |

**Regla clave:** un pedido pagado por Yape/Plin/transferencia permanece en `PENDIENTE` hasta que el admin verifica el comprobante manualmente. Solo los pagos con tarjeta vía MercadoPago pueden pasar a `PAGADO` de forma automática.

---

## Roles

- **ADMIN** — único rol con cuenta e inicio de sesión: catálogo, stock, pedidos, verificación de pagos, envíos.
- **Cliente (invitado)** — no tiene cuenta ni login. Explora el catálogo y compra dejando sus datos de contacto y envío directamente en el checkout.

No existe rol de vendedor externo; NOMORA vende únicamente su propio inventario.

**Checkout sin cuenta (V1):** para reducir fricción, el cliente no necesita registrarse ni iniciar sesión para comprar. El pedido guarda `nombreCliente` y `emailCliente` directamente (sin relación a un `Usuario`), y la dirección de envío se crea junto con el pedido. El login (`/auth/login`) es exclusivo para el equipo NOMORA (rol `ADMIN`); no hay registro público de cuentas.

---

## Estados de un pedido

```
PENDIENTE   → Pedido creado, esperando confirmación de pago
PAGADO      → Pago confirmado (automático por tarjeta o manual por admin)
ENVIADO     → Pedido despachado
ENTREGADO   → Pedido recibido por el cliente
CANCELADO   → Pedido cancelado (antes de pago o por falta de stock)
```

### Transiciones válidas

```
PENDIENTE → PAGADO       (webhook MercadoPago, o admin verifica comprobante Yape/Plin/transferencia)
PENDIENTE → CANCELADO    (cliente cancela antes de pagar, o admin cancela por falta de stock)
PAGADO    → ENVIADO      (admin marca despacho)
ENVIADO   → ENTREGADO    (admin marca entrega, o confirmación del cliente)
PAGADO    → CANCELADO    (caso excepcional: admin cancela y gestiona reembolso manual)
```

**Regla de stock:** el stock de la variante se descuenta al confirmarse el pedido como `PAGADO`, no al crearlo como `PENDIENTE`. Un `PENDIENTE` no reserva stock automáticamente en V1 (no hay carrito con bloqueo temporal).

---

## Envíos

- Delivery nacional (Perú). El costo de envío **está incluido en el precio del producto** (no se cobra como línea separada en el checkout).
- Gestión de envío manual por el admin en V1 (sin integración con couriers).
- No hay recojo en tienda física en V1.

---

## Precios de catálogo

- Rango objetivo: **S/ 80 – S/ 150** por producto (gama media), envío incluido.
- Precio final por producto pendiente de definir uno por uno (tomatodo, poncho, toalla, medias de neopreno).

---

## Devoluciones y cambios

- Plazo: **7 días calendario** desde la entrega.
- El cliente puede solicitar **devolución de dinero** o **cambio** (talla/color/producto defectuoso) dentro del plazo.
- Condición: producto sin uso, con empaque y stickers originales (si aplica).
- Proceso en V1: solicitud manual del cliente (contacto/formulario) → admin revisa → aprueba devolución o cambio → gestiona reembolso o nuevo envío manualmente.
- No hay reembolso automático vía pasarela en V1; el admin gestiona el reembolso (incluye devoluciones de pagos con tarjeta vía MercadoPago, que sí soporta reembolso por API a futuro).

---

## Cupones y ofertas de temporada

- **Cupones**: código de descuento por porcentaje (nunca monto fijo), aplicable en el checkout. Puede tener vigencia (fecha inicio/fin) y límite de usos, ambos opcionales. Es global — no está atado a productos específicos.
- **Ofertas de temporada**: % de descuento que el admin aplica a productos específicos (elegidos uno por uno al crear la oferta), activo dentro de un rango de fechas obligatorio. Se muestra como precio tachado + precio final en el catálogo y la ficha de producto — no es un descuento oculto que aparece recién en el checkout.
- **No se combinan.** Si un pedido califica para oferta de temporada Y el cliente además tiene un cupón, se aplica el descuento mayor de los dos, nunca la suma. La resolución final siempre se recalcula en el servidor al confirmar el pedido — nunca se confía en el % mostrado en el cliente.

---

## Restricciones generales

- El precio de un producto no puede modificarse en un pedido ya creado (se toma el precio vigente al momento de la compra).
- Un cliente no puede pagar un pedido que ya fue `CANCELADO`.
- El admin es el único que puede transicionar un pedido a `ENVIADO` o `ENTREGADO`.
- No hay liberación automática de fondos ni escrow — NOMORA es vendedor directo, no intermediario.

---

## Pendientes de definición

- Precios de catálogo por producto.
- Tarifas de envío por zona.
- Política de devoluciones / cambios (no definida aún — requerida antes de V1 por norma de protección al consumidor en Perú).
- Plazo de despacho tras confirmación de pago.
