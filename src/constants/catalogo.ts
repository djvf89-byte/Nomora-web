export interface Variante {
  id: string
  talla?: string
  color?: string
  stock: number
}

export interface Producto {
  slug: string
  nombre: string
  descripcion: string
  spec: string
  precioDesde: number
  variantes: Variante[]
}

// Precios y stock ilustrativos dentro del rango objetivo (S/ 80-150, ver docs/prd.md).
// Precio final y stock real por producto todavía pendientes de definir/cargar.
export const CATALOGO: Producto[] = [
  {
    slug: "tomatodo",
    nombre: "Tomatodo Nomora",
    descripcion:
      "Botella de acero con álbum de stickers coleccionables incluido. Cada aventura suma un sticker nuevo.",
    spec: "Acero · 750 ml · álbum incluido",
    precioDesde: 89,
    variantes: [
      { id: "tomatodo-negro", color: "Negro", stock: 24 },
      { id: "tomatodo-beige", color: "Beige", stock: 15 },
      { id: "tomatodo-oliva", color: "Verde oliva", stock: 9 },
      { id: "tomatodo-terracota", color: "Terracota", stock: 0 },
    ],
  },
  {
    slug: "poncho-playero",
    nombre: "Poncho playero",
    descripcion: "Poncho de secado rápido para cambiarte en la playa o después del mar sin pasar frío.",
    spec: "Microfibra · secado rápido",
    precioDesde: 119,
    variantes: [
      { id: "poncho-s-negro", talla: "S", color: "Negro", stock: 6 },
      { id: "poncho-m-negro", talla: "M", color: "Negro", stock: 11 },
      { id: "poncho-l-negro", talla: "L", color: "Negro", stock: 4 },
      { id: "poncho-m-beige", talla: "M", color: "Beige", stock: 0 },
    ],
  },
  {
    slug: "toalla-playa",
    nombre: "Toalla de playa",
    descripcion: "Toalla grande de secado rápido, liviana para llevar en cualquier mochila de viaje.",
    spec: "160 x 80 cm · secado rápido",
    precioDesde: 99,
    variantes: [
      { id: "toalla-beige", color: "Beige", stock: 18 },
      { id: "toalla-oliva", color: "Verde oliva", stock: 12 },
      { id: "toalla-terracota", color: "Terracota", stock: 7 },
      { id: "toalla-negro", color: "Negro", stock: 3 },
    ],
  },
  {
    slug: "medias-neopreno",
    nombre: "Medias de neopreno",
    descripcion: "Medias de neopreno para actividades acuáticas, protegen del frío y de superficies filosas.",
    spec: "Neopreno 3mm",
    precioDesde: 85,
    variantes: [
      { id: "medias-s", talla: "S", stock: 10 },
      { id: "medias-m", talla: "M", stock: 14 },
      { id: "medias-l", talla: "L", stock: 8 },
      { id: "medias-xl", talla: "XL", stock: 0 },
    ],
  },
]

export function buscarProducto(slug: string): Producto | undefined {
  return CATALOGO.find((p) => p.slug === slug)
}

export function buscarVariante(slug: string, varianteId: string) {
  const producto = buscarProducto(slug)
  const variante = producto?.variantes.find((v) => v.id === varianteId)
  if (!producto || !variante) return null
  return { producto, variante }
}
