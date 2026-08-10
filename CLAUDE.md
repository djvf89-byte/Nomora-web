# NOMORA — CLAUDE.md

## Qué es este proyecto

NOMORA es un ecommerce peruano de productos para la aventura. Vende inventario propio (no es marketplace, no intermedia entre terceros): tomatodos con álbum de stickers coleccionables, ponchos playeros, toallas de playa y medias de neopreno.

**No es un marketplace. No vende productos de terceros. No gestiona fulfillment por dropshipping en V1.**

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | Next.js 16, TypeScript, TailwindCSS, Shadcn UI |
| Backend | Next.js fullstack (API Routes / Server Actions) |
| Base de datos | PostgreSQL + Prisma ORM |
| Auth | NextAuth.js |
| Storage | Cloudinary |
| Pagos | MercadoPago (tarjeta) + verificación manual (Yape/Plin/transferencia) |
| Deploy | Vercel |

## Reglas para Claude

### Antes de escribir cualquier código

1. Analiza la idea o cambio propuesto.
2. Detecta riesgos técnicos y operativos.
3. Propón arquitectura o enfoque.
4. Espera aprobación explícita del usuario antes de implementar.

### Durante el desarrollo

- No asumir reglas de negocio no definidas en `docs/business-rules.md`.
- Toda lógica de negocio debe pasar por servicios (`/src/services`), no directamente en rutas o componentes.
- Los estados de pedido son los definidos en `docs/business-rules.md`. No inventar nuevos.
- El stock se controla por variante (talla/color), nunca por producto agregado.
- El stock se descuenta solo al confirmarse el pago (`PAGADO`), nunca al crear el pedido.
- En V1 los pagos por Yape/Plin/transferencia requieren verificación manual del admin. Solo tarjeta vía MercadoPago confirma pago automáticamente.
- No implementar automatizaciones no aprobadas (ej. liberación automática de stock, reembolsos automáticos).
- El checkout es de invitado: nunca exigir cuenta/login al cliente para comprar. El login (`/auth/login`) es exclusivo para el rol ADMIN, sin registro público.

## Lo que NO hacer en V1

- Marketplace / venta de terceros
- Dropshipping
- OCR
- IA / ML
- Recojo en tienda física
- Envíos internacionales
- App móvil nativa

## Identidad de marca

- Paleta: `#0B0B0B` negro, `#F2EFE9` blanco hueso, `#CDBA9B` beige, `#6B705C` verde oliva, `#E07A5F` terracota
- Tipografía: Inter, tracking amplio, mayúsculas en headers de marca
- Tono: Inspira / Conecta / Simple — mensajes cortos y directos
- Tagline: "Empieza tu ruta."

### Convenciones de código

- TypeScript estricto (`strict: true`).
- Componentes en PascalCase, utilidades en camelCase.
- Rutas de API en `/src/app/api/`.
- Esquemas de validación con Zod.
- No usar `any`. No suprimir errores de TypeScript sin comentario explicativo.

## Documentación del proyecto

- `docs/prd.md` — Product Requirements Document
- `docs/business-rules.md` — Reglas de negocio y estados
- `docs/risk-matrix.md` — Matriz de riesgos
- `docs/user-flows.md` — Flujos de usuario por rol
- `docs/design-benchmark.md` — Benchmark de marcas (Stanley, Chaco, Hydro Flask) y features derivadas para V1/V1.1/V2
