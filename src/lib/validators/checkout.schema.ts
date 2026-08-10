import { z } from "zod"

export const checkoutSchema = z.object({
  nombre: z.string().min(2, "Ingresa tu nombre completo").max(120),
  email: z.string().email("Email inválido"),
  telefono: z.string().min(6, "Ingresa un teléfono válido").max(20),
  direccion: z.string().min(5, "Ingresa tu dirección"),
  distrito: z.string().min(2, "Ingresa tu distrito"),
  ciudad: z.string().min(2, "Ingresa tu ciudad"),
  referencia: z.string().max(200).optional(),
  metodoPago: z.enum(["YAPE", "PLIN", "TRANSFERENCIA_BANCARIA", "TARJETA"]),
  productoSlug: z.string(),
  varianteId: z.string(),
  cantidad: z.coerce.number().int().min(1).max(10),
  cuponCodigo: z.string().trim().max(30).optional(),
})

export type CheckoutInput = z.infer<typeof checkoutSchema>
