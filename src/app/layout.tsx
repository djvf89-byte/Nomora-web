import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { IsotipoDefs } from "@/components/brand/isotipo-defs"
import { LocaleProvider } from "@/lib/i18n/locale-context"
import "./globals.css"

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
})

const BASE_URL = process.env.AUTH_URL ?? "https://nomora.pe"

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "NOMORA — Empieza tu ruta",
    template: "%s | NOMORA",
  },
  description:
    "Productos para la aventura: tomatodo con álbum de stickers coleccionables, ponchos playeros, toallas y medias de neopreno.",
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    type: "website",
    locale: "es_PE",
    url: BASE_URL,
    siteName: "NOMORA",
    title: "NOMORA — Empieza tu ruta",
    description:
      "Productos para la aventura: tomatodo con álbum de stickers coleccionables, ponchos playeros, toallas y medias de neopreno.",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${inter.variable}`}>
      <body className="min-h-screen font-sans antialiased">
        <IsotipoDefs />
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  )
}
