import { RestablecerPasswordForm } from "@/components/auth/RestablecerPasswordForm"

export default async function RestablecerPasswordPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params

  return (
    <>
      <div className="mb-6 text-center">
        <h1 className="text-xl font-semibold">Restablecer contraseña</h1>
        <p className="mt-1 text-sm text-muted-foreground">Elige tu nueva contraseña.</p>
      </div>

      <RestablecerPasswordForm token={token} />
    </>
  )
}
