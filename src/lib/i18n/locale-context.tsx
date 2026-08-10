"use client"

import { createContext, useCallback, useContext, useEffect, useSyncExternalStore } from "react"
import { translations, type Locale, type Translations } from "./translations"

const STORAGE_KEY = "nomora-locale"
const EVENT_NAME = "nomora-locale-change"

function subscribe(callback: () => void) {
  window.addEventListener(EVENT_NAME, callback)
  return () => window.removeEventListener(EVENT_NAME, callback)
}

function getSnapshot(): Locale {
  return window.localStorage.getItem(STORAGE_KEY) === "en" ? "en" : "es"
}

function getServerSnapshot(): Locale {
  return "es"
}

interface LocaleContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: Translations
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const locale = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const setLocale = useCallback((next: Locale) => {
    window.localStorage.setItem(STORAGE_KEY, next)
    window.dispatchEvent(new Event(EVENT_NAME))
  }, [])

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t: translations[locale] }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error("useLocale debe usarse dentro de LocaleProvider")
  return ctx
}
