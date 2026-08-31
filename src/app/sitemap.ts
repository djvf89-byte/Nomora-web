import type { MetadataRoute } from "next"
import { CATALOGO } from "@/constants/catalogo"
import { SITE_URL } from "@/lib/site"

export default function sitemap(): MetadataRoute.Sitemap {
  const rutasEstaticas: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/catalogo`, changeFrequency: "weekly", priority: 0.9 },
  ]

  const rutasProductos: MetadataRoute.Sitemap = CATALOGO.map((producto) => ({
    url: `${SITE_URL}/catalogo/${producto.slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }))

  return [...rutasEstaticas, ...rutasProductos]
}
