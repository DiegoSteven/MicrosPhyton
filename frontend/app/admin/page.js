"use client"

import { useState, useEffect } from "react"
import { Package, Truck, CreditCard, RefreshCw, Edit, BarChart3, Users, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb } from "@/components/breadcrumb"
import Link from "next/link"

// Estados disponibles para cada microservicio
const estadosDespacho = ["PENDIENTE", "PREPARANDO", "DESPACHADO", "COMPLETADO"]
const estadosCobro = ["PENDIENTE", "PROCESANDO", "PAGADO", "RECHAZADO"]
const estadosEnvio = ["PENDIENTE", "EN_TRANSITO", "ENTREGADO", "DEVUELTO"]

// Datos simulados de pedidos para administración
const pedidosAdmin = [
  {
    id: 1001,
    fecha: "2024-01-15T10:30:00Z",
    cliente: "Juan Pérez",
    total: 11800,
    estadoDespacho: "COMPLETADO",
    estadoCobro: "PAGADO",
    estadoEnvio: "ENTREGADO",
  },
  {
    id: 1002,
    fecha: "2024-01-16T14:20:00Z",
    cliente: "María González",
    total: 6800,
    estadoDespacho: "DESPACHADO",
    estadoCobro: "PAGADO",
    estadoEnvio: "EN_TRANSITO",
  },
  {
    id: 1003,
    fecha: "2024-01-17T09:15:00Z",
    cliente: "Carlos Rodríguez",
    total: 9100,
    estadoDespacho: "PREPARANDO",
    estadoCobro: "PENDIENTE",
    estadoEnvio: "PENDIENTE",
  },
  {
    id: 1004,
    fecha: "2024-01-17T15:45:00Z",
    cliente: "Ana Martínez",
    total: 15600,
    estadoDespacho: "PENDIENTE",
    estadoCobro: "PROCESANDO",
    estadoEnvio: "PENDIENTE",
  },
]

const estadoColors = {
  PENDIENTE: "bg-yellow-100 text-yellow-800",
  PREPARANDO: "bg-blue-100 text-blue-800",
  DESPACHADO: "bg-purple-100 text-purple-800",
  EN_TRANSITO: "bg-orange-100 text-orange-800",
  ENTREGADO: "bg-green-100 text-green-800",
  COMPLETADO: "bg-green-100 text-green-800",
  PAGADO: "bg-green-100 text-green-800",
  PROCESANDO: "bg-blue-100 text-blue-800",
  RECHAZADO: "bg-red-100 text-red-800",
  DEVUELTO: "bg-red-100 text-red-800",
}

