import type { NextAuthConfig } from "next-auth"
import type { RolUsuario } from "@prisma/client"
import Credentials from "next-auth/providers/credentials"
import { loginSchema } from "@/lib/validators/login.schema"
import { buscarUsuarioPorEmail } from "@/services/usuario.service"
import { verifyPassword } from "@/lib/password"

export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) return null

        const { email, password } = parsed.data

        const usuario = await buscarUsuarioPorEmail(email)
        if (!usuario || !usuario.passwordHash) return null

        const passwordValido = await verifyPassword(password, usuario.passwordHash)
        if (!passwordValido) return null

        return {
          id: usuario.id,
          email: usuario.email,
          name: usuario.nombre,
          rol: usuario.rol,
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.rol = user.rol
      }
      return token
    },
    session({ session, token }) {
      // El tipo base de `JWT` no hereda la augmentación de next-auth.d.ts en este callback;
      // los valores sí vienen tipados correctamente porque se asignan en el callback `jwt` de arriba.
      if (token) {
        session.user.id = token.id as string
        session.user.rol = token.rol as RolUsuario
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  session: { strategy: "jwt" },
}
