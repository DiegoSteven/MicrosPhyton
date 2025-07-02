"use client"

import { useState } from "react"
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCarrito } from "@/contexts/carrito-context"
import { Breadcrumb } from "@/components/breadcrumb"

export default function CarritoPage() {
  const { carrito, actualizarCantidad, eliminarDelCarrito, totalCarrito, limpiarCarrito } = useCarrito()
  const [datosCliente, setDatosCliente] = useState({
    nombre: "",
    telefono: "",
    direccion: "",
    observaciones: "",
  })
  const router = useRouter()

  const realizarPedido = async () => {
    if (!datosCliente.nombre || !datosCliente.telefono || !datosCliente.direccion) {
      alert("Por favor completa todos los campos obligatorios")
      return
    }

    const pedido = {
      id: Date.now(),
      cliente: datosCliente,
      productos: carrito,
      total: totalCarrito,
      fecha: new Date().toISOString(),
      estado: "PENDIENTE",
    }

    try {
      // Simular llamada al microservicio de pedidos
      const response = await fetch("/api/pedidos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pedido),
      })

      if (response.ok) {
        limpiarCarrito()
        alert("¡Pedido realizado con éxito!")
        router.push("/pedidos")
      }
    } catch (error) {
      console.error("Error al realizar pedido:", error)
      alert("Error al procesar el pedido")
    }
  }

  if (carrito.length === 0) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md border-gray-100 bg-white">
          <CardContent className="text-center p-8">
            <div className="text-gray-400 mb-4">
              <ShoppingBag className="h-16 w-16 mx-auto" />
            </div>
            <h2 className="text-2xl font-light text-gray-900 mb-2">Carrito Vacío</h2>
            <p className="text-gray-600 mb-6">No tienes productos en tu carrito</p>
            <Link href="/">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Explorar Productos
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb />
      
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-light text-gray-900">Mi Carrito</h1>
        <p className="text-gray-600">{carrito.length} productos seleccionados</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lista de productos */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-gray-100 bg-white">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Productos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {carrito.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-100 rounded-lg bg-gray-50">
                  <img
                    src={item.imagen || "/placeholder.svg"}
                    alt={item.nombre}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{item.nombre}</h3>
                    <p className="text-sm text-gray-600">${item.precio.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                      className="h-8 w-8 p-0"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center text-sm font-medium">{item.cantidad}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                      className="h-8 w-8 p-0"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-right min-w-[80px]">
                    <p className="font-medium text-gray-900">${(item.precio * item.cantidad).toLocaleString()}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => eliminarDelCarrito(item.id)}
                      className="text-red-600 hover:text-red-800 h-6 w-6 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Formulario y resumen */}
        <div className="space-y-6">
          {/* Resumen del pedido */}
          <Card className="border-gray-100 bg-white">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Resumen del Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal ({carrito.length} productos)</span>
                <span className="font-medium">${totalCarrito.toLocaleString()}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-medium">
                <span>Total</span>
                <span className="text-blue-600">${totalCarrito.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Datos del cliente */}
          <Card className="border-gray-100 bg-white">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Datos de Entrega</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="nombre" className="text-sm font-medium text-gray-700">Nombre Completo *</Label>
                <Input
                  id="nombre"
                  value={datosCliente.nombre}
                  onChange={(e) => setDatosCliente((prev) => ({ ...prev, nombre: e.target.value }))}
                  placeholder="Tu nombre completo"
                  className="mt-1 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <Label htmlFor="telefono" className="text-sm font-medium text-gray-700">Teléfono *</Label>
                <Input
                  id="telefono"
                  value={datosCliente.telefono}
                  onChange={(e) => setDatosCliente((prev) => ({ ...prev, telefono: e.target.value }))}
                  placeholder="Tu número de teléfono"
                  className="mt-1 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <Label htmlFor="direccion" className="text-sm font-medium text-gray-700">Dirección *</Label>
                <Textarea
                  id="direccion"
                  value={datosCliente.direccion}
                  onChange={(e) => setDatosCliente((prev) => ({ ...prev, direccion: e.target.value }))}
                  placeholder="Dirección completa de entrega"
                  className="mt-1 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="observaciones" className="text-sm font-medium text-gray-700">Observaciones</Label>
                <Textarea
                  id="observaciones"
                  value={datosCliente.observaciones}
                  onChange={(e) => setDatosCliente((prev) => ({ ...prev, observaciones: e.target.value }))}
                  placeholder="Instrucciones adicionales para la entrega"
                  className="mt-1 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Botón de realizar pedido */}
          <Button 
            onClick={realizarPedido} 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-lg"
            disabled={!datosCliente.nombre || !datosCliente.telefono || !datosCliente.direccion}
          >
            Realizar Pedido - ${totalCarrito.toLocaleString()}
          </Button>
        </div>
      </div>
    </div>
  )
}
