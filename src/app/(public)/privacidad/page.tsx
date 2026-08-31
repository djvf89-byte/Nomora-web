import type { Metadata } from "next"
import { SITE_URL } from "@/lib/site"

const TITULO = "Política de privacidad"
const DESCRIPCION = "Cómo Nomora recopila, usa y protege tus datos personales."

export const metadata: Metadata = {
  title: TITULO,
  description: DESCRIPCION,
  alternates: { canonical: `${SITE_URL}/privacidad` },
}

function Seccion({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="mt-8 first:mt-0">
      <h2 className="text-base font-semibold text-foreground">{titulo}</h2>
      <div className="mt-2.5 space-y-3 text-[15px] leading-relaxed text-muted-foreground">{children}</div>
    </section>
  )
}

export default function PrivacidadPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16 sm:py-20">
      <h1 className="text-2xl font-black tracking-[-0.02em] text-foreground sm:text-3xl">{TITULO}</h1>
      <p className="mt-3 text-sm text-muted-foreground">Última actualización: agosto de 2026.</p>

      <Seccion titulo="1. Qué datos recopilamos">
        <p>
          Al hacer un pedido te pedimos: nombre completo, email, teléfono y dirección de envío (departamento,
          provincia, distrito y dirección exacta). No creamos ni requerimos una cuenta de usuario.
        </p>
      </Seccion>

      <Seccion titulo="2. Para qué usamos tus datos">
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Procesar y entregar tu pedido.</li>
          <li>Enviarte confirmaciones sobre tu compra (pedido recibido, pago confirmado).</li>
          <li>Contactarte si hay algún problema con tu pedido o envío.</li>
        </ul>
        <p>No usamos tus datos con fines publicitarios ni los vendemos a terceros.</p>
      </Seccion>

      <Seccion titulo="3. Con quién compartimos tus datos">
        <p>Solo compartimos los datos estrictamente necesarios con los proveedores que hacen posible la compra:</p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            <b>MercadoPago</b>, para procesar el pago (ellos manejan directamente los datos de tu tarjeta —
            nosotros nunca los vemos ni los almacenamos).
          </li>
          <li>
            <b>Resend</b>, para enviarte los correos de confirmación de tu pedido.
          </li>
        </ul>
      </Seccion>

      <Seccion titulo="4. Almacenamiento en tu navegador">
        <p>
          Usamos el almacenamiento local de tu navegador (localStorage) únicamente para recordar los productos
          en tu carrito mientras compras. No usamos cookies de rastreo ni de publicidad de terceros.
        </p>
      </Seccion>

      <Seccion titulo="5. Tus derechos">
        <p>
          De acuerdo con la Ley N° 29733 de Protección de Datos Personales del Perú, puedes solicitar acceder,
          rectificar, cancelar u oponerte al uso de tus datos personales escribiéndonos a{" "}
          <a href="mailto:pedidos@mail.somosnomora.com" className="text-foreground underline">
            pedidos@mail.somosnomora.com
          </a>
          .
        </p>
      </Seccion>

      <Seccion titulo="6. Cambios a esta política">
        <p>
          Podemos actualizar esta política en cualquier momento; la versión vigente es siempre la publicada en
          esta página, con la fecha de última actualización indicada arriba.
        </p>
      </Seccion>
    </main>
  )
}
