"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { loadMercadoPago } from "@mercadopago/sdk-js"
import { useLocale } from "@/lib/i18n/locale-context"
import { procesarPagoYapeAction } from "@/app/actions/checkout.actions"

// El SDK de MercadoPago.js no está tipado para .yape() (no es parte del Payment Brick,
// ver plan de migración) — se declara acá el pedacito mínimo que realmente usamos.
declare global {
  interface Window {
    MercadoPago?: new (publicKey: string) => {
      yape: (opciones: { otp: string; phoneNumber: string }) => { create: () => Promise<string> }
    }
  }
}

const inputClass =
  "w-full rounded-[2px] border border-input bg-card px-3.5 py-2.5 text-sm outline-none transition focus:border-ring"

export function PagoYape({ pedidoId, email }: { pedidoId: string; email: string }) {
  const { t } = useLocale()
  const router = useRouter()
  const [telefono, setTelefono] = useState("")
  const [otp, setOtp] = useState("")
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string>()

  async function enviarPago(e: FormEvent) {
    e.preventDefault()
    setError(undefined)
    setCargando(true)
    try {
      const publicKey = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY
      if (!publicKey) throw new Error(t.checkout.paymentRejected)

      await loadMercadoPago()
      if (!window.MercadoPago) throw new Error(t.checkout.paymentRejected)

      const mp = new window.MercadoPago(publicKey)
      const token = await mp.yape({ otp, phoneNumber: telefono }).create()

      const resultado = await procesarPagoYapeAction(pedidoId, token, email)
      if (resultado.error || resultado.status !== "approved") {
        setError(resultado.error ?? t.checkout.paymentRejected)
        return
      }
      router.push(`/pedido-confirmado/${pedidoId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : t.checkout.paymentRejected)
    } finally {
      setCargando(false)
    }
  }

  return (
    <form onSubmit={enviarPago} className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="yapeTelefono" className="text-sm font-medium">
          {t.checkout.yapePhone}
        </label>
        <input
          id="yapeTelefono"
          type="tel"
          inputMode="numeric"
          required
          maxLength={9}
          value={telefono}
          onChange={(e) => setTelefono(e.target.value.replace(/\D/g, "").slice(0, 9))}
          placeholder="9XXXXXXXX"
          className={inputClass}
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="yapeOtp" className="text-sm font-medium">
          {t.checkout.yapeOtp}
        </label>
        <input
          id="yapeOtp"
          type="text"
          inputMode="numeric"
          required
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
          placeholder="000000"
          className={`${inputClass} tracking-[0.3em]`}
        />
        <p className="text-xs text-muted-foreground">{t.checkout.yapeOtpHelp}</p>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <button
        type="submit"
        disabled={cargando || telefono.length !== 9 || otp.length !== 6}
        className="w-full rounded-[2px] bg-foreground px-6 py-3.5 text-sm font-semibold tracking-[0.08em] text-background uppercase transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {cargando ? t.checkout.submitting : t.checkout.yapePay}
      </button>
    </form>
  )
}
