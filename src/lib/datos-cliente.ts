"use client"

const STORAGE_KEY = "nomora-datos-cliente"

export interface DatosClienteGuardados {
  nombre?: string
  email?: string
  telefono?: string
  direccion?: string
  departamento?: string
  provincia?: string
  distrito?: string
  referencia?: string
}

// Recuerda los datos de contacto/envío del checkout entre visitas — no el método de pago
// ni la aceptación de términos, que deben confirmarse de nuevo cada vez.
export function leerDatosCliente(): DatosClienteGuardados {
  if (typeof window === "undefined") return {}
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as DatosClienteGuardados) : {}
  } catch {
    return {}
  }
}

export function guardarDatosCliente(datos: DatosClienteGuardados) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(datos))
  } catch {
    // localStorage no disponible (modo privado, cuota llena, etc.) — simplemente no se recuerda.
  }
}
