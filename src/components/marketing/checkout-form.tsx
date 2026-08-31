"use client"

import { useActionState } from "react"
import { checkoutAction } from "@/app/actions/checkout.actions"
import { useLocale } from "@/lib/i18n/locale-context"

const initialState = { error: undefined as string | undefined }

const METODOS_PAGO = ["YAPE", "PLIN", "TRANSFERENCIA_BANCARIA", "TARJETA"] as const

const inputClass =
  "w-full rounded-[2px] border border-input bg-card px-3.5 py-2.5 text-sm outline-none transition focus:border-ring"

export function CheckoutForm({
  productoSlug,
  varianteId,
  cantidad,
  cuponCodigo,
  onCiudadChange,
}: {
  productoSlug: string
  varianteId: string
  cantidad: number
  cuponCodigo?: string
  onCiudadChange?: (ciudad: string) => void
}) {
  const { t } = useLocale()
  const [state, action, isPending] = useActionState(
    async (_prev: typeof initialState, formData: FormData) => {
      return (await checkoutAction(formData)) ?? initialState
    },
    initialState
  )

  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="productoSlug" value={productoSlug} />
      <input type="hidden" name="varianteId" value={varianteId} />
      <input type="hidden" name="cantidad" value={cantidad} />
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
          <label htmlFor="distrito" className="text-sm font-medium">
            {t.checkout.district}
          </label>
          <input id="distrito" name="distrito" required className={inputClass} />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="ciudad" className="text-sm font-medium">
            {t.checkout.city}
          </label>
          <input
            id="ciudad"
            name="ciudad"
            required
            defaultValue="Lima"
            onChange={(e) => onCiudadChange?.(e.target.value)}
            className={inputClass}
          />
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
