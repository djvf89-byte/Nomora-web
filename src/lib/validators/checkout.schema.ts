import { z } from "zod"

const itemCarritoSchema = z.object({
  productoSlug: z.string().min(1),
  varianteId: z.string().min(1),
  cantidad: z.number().int().min(1).max(10),
})

export const checkoutSchema = z.object({
  nombre: z.string().min(2, "Ingresa tu nombre completo").max(120),
  email: z.string().email("Email inválido"),
  telefono: z.string().min(6, "Ingresa un teléfono válido").max(20),
  direccion: z.string().min(5, "Ingresa tu dirección"),
  departamento: z.string().min(2, "Selecciona tu departamento"),
  provincia: z.string().min(2, "Selecciona tu provincia"),
  distrito: z.string().min(2, "Selecciona tu distrito"),
  referencia: z.string().max(200).optional(),
  metodoPago: z.enum(["YAPE", "TRANSFERENCIA_BANCARIA", "TARJETA"]),
  items: z.preprocess((val) => {
    if (typeof val !== "string") return val
    try {
      return JSON.parse(val)
    } catch {
      return val
    }
  }, z.array(itemCarritoSchema).min(1, "Tu carrito está vacío")),
  cuponCodigo: z.string().trim().max(30).optional(),
})

export type CheckoutInput = z.infer<typeof checkoutSchema>