export default function AdminPage() {
  const [pedidos, setPedidos] = useState([])
  const [estadisticas, setEstadisticas] = useState({
    totalPedidos: 0,
    pedidosPendientes: 0,
    ventasHoy: 0,
    productosEnviados: 0,
  })

  useEffect(() => {
    setPedidos(pedidosAdmin)

    // Calcular estadísticas
    const stats = {
      totalPedidos: pedidosAdmin.length,
      pedidosPendientes: pedidosAdmin.filter(
        (p) => p.estadoDespacho === "PENDIENTE" || p.estadoCobro === "PENDIENTE" || p.estadoEnvio === "PENDIENTE",
      ).length,
      ventasHoy: pedidosAdmin.reduce((sum, p) => sum + p.total, 0),
      productosEnviados: pedidosAdmin.filter((p) => p.estadoEnvio === "ENTREGADO").length,
    }
    setEstadisticas(stats)
  }, [])

  const actualizarEstado = async (pedidoId, tipoEstado, nuevoEstado) => {
    try {
      // Simular llamada a microservicio correspondiente
      const endpoint = {
        despacho: "/api/despacho/actualizar",
        cobro: "/api/cobros/actualizar",
        envio: "/api/envios/actualizar",
      }[tipoEstado]

      // Actualizar estado local
      setPedidos((prev) =>
        prev.map((pedido) =>
          pedido.id === pedidoId
            ? { ...pedido, [`estado${tipoEstado.charAt(0).toUpperCase() + tipoEstado.slice(1)}`]: nuevoEstado }
            : pedido,
        ),
      )

      console.log(`Actualizando ${tipoEstado} del pedido ${pedidoId} a ${nuevoEstado}`)
    } catch (error) {
      console.error("Error al actualizar estado:", error)
    }
  }

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString("es-CL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb />
      
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-light text-gray-900">Panel de Administración</h1>
        <p className="text-gray-600">Gestión de pedidos y seguimiento de operaciones</p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-gray-100 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Pedidos</p>
                <p className="text-3xl font-light text-gray-900">{estadisticas.totalPedidos}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-100 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pendientes</p>
                <p className="text-3xl font-light text-yellow-600">{estadisticas.pedidosPendientes}</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <Package className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-100 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ventas Hoy</p>
                <p className="text-3xl font-light text-green-600">${estadisticas.ventasHoy.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-100 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Entregados</p>
                <p className="text-3xl font-light text-purple-600">{estadisticas.productosEnviados}</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <Truck className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de pedidos */}
      <Card className="border-gray-100 bg-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium">Gestión de Pedidos</CardTitle>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualizar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-medium text-gray-700">Pedido</TableHead>
                <TableHead className="font-medium text-gray-700">Cliente</TableHead>
                <TableHead className="font-medium text-gray-700">Fecha</TableHead>
                <TableHead className="font-medium text-gray-700">Total</TableHead>
                <TableHead className="font-medium text-gray-700">Despacho</TableHead>
                <TableHead className="font-medium text-gray-700">Cobro</TableHead>
                <TableHead className="font-medium text-gray-700">Envío</TableHead>
                <TableHead className="font-medium text-gray-700">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pedidos.map((pedido) => (
                <TableRow key={pedido.id}>
                  <TableCell className="font-medium">#{pedido.id}</TableCell>
                  <TableCell>{pedido.cliente}</TableCell>
                  <TableCell className="text-sm text-gray-600">{formatearFecha(pedido.fecha)}</TableCell>
                  <TableCell className="font-medium">${pedido.total.toLocaleString()}</TableCell>
                  <TableCell>
                    <Select
                      value={pedido.estadoDespacho}
                      onValueChange={(value) => actualizarEstado(pedido.id, "despacho", value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {estadosDespacho.map((estado) => (
                          <SelectItem key={estado} value={estado}>
                            {estado}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={pedido.estadoCobro}
                      onValueChange={(value) => actualizarEstado(pedido.id, "cobro", value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {estadosCobro.map((estado) => (
                          <SelectItem key={estado} value={estado}>
                            {estado}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={pedido.estadoEnvio}
                      onValueChange={(value) => actualizarEstado(pedido.id, "envio", value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {estadosEnvio.map((estado) => (
                          <SelectItem key={estado} value={estado}>
                            {estado}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Editar Pedido #{pedido.id}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <h3 className="font-medium text-gray-900 mb-2">Información del Cliente</h3>
                            <p className="text-sm text-gray-600">{pedido.cliente}</p>
                          </div>
                          <Separator />
                          <div>
                            <h3 className="font-medium text-gray-900 mb-2">Estados Actuales</h3>
                            <div className="grid grid-cols-3 gap-4">
                              <div className="text-center p-3 bg-gray-50 rounded-lg">
                                <p className="text-xs font-medium text-gray-600">Despacho</p>
                                <Badge className={`${estadoColors[pedido.estadoDespacho]} text-xs mt-1`}>
                                  {pedido.estadoDespacho}
                                </Badge>
                              </div>
                              <div className="text-center p-3 bg-gray-50 rounded-lg">
                                <p className="text-xs font-medium text-gray-600">Cobro</p>
                                <Badge className={`${estadoColors[pedido.estadoCobro]} text-xs mt-1`}>
                                  {pedido.estadoCobro}
                                </Badge>
                              </div>
                              <div className="text-center p-3 bg-gray-50 rounded-lg">
                                <p className="text-xs font-medium text-gray-600">Envío</p>
                                <Badge className={`${estadoColors[pedido.estadoEnvio]} text-xs mt-1`}>
                                  {pedido.estadoEnvio}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
