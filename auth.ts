import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import type { RolUsuario } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { authConfig } from "./auth.config"

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  ...authConfig,
  callbacks: {
    jwt: authConfig.callbacks!.jwt!,
    // Siempre lee el rol fresco desde BD para que cambios del admin
    // se reflejen en el próximo request sin logout.
    // El tipo base de `JWT` no hereda la augmentación de next-auth.d.ts en este callback.
    async session({ session, token }) {
      const id = token.id as string
      session.user.id = id
      if (id) {
        const usuario = await prisma.usuario.findUnique({
          where: { id },
          select: { rol: true },
        })
        session.user.rol = usuario ? usuario.rol : (token.rol as RolUsuario)
      }
      return session
    },
  },
})
