"use client";

import { useState, useEffect } from "react";
import {
  Package,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  Eye,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Breadcrumb } from "@/components/breadcrumb";
import { obtenerPedidos } from "@/app/api/pedidos/pedidos_api";
import { obtenerProductoPorId } from "@/app/api/inventario/inventario_api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RefreshCw } from "lucide-react";

const estadoColors = {
  PENDIENTE: "bg-yellow-100 text-yellow-800",
  PREPARANDO: "bg-blue-100 text-blue-800",
  DESPACHADO: "bg-purple-100 text-purple-800",
  EN_TRANSITO: "bg-orange-100 text-orange-800",
  ENTREGADO: "bg-green-100 text-green-800",
  CANCELADO: "bg-red-100 text-red-800",
  PAGADO: "bg-green-100 text-green-800",
  COMPLETADO: "bg-green-100 text-green-800",
};

const estadoIcons = {
  PENDIENTE: Clock,
  PREPARANDO: Package,
  DESPACHADO: Truck,
  EN_TRANSITO: Truck,
  ENTREGADO: CheckCircle,
  CANCELADO: XCircle,
  PAGADO: CheckCircle,
  COMPLETADO: CheckCircle,
};

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState([]);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPedidos() {
      try {
        setLoading(true);
        const data = await obtenerPedidos();
        setPedidos(data);
      } catch (e) {
        setError("No se pudieron cargar los pedidos");
      } finally {
        setLoading(false);
      }
    }
    fetchPedidos();
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-light text-gray-900">Mis Pedidos</h1>
        <p className="text-gray-600">Seguimiento de tus pedidos y entregas</p>
      </div>

      {loading ? (
        <Card className="border-gray-100 bg-white">
          <CardContent className="text-center p-12">
            <div className="text-gray-400 mb-4">
              <FileText className="h-16 w-16 mx-auto" />
            </div>
            <h2 className="text-xl font-medium text-gray-900 mb-2">
              Cargando pedidos...
            </h2>
          </CardContent>
        </Card>
      ) : error ? (
        <Card className="border-gray-100 bg-white">
          <CardContent className="text-center p-12">
            <div className="text-gray-400 mb-4">
              <XCircle className="h-16 w-16 mx-auto text-red-400" />
            </div>
            <h2 className="text-xl font-medium text-gray-900 mb-2">{error}</h2>
          </CardContent>
        </Card>
      ) : pedidos.length === 0 ? (
        <Card className="border-gray-100 bg-white">
          <CardContent className="text-center p-12">
            <div className="text-gray-400 mb-4">
              <FileText className="h-16 w-16 mx-auto" />
            </div>
            <h2 className="text-xl font-medium text-gray-900 mb-2">
              No tienes pedidos
            </h2>
            <p className="text-gray-600 mb-6">
              Realiza tu primer pedido para verlo aquí
            </p>
            <Link href="/">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Explorar Productos
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-gray-100 bg-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium">Mis Pedidos</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualizar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-medium text-gray-700">
                    Pedido
                  </TableHead>
                  <TableHead className="font-medium text-gray-700">
                    Cliente
                  </TableHead>
                  <TableHead className="font-medium text-gray-700">
                    Total
                  </TableHead>
                  <TableHead className="font-medium text-gray-700">
                    Estado
                  </TableHead>
                  <TableHead className="font-medium text-gray-700">
                    Acciones
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pedidos.map((pedido) => (
                  <TableRow key={pedido.id}>
                    <TableCell className="font-medium">#{pedido.id}</TableCell>
                    <TableCell>{pedido.idCliente}</TableCell>
                    <TableCell className="font-medium">
                      ${pedido.total.toLocaleString()}
                    </TableCell>

                    <TableCell>{pedido.estado}</TableCell>
                    <TableCell className="flex gap-2">
                      {/* Ver Detalles */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle className="text-xl font-medium">
                              Detalle de la Orden #{pedido.id}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-6">
                            <div>
                              <h4 className="text-lg font-medium mb-4">
                                Productos
                              </h4>
                              <div className="space-y-3">
                                {pedido.lineas.map((linea, idx) => (
                                  <ProductoLineaDetalle
                                    key={idx}
                                    linea={linea}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      {/* Ver Seguimiento */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-blue-600 text-blue-600"
                          >
                            <Truck className="h-4 w-4 mr-2" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg">
                          <DialogHeader>
                            <DialogTitle className="text-xl font-medium">
                              Seguimiento de la Orden #{pedido.id}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="py-6 flex flex-col items-center">
                            <ShippingTrackerWithIcons estado={pedido.estado} />
                            <div className="flex justify-between w-full mt-4 text-xs text-gray-500">
                              {estadosOrden.map((etapa, idx) => (
                                <span
                                  key={etapa}
                                  className={
                                    idx ===
                                    estadosOrden.findIndex(
                                      (e) =>
                                        e.toLowerCase() ===
                                        pedido.estado.toLowerCase()
                                    )
                                      ? "text-blue-700 font-semibold"
                                      : ""
                                  }
                                >
                                  {etapa}
                                </span>
                              ))}
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
      )}
    </div>
  );
}
