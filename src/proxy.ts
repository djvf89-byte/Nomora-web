import { auth } from "@/lib/auth"
import { NextResponse, type NextRequest } from "next/server"
import type { Session } from "next-auth"

// No hay cuentas de cliente en V1 (checkout de invitado) — todo el sitio es
// público salvo /admin, que requiere sesión con rol ADMIN.
const RUTAS_AUTH = ["/auth/login"]

type AuthRequest = NextRequest & { auth: Session | null }

export default auth((req: AuthRequest) => {
  const { nextUrl } = req
  const session = req.auth
  const pathname = nextUrl.pathname

  const esAuth = RUTAS_AUTH.some((r) => pathname.startsWith(r))

  if (esAuth) {
    if (session?.user.rol === "ADMIN") return NextResponse.redirect(new URL("/admin", nextUrl))
    return NextResponse.next()
  }

  if (pathname.startsWith("/admin")) {
    if (!session) {
      const loginUrl = new URL("/auth/login", nextUrl)
      loginUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(loginUrl)
    }
    if (session.user.rol !== "ADMIN") {
      return NextResponse.redirect(new URL("/403", nextUrl))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
