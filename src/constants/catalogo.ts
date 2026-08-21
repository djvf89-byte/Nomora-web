export interface Variante {
  id: string
  talla?: string
  color?: string
  diseno?: string
  imagen?: string
  imagenesAdicionales?: string[]
  medida?: string
  stock: number
}

export interface Producto {
  slug: string
  nombre: string
  descripcion: string
  spec: string
  precioDesde: number
  variantes: Variante[]
  imagenesAdicionales?: string[]
}

// Precios y stock ilustrativos dentro del rango objetivo (S/ 80-150, ver docs/prd.md).
// Precio final y stock real por producto todavía pendientes de definir/cargar.
export const CATALOGO: Producto[] = [
  {
    slug: "tomatodo",
    nombre: "Tomatodo Nomora",
    descripcion:
      "Botella de acero con álbum de 40 stickers coleccionables incluido: un diseño por cada destino y experiencia del Perú. Cada aventura que vives suma un sticker nuevo a tu álbum.",
    spec: "Acero · 750 ml · álbum de 40 stickers incluido",
    precioDesde: 89,
    variantes: [
      {
        id: "tomatodo-negro",
        color: "Negro",
        imagen: "/productos/tomatodos/tomatodo-negro.webp",
        imagenesAdicionales: ["/productos/tomatodos/tomatodo-negro-posterior.webp"],
        stock: 0,
      },
    ],
    imagenesAdicionales: ["/productos/tomatodos/album-stickers.webp"],
  },
  {
    slug: "poncho-playero",
    nombre: "Poncho playero",
    descripcion: "Poncho de secado rápido para cambiarte en la playa o después del mar sin pasar frío.",
    spec: "Microfibra · secado rápido",
    precioDesde: 119,
    variantes: [
      {
        id: "poncho-s-azul",
        talla: "S",
        color: "Azul",
        imagen: "/productos/ponchos/poncho-azul.webp",
        imagenesAdicionales: ["/productos/ponchos/poncho-azul-vida-1.webp", "/productos/ponchos/poncho-azul-vida-2.webp"],
        medida: "95 x 66 cm",
        stock: 7,
      },
      {
        id: "poncho-l-azul",
        talla: "L",
        color: "Azul",
        imagen: "/productos/ponchos/poncho-azul.webp",
        imagenesAdicionales: ["/productos/ponchos/poncho-azul-vida-1.webp", "/productos/ponchos/poncho-azul-vida-2.webp"],
        medida: "104 x 69 cm",
        stock: 0,
      },
      {
        id: "poncho-s-oliva",
        talla: "S",
        color: "Verde oliva",
        imagen: "/productos/ponchos/poncho-oliva.webp",
        imagenesAdicionales: ["/productos/ponchos/poncho-oliva-vida-1.webp"],
        medida: "95 x 66 cm",
        stock: 8,
      },
      {
        id: "poncho-l-oliva",
        talla: "L",
        color: "Verde oliva",
        imagen: "/productos/ponchos/poncho-oliva.webp",
        imagenesAdicionales: ["/productos/ponchos/poncho-oliva-vida-1.webp"],
        medida: "104 x 69 cm",
        stock: 6,
      },
      {
        id: "poncho-s-rosa",
        talla: "S",
        color: "Rosa",
        imagen: "/productos/ponchos/poncho-rosa.webp",
        imagenesAdicionales: ["/productos/ponchos/poncho-rosa-vida-1.webp"],
        medida: "95 x 66 cm",
        stock: 5,
      },
      {
        id: "poncho-l-rosa",
        talla: "L",
        color: "Rosa",
        imagen: "/productos/ponchos/poncho-rosa.webp",
        imagenesAdicionales: ["/productos/ponchos/poncho-rosa-vida-1.webp"],
        medida: "104 x 69 cm",
        stock: 3,
      },
      {
        id: "poncho-s-negro",
        talla: "S",
        color: "Negro",
        imagen: "/productos/ponchos/poncho-negro.webp",
        imagenesAdicionales: ["/productos/ponchos/poncho-negro-vida-1.webp"],
        medida: "95 x 66 cm",
        stock: 4,
      },
      {
        id: "poncho-l-negro",
        talla: "L",
        color: "Negro",
        imagen: "/productos/ponchos/poncho-negro.webp",
        imagenesAdicionales: ["/productos/ponchos/poncho-negro-vida-1.webp"],
        medida: "104 x 69 cm",
        stock: 2,
      },
    ],
    imagenesAdicionales: ["/productos/ponchos/poncho-estuche.webp"],
  },
  {
    slug: "toalla-playa",
    nombre: "Toalla de playa",
    descripcion: "Toalla grande de secado rápido, liviana para llevar en cualquier mochila de viaje.",
    spec: "160 x 80 cm · secado rápido",
    precioDesde: 99,
    variantes: [
      { id: "toalla-mancora", diseno: "Máncora", imagen: "/productos/toallas/toalla-mancora.webp", stock: 9 },
      { id: "toalla-gocta", diseno: "Gocta", imagen: "/productos/toallas/toalla-gocta.webp", stock: 10 },
      { id: "toalla-lima", diseno: "Lima", imagen: "/productos/toallas/toalla-lima.webp", stock: 14 },
      { id: "toalla-padel", diseno: "Padel", imagen: "/productos/toallas/toalla-padel.webp", stock: 6 },
      {
        id: "toalla-voley-playa",
        diseno: "Voley playa",
        imagen: "/productos/toallas/toalla-voley-playa.webp",
        stock: 0,
      },
    ],
  },
  {
    slug: "medias-neopreno",
    nombre: "Medias de neopreno",
    descripcion: "Medias de neopreno para actividades acuáticas, protegen del frío y de superficies filosas.",
    spec: "Neopreno 3mm",
    precioDesde: 85,
    variantes: [
      { id: "medias-s", talla: "S", imagen: "/productos/medias-neopreno.webp", stock: 0 },
      { id: "medias-m", talla: "M", imagen: "/productos/medias-neopreno.webp", stock: 0 },
      { id: "medias-l", talla: "L", imagen: "/productos/medias-neopreno.webp", stock: 0 },
      { id: "medias-xl", talla: "XL", imagen: "/productos/medias-neopreno.webp", stock: 0 },
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
