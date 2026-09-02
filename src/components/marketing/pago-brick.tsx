"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { initMercadoPago, Payment, StatusScreen } from "@mercadopago/sdk-react"
import { useLocale } from "@/lib/i18n/locale-context"
import { procesarPagoBrickAction, obtenerEstadoPedidoAction } from "@/app/actions/checkout.actions"

// initMercadoPago solo necesita llamarse una vez por sesión de navegador — llamarlo de
// nuevo con la misma clave no hace nada, pero evitamos el efecto repetido igual.
let mpInicializado = false

interface FormDataBrick {
  token?: string
  issuer_id?: string | number
  payment_method_id: string
  installments?: number
  payer: { email: string; identification?: { type: string; number: string } }
}

export function PagoBrick({
  pedidoId,
  totalCentimos,
  email,
}: {
  pedidoId: string
  totalCentimos: number
  email: string
}) {
  const { t, locale } = useLocale()
  const router = useRouter()
  const [fase, setFase] = useState<"formulario" | "estado">("formulario")
  const [paymentId, setPaymentId] = useState<string>()
  const [mensajeError, setMensajeError] = useState<string>()

  useEffect(() => {
    const publicKey = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY
    if (!publicKey || mpInicializado) return
    initMercadoPago(publicKey, { locale: locale === "en" ? "en-US" : "es-PE" })
    mpInicializado = true
  }, [locale])

  // El pago quedó "pendiente" (Pago Efectivo) — el StatusScreen muestra el ticket, pero la
  // confirmación real la decide el webhook de MercadoPago cuando el cliente paga en el agente.
  useEffect(() => {
    if (fase !== "estado") return
    const intervalo = setInterval(async () => {
      const estado = await obtenerEstadoPedidoAction(pedidoId)
      if (estado === "PAGADO") {
        clearInterval(intervalo)
        router.push(`/pedido-confirmado/${pedidoId}`)
      }
    }, 4000)
    return () => clearInterval(intervalo)
  }, [fase, pedidoId, router])

  if (fase === "estado" && paymentId) {
    return (
      <div className="min-h-[320px]">
        <StatusScreen initialization={{ paymentId }} />
      </div>
    )
  }

  return (
    <div>
      {mensajeError && <p className="mb-3 text-sm text-destructive">{mensajeError}</p>}
      <Payment
        initialization={{ amount: totalCentimos / 100, payer: { email } }}
        customization={{
          paymentMethods: { creditCard: "all", debitCard: "all", atm: ["pagoefectivo_atm"] },
        }}
        onSubmit={async ({ formData }) => {
          setMensajeError(undefined)
          const datos = formData as unknown as FormDataBrick
          const resultado = await procesarPagoBrickAction(pedidoId, {
            token: datos.token,
            issuer_id: datos.issuer_id,
            payment_method_id: datos.payment_method_id,
            installments: datos.installments,
            payer: datos.payer,
          })

          if (resultado.error) {
            setMensajeError(resultado.error)
            throw new Error(resultado.error)
          }
          if (resultado.status === "approved") {
            router.push(`/pedido-confirmado/${pedidoId}`)
            return
          }
          if (resultado.paymentId) {
            setPaymentId(resultado.paymentId)
            setFase("estado")
            return
          }
          const mensaje = t.checkout.paymentRejected
          setMensajeError(mensaje)
          throw new Error(mensaje)
        }}
        onError={(error) => console.error("Payment Brick error:", error)}
      />
    </div>
  )
}
