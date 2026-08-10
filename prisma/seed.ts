import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { CATALOGO } from "../src/constants/catalogo"
import { cargarEnvLocal } from "./env"

cargarEnvLocal()

// Puebla Producto/Variante a partir del catálogo estático (src/constants/catalogo.ts)
// para que los `varianteId` usados en el checkout de invitado existan realmente en BD.
const CATEGORIA_POR_SLUG: Record<string, "TOMATODO" | "PONCHO" | "TOALLA" | "MEDIAS"> = {
  tomatodo: "TOMATODO",
  "poncho-playero": "PONCHO",
  "toalla-playa": "TOALLA",
  "medias-neopreno": "MEDIAS",
}

async function main() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
  const prisma = new PrismaClient({ adapter })

  for (const item of CATALOGO) {
    const producto = await prisma.producto.upsert({
      where: { id: item.slug },
      update: {
        nombre: item.nombre,
        descripcion: item.descripcion,
        precioCentimos: item.precioDesde * 100,
        categoria: CATEGORIA_POR_SLUG[item.slug],
        incluyeStickers: item.slug === "tomatodo",
      },
      create: {
        id: item.slug,
        nombre: item.nombre,
        descripcion: item.descripcion,
        precioCentimos: item.precioDesde * 100,
        categoria: CATEGORIA_POR_SLUG[item.slug],
        imagenes: [],
        incluyeStickers: item.slug === "tomatodo",
      },
    })

    for (const variante of item.variantes) {
      await prisma.variante.upsert({
        where: { id: variante.id },
        update: {
          talla: variante.talla ?? null,
          color: variante.color ?? null,
          stock: variante.stock,
        },
        create: {
          id: variante.id,
          productoId: producto.id,
          talla: variante.talla ?? null,
          color: variante.color ?? null,
          sku: variante.id.toUpperCase(),
          stock: variante.stock,
        },
      })
    }
  }

  console.log(`Seed completo: ${CATALOGO.length} productos.`)
  await prisma.$disconnect()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
