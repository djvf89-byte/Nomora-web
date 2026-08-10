# Benchmark de Diseño y UX — NOMORA

Patrones extraídos de marcas con producto coleccionable/personalizable (Stanley, Chaco, Hydro Flask) y su traducción a features concretas para NOMORA. No son ideas sueltas: cada patrón está mapeado a V1, V1.1 (post-lanzamiento) o V2, según impacto vs. esfuerzo.

---

## Patrones observados

### Stanley 1913 (stanley1913.com)
- Navegación con "Shop by Color" — filtro visual por color, no solo texto.
- Umbral de envío gratis comunicado de forma prominente en toda la navegación.
- Programa de lealtad ("Stanley 1913 Club") con acceso anticipado a drops/ediciones limitadas.
- "Leakproof legends" — sección de destacados con copy corto y directo por producto.
- Redes sociales y suscripción SMS visibles como canal de engagement recurrente.
- Programa de afiliados/Creators Fund para impulsar contenido de usuarios.

### Chaco (chacos.com)
- Sección "Customize" (MyChaco) en navegación principal — la personalización es un destino, no un accesorio escondido.
- "#ChacoNation" — carrusel de contenido de Instagram de clientes reales, cada imagen enlaza al producto que llevan puesto.
- Carrusel "Best Sellers" en home.
- Newsletter con 15% de descuento en la primera compra.
- Badges de confianza visibles: envío gratis desde monto X, devoluciones fáciles, soporte por chat, estado de pedido accesible.

### Hydro Flask (de research previo)
- El sticker/customización es lo que hizo viral al producto — no fue publicidad pagada, fue gente mostrando su botella decorada en redes.
- Embajadores reales (guías, deportistas que practican la actividad), no celebridades.
- La marca "respeta el gusto estético del usuario en vez de perseguirlo" — el sticker no debe forzar una estética única de marca, debe dar espacio a que cada botella se vea distinta.

---

## Traducción a features NOMORA

| Patrón | Feature en NOMORA | Fase |
|--------|--------------------|------|
| Shop by Color | Filtro por color en catálogo (ya existen variantes color) | **V1** |
| Badge de envío incluido | Mostrar "Envío incluido" en tarjeta de producto y checkout (ya es regla de negocio) | **V1** |
| Badge de devoluciones fáciles | Mostrar "Cambios y devoluciones en 7 días" en producto y checkout (ya es regla de negocio) | **V1** |
| Estado de pedido accesible | Vista de "Mis pedidos" con estado actual (ya está en alcance V1) | **V1** |
| Carrusel Best Sellers | Sección de productos destacados en home | **V1** |
| #ChacoNation (UGC) | Galería en home con fotos de clientes mostrando su tomatodo + stickers — curada manualmente por admin (subida vía Cloudinary), sin integración API de Instagram en V1 | **V1.1** |
| Newsletter con descuento | Captura de email + código de bienvenida | **V1.1** |
| Programa de lealtad / drops anticipados | Club con acceso anticipado a nuevos packs de stickers | **V2** |
| Sección "Customize"/álbum dedicado | Página que explica la mecánica del álbum de stickers y muestra ejemplos de clientes | **V1.1** |
| Packs de stickers por temporada (ediciones limitadas) | Requiere modelar `StickerPack` con temporada/colección en el catálogo, para sostener el mecanismo de coleccionable en el tiempo | **V2** |
| Embajadores reales / UGC en campañas | Estrategia de marketing, no requiere desarrollo — usar clientes reales en redes en vez de influencers genéricos | Fuera de alcance técnico |

---

## Decisión para V1

Se incorporan al alcance técnico de V1: filtro por color, badges de envío/devoluciones, estado de pedido, carrusel de destacados en home. El resto queda documentado como backlog post-lanzamiento (V1.1/V2) para no bloquear el primer release.
