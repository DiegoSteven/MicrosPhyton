"use client"

import { useState, useEffect } from "react"
import { Package, Clock, Truck, CheckCircle, XCircle, Eye, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { Breadcrumb } from "@/components/breadcrumb"

// Simulación de pedidos
const pedidosSimulados = [
  {
    id: 1001,
    fecha: "2024-01-15T10:30:00Z",
    cliente: {
      nombre: "Juan Pérez",
      telefono: "+56912345678",
      direccion: "Av. Principal 123, Santiago",
    },
    productos: [
      { id: 1, nombre: "Aceite de Cocina Premium", precio: 4500, cantidad: 2 },
      { id: 2, nombre: "Arroz Blanco 1kg", precio: 2800, cantidad: 1 },
    ],
    total: 11800,
    estado: "ENTREGADO",
    estadoDespacho: "COMPLETADO",
    estadoCobro: "PAGADO",
    estadoEnvio: "ENTREGADO",
  },
  {
    id: 1002,
    fecha: "2024-01-16T14:20:00Z",
    cliente: {
      nombre: "María González",
      telefono: "+56987654321",
      direccion: "Calle Los Robles 456, Valparaíso",
    },
    productos: [
      { id: 3, nombre: "Leche Entera 1L", precio: 1200, cantidad: 3 },
      { id: 5, nombre: "Detergente Líquido", precio: 3200, cantidad: 1 },
    ],
    total: 6800,
    estado: "EN_TRANSITO",
    estadoDespacho: "DESPACHADO",
    estadoCobro: "PAGADO",
    estadoEnvio: "EN_TRANSITO",
  },
  {
    id: 1003,
    fecha: "2024-01-17T09:15:00Z",
    cliente: {
      nombre: "Carlos Rodríguez",
      telefono: "+56911223344",
      direccion: "Pasaje Las Flores 789, Concepción",
    },
    productos: [
      { id: 6, nombre: "Café Molido 500g", precio: 5500, cantidad: 1 },
      { id: 4, nombre: "Pan de Molde", precio: 1800, cantidad: 2 },
    ],
    total: 9100,
    estado: "PREPARANDO",
    estadoDespacho: "PREPARANDO",
    estadoCobro: "PENDIENTE",
    estadoEnvio: "PENDIENTE",
  },
]

const estadoColors = {
  PENDIENTE: "bg-yellow-100 text-yellow-800",
  PREPARANDO: "bg-blue-100 text-blue-800",
  DESPACHADO: "bg-purple-100 text-purple-800",
  EN_TRANSITO: "bg-orange-100 text-orange-800",
  ENTREGADO: "bg-green-100 text-green-800",
  CANCELADO: "bg-red-100 text-red-800",
  PAGADO: "bg-green-100 text-green-800",
  COMPLETADO: "bg-green-100 text-green-800",
}

const estadoIcons = {
  PENDIENTE: Clock,
  PREPARANDO: Package,
  DESPACHADO: Truck,
  EN_TRANSITO: Truck,
  ENTREGADO: CheckCircle,
  CANCELADO: XCircle,
  PAGADO: CheckCircle,
  COMPLETADO: CheckCircle,
}

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState([])
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null)

  useEffect(() => {
    // Simular carga de pedidos desde el microservicio
    setPedidos(pedidosSimulados)
  }, [])

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString("es-CL", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getEstadoIcon = (estado) => {
    const Icon = estadoIcons[estado] || Clock
    return <Icon className="h-4 w-4" />
  }

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb />
      
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-light text-gray-900">Mis Pedidos</h1>
        <p className="text-gray-600">Seguimiento de tus pedidos y entregas</p>
      </div>

      {pedidos.length === 0 ? (
        <Card className="border-gray-100 bg-white">
          <CardContent className="text-center p-12">
            <div className="text-gray-400 mb-4">
              <FileText className="h-16 w-16 mx-auto" />
            </div>
            <h2 className="text-xl font-medium text-gray-900 mb-2">No tienes pedidos</h2>
            <p className="text-gray-600 mb-6">Realiza tu primer pedido para verlo aquí</p>
            <Link href="/">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Explorar Productos
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {pedidos.map((pedido) => (
            <Card key={pedido.id} className="border-gray-100 bg-white hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <CardTitle className="flex items-center space-x-3">
                      <span className="text-lg font-medium">Pedido #{pedido.id}</span>
                      <Badge className={estadoColors[pedido.estado]}>
                        {getEstadoIcon(pedido.estado)}
                        <span className="ml-1">{pedido.estado.replace("_", " ")}</span>
                      </Badge>
                    </CardTitle>
                    <p className="text-sm text-gray-600">{formatearFecha(pedido.fecha)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-light text-gray-900">${pedido.total.toLocaleString()}</p>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="mt-2">
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Detalles
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="text-xl font-medium">Detalles del Pedido #{pedido.id}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6">
                          {/* Estados del pedido */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                              <div className="mb-2">
                                <Package className="h-8 w-8 mx-auto text-blue-600" />
                              </div>
                              <p className="text-sm font-medium text-gray-700">Despacho</p>
                              <Badge className={`${estadoColors[pedido.estadoDespacho]} text-xs mt-1`}>
                                {pedido.estadoDespacho}
                              </Badge>
                            </div>
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                              <div className="mb-2">
                                <CheckCircle className="h-8 w-8 mx-auto text-green-600" />
                              </div>
                              <p className="text-sm font-medium text-gray-700">Cobro</p>
                              <Badge className={`${estadoColors[pedido.estadoCobro]} text-xs mt-1`}>
                                {pedido.estadoCobro}
                              </Badge>
                            </div>
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                              <div className="mb-2">
                                <Truck className="h-8 w-8 mx-auto text-purple-600" />
                              </div>
                              <p className="text-sm font-medium text-gray-700">Envío</p>
                              <Badge className={`${estadoColors[pedido.estadoEnvio]} text-xs mt-1`}>
                                {pedido.estadoEnvio}
                              </Badge>
                            </div>
                          </div>

                          <Separator />

                          {/* Información del cliente */}
                          <div>
                            <h3 className="font-medium text-gray-900 mb-3">Información de Entrega</h3>
                            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                              <p className="text-sm"><span className="font-medium">Nombre:</span> {pedido.cliente.nombre}</p>
                              <p className="text-sm"><span className="font-medium">Teléfono:</span> {pedido.cliente.telefono}</p>
                              <p className="text-sm"><span className="font-medium">Dirección:</span> {pedido.cliente.direccion}</p>
                            </div>
                          </div>

                          <Separator />

                          {/* Productos */}
                          <div>
                            <h3 className="font-medium text-gray-900 mb-3">Productos</h3>
                            <div className="space-y-2">
                              {pedido.productos.map((producto) => (
                                <div key={producto.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                  <div>
                                    <p className="font-medium text-gray-900">{producto.nombre}</p>
                                    <p className="text-sm text-gray-600">Cantidad: {producto.cantidad}</p>
                                  </div>
                                  <p className="font-medium text-gray-900">${(producto.precio * producto.cantidad).toLocaleString()}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          <Separator />

                          {/* Total */}
                          <div className="flex justify-between items-center text-lg font-medium">
                            <span>Total del Pedido</span>
                            <span className="text-blue-600">${pedido.total.toLocaleString()}</span>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
