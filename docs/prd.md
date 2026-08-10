# PRD — NOMORA v1.0

## Resumen ejecutivo

NOMORA es un ecommerce peruano de productos para la aventura. Vende productos físicos propios (inventario propio, sin modelo marketplace) dirigidos a personas que salen de la rutina: playa, montaña o cualquier tipo de salida. No se ata a un solo terreno.

Tagline: **"Empieza tu ruta."**
Frase de marca: *"Nomora no es para todos. Es para quienes no se quedan quietos."*

## Problema

Quienes viven experiencias de aventura (viajes, salidas, actividades outdoor) no tienen una forma tangible de coleccionar y recordar esos momentos, ni productos pensados específicamente para ese estilo de vida con identidad de marca propia.

## Solución

Catálogo propio de productos funcionales para la aventura, con un diferencial de marca: el tomatodo NOMORA incluye un set de stickers coleccionables (álbum de aventuras) para que el usuario registre físicamente sus experiencias.

## Alcance V1

### Catálogo inicial

| Producto | Variantes | Notas |
|----------|-----------|-------|
| Tomatodo NOMORA | Color | Incluye stickers coleccionables tipo álbum |
| Poncho playero | Talla, color | — |
| Toalla de playa | Color | — |
| Medias de neopreno | Talla | — |

Todos los productos manejan variantes (talla y/o color) con stock independiente por variante.

### Incluido

| Módulo | Descripción |
|--------|-------------|
| Autenticación | Login exclusivo para ADMIN (NextAuth). Sin registro público — los clientes no tienen cuenta |
| Roles | ADMIN (única cuenta con login) |
| Catálogo | Listado de productos con variantes, filtros por categoría y por color |
| Home | Sección de productos destacados (best sellers), badges de envío incluido y devoluciones en 7 días |
| Checkout de invitado | Compra sin cuenta: selección de variante y datos de contacto/envío directo en el checkout |
| Pagos | Yape, Plin, transferencia bancaria (verificación manual), tarjeta vía MercadoPago |
| Pedidos | Flujo: Pendiente → Pagado → Enviado → Entregado |
| Envíos | Delivery nacional (Perú), costo incluido en el precio del producto |
| Dashboard administrativo | Gestión de catálogo, stock por variante, pedidos, pagos |

### Excluido en V1

- Marketplace / venta de terceros
- Modelo de suscripción
- App móvil nativa
- Envíos internacionales
- OCR / IA / ML
- Recojo en tienda física (evaluar en V2)
- Programa de puntos o fidelización digital más allá del álbum físico de stickers

## Mercado objetivo

- **País:** Perú
- **Perfil:** Personas activas, buscan salir de la rutina — playa, montaña, cualquier tipo de aventura.

## Modelo de negocio

Venta directa de producto físico con margen propio (no comisión de intermediación, a diferencia de Transfiero). Envío incluido en el precio del producto (sin cobro separado en checkout).

**Rango de precios objetivo:** S/ 80 – S/ 150 por producto (gama media), envío incluido. Precio final por producto pendiente de definir.

## Política de devoluciones y cambios

- Plazo: 7 días calendario desde la entrega.
- El cliente puede pedir devolución de dinero o cambio (producto sin uso, empaque y stickers originales).
- Gestión manual por admin en V1 (sin reembolso automático vía pasarela).

## Métodos de pago aceptados (V1)

| Método | Tipo | Verificación |
|--------|------|--------------|
| Yape | Wallet digital | Manual (admin revisa comprobante) |
| Plin | Wallet digital | Manual (admin revisa comprobante) |
| Transferencia bancaria | Banca tradicional | Manual (admin revisa comprobante) |
| Tarjeta Visa / Mastercard | Pasarela MercadoPago | Automática (webhook) |

## Roles y permisos

### ADMIN (único rol con cuenta)
- Gestión completa de catálogo (productos, variantes, stock, precios)
- Gestión de pedidos (ver, actualizar estado)
- Verificación manual de pagos (Yape/Plin/transferencia)
- Gestión de envíos (marcar como enviado, agregar tracking si aplica)
- Ver reportes y métricas

### Cliente (sin cuenta)
- Explorar catálogo y filtrar productos
- Elegir variante (talla/color) de un producto
- Comprar directamente ("Comprar ahora") dejando nombre, email, teléfono y dirección en el checkout — sin crear cuenta ni iniciar sesión
- Recibe confirmación por email; no hay panel de "mis pedidos" en V1 (requeriría cuenta)

## Identidad de marca (referencia para diseño)

- Paleta: `#0B0B0B` negro, `#F2EFE9` blanco hueso, `#CDBA9B` beige, `#6B705C` verde oliva, `#E07A5F` terracota
- Tipografía: Inter, tracking amplio, mayúsculas en logo/headers de marca
- Tono de comunicación: Inspira / Conecta / Simple — mensajes cortos, directos, auténticos
- Estilo fotográfico: real, natural, aventura, momentos, movimiento

## Backlog post-lanzamiento (V1.1 / V2)

Features identificadas en el benchmark de diseño (ver `docs/design-benchmark.md`) que no bloquean el lanzamiento pero suman a la estrategia de marca:

- **V1.1:** galería de contenido de clientes (UGC) en home, curada manualmente por admin; newsletter con descuento de bienvenida; página dedicada a explicar la mecánica del álbum de stickers.
- **V2:** programa de lealtad con acceso anticipado a nuevos packs de stickers; packs de stickers por temporada/edición limitada (requiere modelar `StickerPack` en el catálogo).

## Supuestos y decisiones de diseño

- Flujo de pedido simple, sin pasos intermedios de validación compleja como en Transfiero — pero los pagos por Yape/Plin/transferencia requieren revisión manual del comprobante antes de marcar el pedido como "Pagado" (no hay webhook automático para esos métodos).
- Sin integración de terceros para fulfillment; despacho gestionado manualmente por admin en V1.
- Precio final por producto (dentro del rango S/ 80–150) pendiente de definir antes de cargar el catálogo real.
