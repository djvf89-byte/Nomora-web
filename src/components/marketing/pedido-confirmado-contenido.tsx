"use client"

import Link from "next/link"
import { useLocale } from "@/lib/i18n/locale-context"

export function PedidoConfirmadoContenido({ email, id }: { email: string; id: string }) {
  const { t } = useLocale()

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-6 py-16 text-center">
      <h1 className="text-2xl font-black tracking-[-0.02em] text-foreground sm:text-3xl">{t.confirm.title}</h1>
      <p className="mt-3 text-muted-foreground">
        {t.confirm.subtitlePrefix} <b className="text-foreground">{email}</b> {t.confirm.subtitleSuffix}
      </p>
      <p className="mt-6 font-mono text-xs tracking-[0.06em] text-muted-foreground uppercase">
        {t.confirm.orderNumber} #{id.slice(-8)}
      </p>
      <Link
        href="/catalogo"
        className="mt-8 inline-flex items-center rounded-[2px] bg-foreground px-6 py-3 text-xs font-semibold tracking-[0.14em] text-background uppercase"
      >
        {t.confirm.continueShopping}
      </Link>
    </main>
  )
}
