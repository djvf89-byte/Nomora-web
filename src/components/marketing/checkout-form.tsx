"use client"

import { useActionState, useState } from "react"
import { checkoutAction } from "@/app/actions/checkout.actions"
import { useLocale } from "@/lib/i18n/locale-context"
import { DEPARTAMENTOS, provinciasDeDepartamento, distritosDeProvincia } from "@/constants/ubigeo"
import type { LineaCarrito } from "@/lib/carrito"

const initialState = { error: undefined as string | undefined }

const METODOS_PAGO = ["YAPE", "PLIN", "TRANSFERENCIA_BANCARIA", "TARJETA"] as const

const inputClass =
  "w-full rounded-[2px] border border-input bg-card px-3.5 py-2.5 text-sm outline-none transition focus:border-ring"

export function CheckoutForm({
  lineas,
  cuponCodigo,
  onProvinciaChange,
}: {
  lineas: LineaCarrito[]
  cuponCodigo?: string
  onProvinciaChange?: (provincia: string) => void
}) {
  const { t } = useLocale()
  const itemsJson = JSON.stringify(
    lineas.map((l) => ({ productoSlug: l.productoSlug, varianteId: l.varianteId, cantidad: l.cantidad }))
  )
  const [departamento, setDepartamento] = useState("")
  const [provincia, setProvincia] = useState("")
  const [distrito, setDistrito] = useState("")

  const departamentoId = DEPARTAMENTOS.find(([, nombre]) => nombre === departamento)?.[0]
  const provinciasDisponibles = departamentoId ? provinciasDeDepartamento(departamentoId) : []
  const provinciaId = provinciasDisponibles.find(([, nombre]) => nombre === provincia)?.[0]
  const distritosDisponibles = provinciaId ? distritosDeProvincia(provinciaId) : []

  const [state, action, isPending] = useActionState(
    async (_prev: typeof initialState, formData: FormData) => {
      return (await checkoutAction(formData)) ?? initialState
    },
    initialState
  )

  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="items" value={itemsJson} />
      {cuponCodigo && <input type="hidden" name="cuponCodigo" value={cuponCodigo} />}

      {state?.error && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3">
          <p className="text-sm text-destructive">{state.error}</p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5 sm:col-span-2">
          <label htmlFor="nombre" className="text-sm font-medium">
            {t.checkout.fullName}
          </label>
          <input id="nombre" name="nombre" required className={inputClass} />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium">
            {t.checkout.email}
          </label>
          <input id="email" name="email" type="email" required className={inputClass} />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="telefono" className="text-sm font-medium">
            {t.checkout.phone}
          </label>
          <input id="telefono" name="telefono" type="tel" required className={inputClass} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5 sm:col-span-2">
          <label htmlFor="direccion" className="text-sm font-medium">
            {t.checkout.address}
          </label>
          <input id="direccion" name="direccion" required className={inputClass} />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="departamento" className="text-sm font-medium">
            {t.checkout.departamento}
          </label>
          <select
            id="departamento"
            name="departamento"
            required
            value={departamento}
            onChange={(e) => {
              setDepartamento(e.target.value)
              setProvincia("")
              setDistrito("")
              onProvinciaChange?.("")
            }}
            className={inputClass}
          >
            <option value="" disabled>
              {t.checkout.selectPlaceholder}
            </option>
            {DEPARTAMENTOS.map(([id, nombre]) => (
              <option key={id} value={nombre}>
                {nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <label htmlFor="provincia" className="text-sm font-medium">
            {t.checkout.provincia}
          </label>
          <select
            id="provincia"
            name="provincia"
            required
            disabled={!departamento}
            value={provincia}
            onChange={(e) => {
              setProvincia(e.target.value)
              setDistrito("")
              onProvinciaChange?.(e.target.value)
            }}
            className={inputClass}
          >
            <option value="" disabled>
              {t.checkout.selectPlaceholder}
            </option>
            {provinciasDisponibles.map(([id, nombre]) => (
              <option key={id} value={nombre}>
                {nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <label htmlFor="distrito" className="text-sm font-medium">
            {t.checkout.district}
          </label>
          <select
            id="distrito"
            name="distrito"
            required
            disabled={!provincia}
            value={distrito}
            onChange={(e) => setDistrito(e.target.value)}
            className={inputClass}
          >
            <option value="" disabled>
              {t.checkout.selectPlaceholder}
            </option>
            {distritosDisponibles.map(([id, nombre]) => (
              <option key={id} value={nombre}>
                {nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <label htmlFor="referencia" className="text-sm font-medium">
            {t.checkout.reference} <span className="text-muted-foreground">{t.checkout.optional}</span>
          </label>
          <input id="referencia" name="referencia" className={inputClass} />
        </div>
      </div>

      <fieldset className="space-y-2">
        <legend className="mb-1 text-sm font-medium">{t.checkout.paymentMethod}</legend>
        {METODOS_PAGO.map((metodo, i) => (
          <label
            key={metodo}
            className="flex cursor-pointer items-center gap-2.5 rounded-[2px] border border-input px-3.5 py-2.5 text-sm has-[:checked]:border-foreground"
          >
            <input type="radio" name="metodoPago" value={metodo} defaultChecked={i === 0} required />
            {t.checkout.methods[metodo]}
          </label>
        ))}
      </fieldset>

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 w-full rounded-[2px] bg-foreground px-6 py-3.5 text-sm font-semibold tracking-[0.08em] text-background uppercase transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {isPending ? t.checkout.submitting : t.checkout.submit}
      </button>
    </form>
  )
}
