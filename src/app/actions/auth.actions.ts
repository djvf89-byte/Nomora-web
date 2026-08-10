"use server"

import { redirect } from "next/navigation"
import { signIn, signOut } from "@/lib/auth"
import { AuthError } from "next-auth"
import { solicitarRecuperacionSchema, restablecerPasswordSchema } from "@/lib/validators/login.schema"
import {
  crearTokenRecuperacion,
  validarTokenRecuperacion,
  consumirTokenYActualizarPassword,
} from "@/services/usuario.service"

// Login exclusivo para ADMIN — no hay registro público. Las cuentas de
// administrador se crean directamente en base de datos (ver prisma/seed).
export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const callbackUrl = (formData.get("callbackUrl") as string) || "/admin"

  try {
    await signIn("credentials", { email, password, redirectTo: callbackUrl })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Email o contraseña incorrectos." }
        default:
          return { error: "Ocurrió un error al iniciar sesión. Intenta de nuevo." }
      }
    }
    throw error
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/auth/login" })
}

// Sin Resend configurado todavía: no revelamos si el email existe (siempre
// devolvemos "enviado"), y en desarrollo exponemos el link en pantalla para
// poder probar el flujo. En producción, sin envío de correo real, nadie puede
// completar el reset — solo queda `npm run seed:admin` como recuperación.
export async function solicitarRecuperacionAction(formData: FormData) {
  const parsed = solicitarRecuperacionSchema.safeParse({ email: formData.get("email") })
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Email inválido.", devLink: undefined, enviado: undefined }
  }

  const token = await crearTokenRecuperacion(parsed.data.email)

  const esDev = process.env.NODE_ENV !== "production"
  const devLink = esDev && token ? `/auth/restablecer-password/${token}` : undefined

  return { error: undefined, devLink, enviado: true }
}

export async function restablecerPasswordAction(formData: FormData) {
  const token = formData.get("token") as string
  const parsed = restablecerPasswordSchema.safeParse({
    passwordNueva: formData.get("passwordNueva"),
    passwordConfirmar: formData.get("passwordConfirmar"),
  })
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." }

  const registro = await validarTokenRecuperacion(token)
  if (!registro) return { error: "El link expiró o no es válido. Solicita uno nuevo." }

  await consumirTokenYActualizarPassword(token, registro.identifier, parsed.data.passwordNueva)

  redirect("/auth/login?passwordCambiada=1")
}
