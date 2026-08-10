import { prisma } from "@/lib/prisma"
import { hashPassword, verifyPassword } from "@/lib/password"
import { randomBytes } from "crypto"

export async function buscarUsuarioPorEmail(email: string) {
  return prisma.usuario.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      nombre: true,
      passwordHash: true,
      rol: true,
    },
  })
}

export async function crearUsuario(datos: {
  nombre: string
  email: string
  password: string
}) {
  const passwordHash = await hashPassword(datos.password)

  return prisma.usuario.create({
    data: {
      nombre: datos.nombre,
      email: datos.email,
      passwordHash,
    },
    select: {
      id: true,
      email: true,
      nombre: true,
      rol: true,
    },
  })
}

export async function buscarUsuarioPorId(id: string) {
  return prisma.usuario.findUnique({
    where: { id },
    select: {
      id: true,
      nombre: true,
      email: true,
      telefono: true,
      rol: true,
      creadoEn: true,
    },
  })
}

// ─── Recuperación de contraseña ──────────────────────────────────────────────

const RESET_PREFIX = "reset:"
const RESET_EXPIRY_MS = 60 * 60 * 1000 // 1 hora

export async function crearTokenRecuperacion(email: string): Promise<string | null> {
  const usuario = await buscarUsuarioPorEmail(email)
  // No revelar si el email existe. En V1 solo ADMIN tiene contraseña — el resto
  // (o un email inexistente) recibe la misma respuesta genérica sin emitir token.
  if (!usuario || usuario.rol !== "ADMIN") return null

  const identifier = `${RESET_PREFIX}${email}`
  const token = randomBytes(32).toString("hex")
  const expires = new Date(Date.now() + RESET_EXPIRY_MS)

  // Eliminar tokens anteriores del mismo email
  await prisma.verificationToken.deleteMany({ where: { identifier } })

  await prisma.verificationToken.create({ data: { identifier, token, expires } })

  return token
}

export async function validarTokenRecuperacion(token: string) {
  const registro = await prisma.verificationToken.findFirst({
    where: { token, identifier: { startsWith: RESET_PREFIX } },
  })
  if (!registro) return null
  if (registro.expires < new Date()) {
    await prisma.verificationToken.delete({
      where: { identifier_token: { identifier: registro.identifier, token } },
    })
    return null
  }
  const email = registro.identifier.replace(RESET_PREFIX, "")
  return { email, identifier: registro.identifier }
}

export async function consumirTokenYActualizarPassword(
  token: string,
  identifier: string,
  nuevaPassword: string
): Promise<boolean> {
  const email = identifier.replace(RESET_PREFIX, "")
  const usuario = await buscarUsuarioPorEmail(email)
  if (!usuario) return false

  const passwordHash = await hashPassword(nuevaPassword)

  await prisma.$transaction([
    prisma.usuario.update({ where: { id: usuario.id }, data: { passwordHash } }),
    prisma.verificationToken.delete({ where: { identifier_token: { identifier, token } } }),
  ])

  return true
}

// ─── Admin: cambio de contraseña propia ──────────────────────────────────────

export async function cambiarPasswordPropia(
  usuarioId: string,
  passwordActual: string,
  passwordNueva: string
) {
  const usuario = await prisma.usuario.findUnique({
    where: { id: usuarioId },
    select: { passwordHash: true },
  })
  if (!usuario?.passwordHash) throw new Error("Usuario inválido.")

  const esValida = await verifyPassword(passwordActual, usuario.passwordHash)
  if (!esValida) throw new Error("La contraseña actual no es correcta.")

  const passwordHash = await hashPassword(passwordNueva)
  await prisma.usuario.update({ where: { id: usuarioId }, data: { passwordHash } })
}

// ─── Admin: gestión de usuarios ──────────────────────────────────────────────

export async function listarUsuariosAdmin(buscar?: string) {
  return prisma.usuario.findMany({
    where: buscar
      ? {
          OR: [
            { nombre: { contains: buscar, mode: "insensitive" } },
            { email: { contains: buscar, mode: "insensitive" } },
          ],
        }
      : {},
    select: {
      id: true,
      nombre: true,
      email: true,
      rol: true,
      creadoEn: true,
    },
    orderBy: { creadoEn: "desc" },
    take: 100,
  })
}
