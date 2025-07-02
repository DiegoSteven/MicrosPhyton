import { NextResponse } from "next/server"

// Simulación de inventario
const inventario = [
  { id: 1, nombre: "Aceite de Cocina Premium", stock: 25, precio: 4500 },
  { id: 2, nombre: "Arroz Blanco 1kg", stock: 50, precio: 2800 },
  { id: 3, nombre: "Leche Entera 1L", stock: 30, precio: 1200 },
  { id: 4, nombre: "Pan de Molde", stock: 15, precio: 1800 },
  { id: 5, nombre: "Detergente Líquido", stock: 20, precio: 3200 },
  { id: 6, nombre: "Café Molido 500g", stock: 12, precio: 5500 },
]

export async function GET() {
  return NextResponse.json(inventario)
}

export async function PUT(request) {
  try {
    const { productoId, cantidad } = await request.json()

    // Simular actualización de stock
    const producto = inventario.find((p) => p.id === productoId)
    if (producto) {
      producto.stock -= cantidad
      console.log(`Stock actualizado: Producto ${productoId}, nuevo stock: ${producto.stock}`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar inventario" }, { status: 500 })
  }
}
