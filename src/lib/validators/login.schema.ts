import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "La contraseña es requerida"),
})

export type LoginInput = z.infer<typeof loginSchema>

export const solicitarRecuperacionSchema = z.object({
  email: z.string().email("Ingresa un email válido"),
})

export const restablecerPasswordSchema = z
  .object({
    passwordNueva: z.string().min(8, "La nueva contraseña debe tener al menos 8 caracteres"),
    passwordConfirmar: z.string().min(1, "Confirma la nueva contraseña"),
  })
  .refine((datos) => datos.passwordNueva === datos.passwordConfirmar, {
    message: "Las contraseñas no coinciden",
    path: ["passwordConfirmar"],
  })
