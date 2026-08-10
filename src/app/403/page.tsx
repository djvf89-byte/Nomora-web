import Link from "next/link"

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center text-foreground">
      <h1 className="text-2xl font-semibold">Acceso no autorizado</h1>
      <p className="text-muted-foreground">No tienes permisos para ver esta página.</p>
      <Link href="/" className="text-sm font-medium text-accent hover:opacity-80">
        Volver al inicio
      </Link>
    </div>
  )
}
