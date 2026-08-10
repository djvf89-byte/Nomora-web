import { z } from "zod"

export const cambiarEstadoPedidoSchema = z.object({
  pedidoId: z.string().min(1),
  nuevoEstado: z.enum(["PAGADO", "ENVIADO", "ENTREGADO", "CANCELADO"]),
})

export const actualizarStockSchema = z.object({
  varianteId: z.string().min(1),
  stock: z.coerce.number().int().min(0),
})

export const crearCuponSchema = z.object({
  codigo: z
    .string()
    .trim()
    .min(3, "El código debe tener al menos 3 caracteres")
    .max(30)
    .regex(/^[A-Za-z0-9_-]+$/, "Solo letras, números, guiones y guion bajo"),
  porcentaje: z.coerce.number().int().min(1, "Mínimo 1%").max(100, "Máximo 100%"),
  fechaInicio: z
    .string()
    .optional()
    .transform((v) => (v ? new Date(v) : undefined)),
  fechaFin: z
    .string()
    .optional()
    .transform((v) => (v ? new Date(v) : undefined)),
  usosMaximos: z
    .string()
    .optional()
    .transform((v) => (v ? Number(v) : undefined)),
})

export const cambiarPasswordSchema = z
  .object({
    passwordActual: z.string().min(1, "Ingresa tu contraseña actual"),
    passwordNueva: z.string().min(8, "La nueva contraseña debe tener al menos 8 caracteres"),
    passwordConfirmar: z.string().min(1, "Confirma la nueva contraseña"),
  })
  .refine((datos) => datos.passwordNueva === datos.passwordConfirmar, {
    message: "Las contraseñas no coinciden",
    path: ["passwordConfirmar"],
  })

export const crearOfertaSchema = z.object({
  nombre: z.string().trim().min(2, "Ingresa un nombre para la oferta").max(80),
  porcentaje: z.coerce.number().int().min(1, "Mínimo 1%").max(100, "Máximo 100%"),
  fechaInicio: z.string().min(1, "Elige una fecha de inicio").transform((v) => new Date(v)),
  fechaFin: z.string().min(1, "Elige una fecha de fin").transform((v) => new Date(v)),
  productoIds: z.array(z.string()).min(1, "Elige al menos un producto"),
})
