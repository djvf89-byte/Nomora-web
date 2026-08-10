import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

function crearPrismaClient(): PrismaClient {
  // Las migraciones usan datasource.url definido en prisma.config.ts;
  // el cliente en runtime necesita su propio adapter con connectionString.
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? crearPrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
