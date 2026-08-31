import type { Metadata } from "next"
import { SITE_URL } from "@/lib/site"

const TITULO = "Términos y condiciones"
const DESCRIPCION = "Condiciones de compra, envío y pago de Nomora."

export const metadata: Metadata = {
  title: TITULO,
  description: DESCRIPCION,
  alternates: { canonical: `${SITE_URL}/terminos` },
}

function Seccion({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="mt-8 first:mt-0">
      <h2 className="text-base font-semibold text-foreground">{titulo}</h2>
      <div className="mt-2.5 space-y-3 text-[15px] leading-relaxed text-muted-foreground">{children}</div>
    </section>
  )
}

export default function TerminosPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16 sm:py-20">
      <h1 className="text-2xl font-black tracking-[-0.02em] text-foreground sm:text-3xl">{TITULO}</h1>
      <p className="mt-3 text-sm text-muted-foreground">Última actualización: agosto de 2026.</p>

      <Seccion titulo="1. Quiénes somos">
        <p>
          Nomora es un emprendimiento operado por una persona natural con negocio, con base en Lima, Perú.
          Vendemos productos físicos para la aventura — tomatodos, ponchos, toallas y medias de neopreno —
          a través del sitio web <b>somosnomora.com</b>.
        </p>
        <p>
          Para cualquier consulta, reclamo o solicitud relacionada con estos términos, puedes escribirnos a{" "}
          <a href="mailto:pedidos@mail.somosnomora.com" className="text-foreground underline">
            pedidos@mail.somosnomora.com
          </a>
          .
        </p>
      </Seccion>

      <Seccion titulo="2. Cómo funciona la compra">
        <p>
          No es necesario crear una cuenta para comprar. En el checkout te pedimos nombre, email, teléfono y
          dirección de envío únicamente para procesar y entregar tu pedido.
        </p>
        <p>
          Los precios se muestran en soles (S/) e incluyen los impuestos aplicables. Pueden cambiar sin previo
          aviso; el precio válido es el que se muestra al momento de confirmar tu pedido.
        </p>
      </Seccion>

      <Seccion titulo="3. Métodos de pago">
        <p>
          Aceptamos Yape, transferencia bancaria y tarjeta, todos procesados a través de MercadoPago. Tu pedido
          se confirma automáticamente en cuanto MercadoPago valida el pago — no compartimos ni almacenamos los
          datos de tu tarjeta en ningún momento, esos datos los maneja MercadoPago directamente.
        </p>
      </Seccion>

      <Seccion titulo="4. Envíos">
        <p>
          Envío gratis en Lima y Callao en compras desde S/100; por debajo de ese monto se cobra una tarifa
          fija. Para envíos fuera de Lima y Callao, el costo se calcula según destino.
        </p>
        <p>
          Los plazos de entrega son referenciales y pueden variar según la zona y el courier. Te avisaremos si
          hay algún retraso relevante.
        </p>
      </Seccion>

      <Seccion titulo="5. Cambios y productos defectuosos">
        <p>
          Si tu pedido llega dañado, incompleto o distinto al que compraste, escríbenos a{" "}
          <a href="mailto:pedidos@mail.somosnomora.com" className="text-foreground underline">
            pedidos@mail.somosnomora.com
          </a>{" "}
          con fotos del producto para coordinar el cambio o la solución que corresponda.
        </p>
      </Seccion>

      <Seccion titulo="6. Propiedad intelectual">
        <p>
          El nombre Nomora, su logo, diseños y el contenido de este sitio son de nuestra propiedad o de
          nuestros proveedores. No está permitido reproducirlos sin autorización.
        </p>
      </Seccion>

      <Seccion titulo="7. Cambios a estos términos">
        <p>
          Podemos actualizar estos términos en cualquier momento; la versión vigente es siempre la publicada en
          esta página, con la fecha de última actualización indicada arriba.
        </p>
      </Seccion>

      <Seccion titulo="8. Ley aplicable">
        <p>Estos términos se rigen por las leyes de la República del Perú.</p>
      </Seccion>
    </main>
  )
}
