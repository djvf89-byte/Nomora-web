import { notFound } from "next/navigation"
import { buscarPedidoPorId } from "@/services/pedido.service"
import { PedidoConfirmadoContenido } from "@/components/marketing/pedido-confirmado-contenido"

export default async function PedidoConfirmadoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const pedido = await buscarPedidoPorId(id)
  if (!pedido) notFound()

  return <PedidoConfirmadoContenido email={pedido.emailCliente} id={pedido.id} />
}
