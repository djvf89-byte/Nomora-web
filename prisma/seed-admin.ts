import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { cargarEnvLocal } from "./env"
import { hashPassword } from "../src/lib/password"

cargarEnvLocal()

// Crea (o actualiza la contraseña de) el usuario ADMIN. No hay registro público de
// administradores en V1 — ver docs/business-rules.md — así que esta es la única puerta.
// Lee las credenciales desde el entorno para que nunca queden escritas en el código:
//   ADMIN_EMAIL=tú@nomora.pe ADMIN_PASSWORD=algo-seguro npm run seed:admin
async function main() {
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD
  const nombre = process.env.ADMIN_NOMBRE || "Admin Nomora"

  if (!email || !password) {
    console.error(
      "Faltan ADMIN_EMAIL y/o ADMIN_PASSWORD.\n" +
        "Corre así: ADMIN_EMAIL=tu@email.com ADMIN_PASSWORD=tu-contraseña npm run seed:admin\n" +
        "(o agrégalas a .env.local antes de correr `npm run seed:admin`)"
    )
    process.exit(1)
  }
  if (password.length < 8) {
    console.error("ADMIN_PASSWORD debe tener al menos 8 caracteres.")
    process.exit(1)
  }

  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
  const prisma = new PrismaClient({ adapter })

  const passwordHash = await hashPassword(password)

  const admin = await prisma.usuario.upsert({
    where: { email },
    update: { passwordHash, rol: "ADMIN" },
    create: { email, nombre, passwordHash, rol: "ADMIN" },
  })

  console.log(`Usuario ADMIN listo: ${admin.email}`)
  await prisma.$disconnect()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
