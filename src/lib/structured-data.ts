import type { Producto } from "@/constants/catalogo"
import { SITE_URL } from "./site"

// JSON-LD schema.org/Product — habilita rich results (precio, disponibilidad) en Google.
export function productoJsonLd(producto: Producto, nombre: string, descripcion: string, url: string) {
  const stockTotal = producto.variantes.reduce((acc, v) => acc + v.stock, 0)
  const imagenes = [...new Set(producto.variantes.map((v) => v.imagen).filter((img): img is string => Boolean(img)))]

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: nombre,
    description: descripcion,
    image: imagenes.map((img) => `${SITE_URL}${img}`),
    sku: producto.slug,
    brand: { "@type": "Brand", name: "Nomora" },
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "PEN",
      price: producto.precioDesde,
      availability: stockTotal > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  }
}

// JSON-LD schema.org/BreadcrumbList — muestra la ruta (Inicio > Catálogo > Producto) en resultados de Google.
export function breadcrumbJsonLd(nombre: string, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Catálogo", item: `${SITE_URL}/catalogo` },
      { "@type": "ListItem", position: 3, name: nombre, item: url },
    ],
  }
}
