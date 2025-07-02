import { NextResponse } from "next/server"

// Simulación de base de datos en memoria
const pedidos = []

export async function POST(request) {
  try {
    const pedido = await request.json()

    // Simular procesamiento del pedido
    const nuevoPedido = {
      ...pedido,
      id: Date.now(),
      fecha: new Date().toISOString(),
      estado: "PENDIENTE",
      estadoDespacho: "PENDIENTE",
      estadoCobro: "PENDIENTE",
      estadoEnvio: "PENDIENTE",
    }

    pedidos.push(nuevoPedido)

    // Simular eventos a RabbitMQ
    console.log("Evento enviado: PEDIDO_CREADO", nuevoPedido.id)

    return NextResponse.json({
      success: true,
      pedido: nuevoPedido,
    })
  } catch (error) {
    return NextResponse.json({ error: "Error al procesar pedido" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json(pedidos)
}
