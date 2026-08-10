import Link from "next/link"
import { logoutAction } from "@/app/actions/auth.actions"

const NAV = [
  { href: "/admin", label: "Resumen" },
  { href: "/admin/pedidos", label: "Pedidos" },
  { href: "/admin/pagos", label: "Pagos" },
  { href: "/admin/catalogo", label: "Catálogo" },
  { href: "/admin/cupones", label: "Cupones" },
  { href: "/admin/ofertas", label: "Ofertas" },
  { href: "/admin/metricas", label: "Métricas" },
  { href: "/admin/cuenta", label: "Mi cuenta" },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <span className="text-sm font-semibold tracking-[0.2em] uppercase">Nomora Admin</span>
        <form action={logoutAction}>
          <button type="submit" className="text-sm text-muted-foreground hover:text-accent">
            Cerrar sesión
          </button>
        </form>
      </header>

      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-8 sm:flex-row sm:gap-10">
        <nav className="-mx-1 overflow-x-auto sm:mx-0 sm:w-40 sm:shrink-0">
          <ul className="flex gap-1 sm:flex-col">
            {NAV.map((item) => (
              <li key={item.href} className="shrink-0">
                <Link
                  href={item.href}
                  className="block rounded-[2px] px-3 py-2 text-sm whitespace-nowrap text-foreground hover:bg-muted"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  )
}
