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

  // El Brick dibuja su propio título "Medios de pago" (un <h1> normal, no un iframe) — lo
  // ocultamos para que la fila de Yape (justo arriba, fuera del Brick) se lea como parte de
  // la misma lista en vez de una sección aparte con su propio encabezado. El observer sigue
  // reaccionando mientras el Brick re-renderiza (cambia de método, muestra el formulario de
  // tarjeta, etc.) — si MercadoPago cambia ese texto, esto simplemente deja de aplicar y el
  // título vuelve a aparecer, no rompe nada.
  useEffect(() => {
    if (fase !== "formulario") return
    const contenedor = document.getElementById("paymentBrick_container")
    if (!contenedor) return

    function ocultarTitulo() {
      const walker = document.createTreeWalker(contenedor!, NodeFilter.SHOW_ELEMENT)
      let nodo: Node | null
      while ((nodo = walker.nextNode())) {
        const el = nodo as HTMLElement
        const texto = el.textContent?.trim()
        const esTitulo = texto === "Medios de pago" || texto === "Payment methods"
        if (el.children.length === 0 && esTitulo && el.style.display !== "none") {
          el.style.display = "none"
        }
      }
    }

    ocultarTitulo()
    const observer = new MutationObserver(ocultarTitulo)
    observer.observe(contenedor, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [fase])

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
          // Esquinas planas para que combine con la fila de Yape justo arriba y con el
          // resto del sitio (que no usa bordes redondeados).
          visual: {
            style: {
              customVariables: {
                borderRadiusSmall: "2px",
                borderRadiusMedium: "2px",
                borderRadiusLarge: "2px",
                borderRadiusFull: "2px",
              },
            },
          },
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
