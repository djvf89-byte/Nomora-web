# Flujos de Usuario — NOMORA v1.0

## Convenciones

- **[AUTO]** = acción del sistema sin intervención humana
- **[ADMIN]** = acción realizada por un administrador
- **[CUSTOMER]** = acción realizada por el cliente
- `Pedido →` = transición de estado del pedido

---

## Flujo 1: Registro de usuario

```
Usuario accede a /registro
→ Completa formulario (nombre, email, contraseña)
→ [AUTO] Cuenta creada con rol CUSTOMER
→ [AUTO] Email de verificación enviado
→ Usuario verifica email
→ Accede al catálogo como CUSTOMER
```

---

## Flujo 2: Exploración de catálogo

```
[CUSTOMER] Accede a /catalogo
→ Ve productos (Tomatodo, Ponchos, Toallas, Medias de neopreno)
→ Filtra por categoría
→ Entra al detalle de un producto
→ Selecciona variante (talla/color)
→ [AUTO] Muestra disponibilidad de stock de esa variante
→ Agrega al carrito
```

---

## Flujo 3: Checkout y pago

```
[CUSTOMER] Accede al carrito
→ Revisa productos, variantes, cantidades
→ Ingresa dirección de envío
→ [AUTO] Calcula costo de envío según zona
→ Selecciona método de pago: Yape / Plin / Transferencia / Tarjeta

Caso A — Tarjeta (MercadoPago):
→ [CUSTOMER] Completa pago en checkout de MercadoPago
→ [AUTO] Webhook confirma pago
→ Pedido → PAGADO
→ [AUTO] Stock de la variante se descuenta
→ [AUTO] Cliente notificado: pedido confirmado

Caso B — Yape / Plin / Transferencia:
→ [CUSTOMER] Realiza el pago fuera de la plataforma
→ [CUSTOMER] Sube comprobante (imagen)
→ Pedido → PENDIENTE (esperando verificación)
→ [ADMIN] Revisa comprobante en dashboard
→ Aprueba: Pedido → PAGADO · [AUTO] Stock se descuenta · [CUSTOMER] notificado
→ Rechaza: Pedido permanece PENDIENTE · [ADMIN] contacta al cliente
```

---

## Flujo 4: Gestión de pedido (ADMIN)

```
[ADMIN] Accede a dashboard de pedidos
→ Ve pedidos PAGADO pendientes de despacho
→ Prepara el pedido
→ Marca como ENVIADO
→ [AUTO] Cliente notificado con estado de envío

[ADMIN] Confirma entrega (o cliente confirma recepción)
→ Pedido → ENTREGADO
```

---

## Flujo 5: Cancelación de pedido

```
Caso A — Antes del pago:
[CUSTOMER] Cancela pedido en estado PENDIENTE
→ Pedido → CANCELADO
→ [AUTO] No se afecta stock (no se había descontado)

Caso B — Falta de stock detectada tras la compra:
[ADMIN] Cancela pedido
→ Pedido → CANCELADO
→ [ADMIN] Gestiona reembolso manual (fuera de plataforma en V1)
```

---

## Flujo 6: Administración de catálogo (ADMIN)

```
[ADMIN] Accede a "Gestión de catálogo"
→ Crea/edita producto (nombre, descripción, precio, imágenes, categoría)
→ Define variantes (talla y/o color)
→ Asigna stock inicial por variante
→ Publica producto en catálogo público

[ADMIN] Actualiza stock de una variante
→ [AUTO] Si stock llega a 0, variante se muestra "agotada" en catálogo público
```
