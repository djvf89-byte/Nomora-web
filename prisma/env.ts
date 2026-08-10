import { readFileSync } from "fs"
import { resolve } from "path"

// Los scripts de prisma/ (seed, seed-admin) corren fuera de Next.js, así que no
// cargan .env.local automáticamente. Este helper lo hace a mano, sin pisar
// variables que ya vengan del entorno real (CI, shell, etc.).
export function cargarEnvLocal() {
  try {
    const envFile = readFileSync(resolve(process.cwd(), ".env.local"), "utf-8")
    for (const line of envFile.split("\n")) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith("#")) continue
      const eqIndex = trimmed.indexOf("=")
      if (eqIndex === -1) continue
      const key = trimmed.slice(0, eqIndex).trim()
      const raw = trimmed.slice(eqIndex + 1).trim()
      const value = raw.replace(/^["']|["']$/g, "")
      if (!process.env[key]) process.env[key] = value
    }
  } catch {
    // .env.local no encontrado — se usan las variables de entorno del sistema
  }
}
