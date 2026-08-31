"use client"

import { useSyncExternalStore } from "react"
import { buscarVariante, type Producto, type Variante } from "@/constants/catalogo"

const STORAGE_KEY = "nomora-carrito"
const EVENT_NAME = "nomora-carrito-change"
const MAX_POR_LINEA = 10

export interface ItemCarrito {
  productoSlug: string
  varianteId: string
  cantidad: number
}

export interface LineaCarrito extends ItemCarrito {
  producto: Producto
  variante: Variante
}

function subscribe(callback: () => void) {
  window.addEventListener(EVENT_NAME, callback)
  window.addEventListener("storage", callback)
  return () => {
    window.removeEventListener(EVENT_NAME, callback)
    window.removeEventListener("storage", callback)
  }
}

function getSnapshot() {
  return window.localStorage.getItem(STORAGE_KEY)
}

function getServerSnapshot() {
  return null
}

function leerCarrito(): ItemCarrito[] {
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return []
  try {
    return JSON.parse(raw) as ItemCarrito[]
  } catch {
    return []
  }
}

function guardarCarrito(items: ItemCarrito[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  window.dispatchEvent(new Event(EVENT_NAME))
}

// Agrega una línea al carrito. Si el producto/variante ya estaba, suma la cantidad
// en vez de reemplazarla — esto es lo que antes fallaba (pedido-pendiente solo guardaba 1 ítem).
export function agregarAlCarrito(item: ItemCarrito) {
  const items = leerCarrito()
  const existente = items.find(
    (i) => i.productoSlug === item.productoSlug && i.varianteId === item.varianteId
  )
  if (existente) {
    existente.cantidad = Math.min(existente.cantidad + item.cantidad, MAX_POR_LINEA)
  } else {
    items.push(item)
  }
  guardarCarrito(items)
}

export function actualizarCantidadCarrito(productoSlug: string, varianteId: string, cantidad: number) {
  const items = leerCarrito()
  const idx = items.findIndex((i) => i.productoSlug === productoSlug && i.varianteId === varianteId)
  if (idx === -1) return
  if (cantidad <= 0) items.splice(idx, 1)
  else items[idx].cantidad = Math.min(cantidad, MAX_POR_LINEA)
  guardarCarrito(items)
}

export function quitarDelCarrito(productoSlug: string, varianteId: string) {
  guardarCarrito(
    leerCarrito().filter((i) => !(i.productoSlug === productoSlug && i.varianteId === varianteId))
  )
}

export function limpiarCarrito() {
  window.localStorage.removeItem(STORAGE_KEY)
  window.dispatchEvent(new Event(EVENT_NAME))
}

export function useCarrito(): ItemCarrito[] {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  if (!raw) return []
  try {
    return JSON.parse(raw) as ItemCarrito[]
  } catch {
    return []
  }
}

// Resuelve el carrito contra el catálogo: descarta líneas cuyo producto/variante ya no
// exista o esté agotado, y recorta la cantidad al stock disponible.
export function resolverLineasCarrito(items: ItemCarrito[]): LineaCarrito[] {
  const lineas: LineaCarrito[] = []
  for (const item of items) {
    const encontrado = buscarVariante(item.productoSlug, item.varianteId)
    if (!encontrado || encontrado.variante.stock <= 0) continue
    lineas.push({
      ...item,
      cantidad: Math.min(item.cantidad, encontrado.variante.stock, MAX_POR_LINEA),
      producto: encontrado.producto,
      variante: encontrado.variante,
    })
  }
  return lineas
}

export function useLineasCarrito(): LineaCarrito[] {
  return resolverLineasCarrito(useCarrito())
}
