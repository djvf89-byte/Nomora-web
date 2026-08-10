import { defineConfig } from "prisma/config"
import { cargarEnvLocal } from "./prisma/env"

cargarEnvLocal()

export default defineConfig({
  schema: "./prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL,
  },
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
})
