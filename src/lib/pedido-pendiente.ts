"use client"

import { useSyncExternalStore } from "react"

const STORAGE_KEY = "nomora-pedido-pendiente"
const EVENT_NAME = "nomora-pedido-pendiente-change"

export interface PedidoPendiente {
  productoSlug: string
  varianteId: string
  cantidad: number
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

export function marcarPedidoPendiente(pedido: PedidoPendiente) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(pedido))
  window.dispatchEvent(new Event(EVENT_NAME))
}

export function limpiarPedidoPendiente() {
  window.localStorage.removeItem(STORAGE_KEY)
  window.dispatchEvent(new Event(EVENT_NAME))
}

export function usePedidoPendiente(): PedidoPendiente | null {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  if (!raw) return null
  try {
    return JSON.parse(raw) as PedidoPendiente
  } catch {
    return null
  }
}
