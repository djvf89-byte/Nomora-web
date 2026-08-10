import { CambiarPasswordForm } from "@/components/admin/cambiar-password-form"

export default function CuentaAdminPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Mi cuenta</h1>
        <p className="text-muted-foreground">Cambia tu contraseña de acceso al panel de administración.</p>
      </div>

      <CambiarPasswordForm />
    </div>
  )
}
