import Link from "next/link"
import { SolicitarRecuperacionForm } from "@/components/auth/SolicitarRecuperacionForm"

export default function OlvidePasswordPage() {
  return (
    <>
      <div className="mb-6 text-center">
        <h1 className="text-xl font-semibold">Recuperar contraseña</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Ingresa tu email y te enviaremos un link para restablecerla.
        </p>
      </div>

      <SolicitarRecuperacionForm />

      <p className="mt-6 text-center text-sm text-muted-foreground">
        <Link href="/auth/login" className="text-foreground underline">
          Volver a iniciar sesión
        </Link>
      </p>
    </>
  )
}
