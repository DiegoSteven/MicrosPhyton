"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Minus,
  Plus,
  Trash2,
  ArrowLeft,
  ShoppingBag,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCarrito } from "@/contexts/carrito-context";
import { Breadcrumb } from "@/components/breadcrumb";
import { crearPedido } from "@/app/api/pedidos/pedidos_api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

import { useRouter } from "next/navigation";

export default function CarritoPage() {
  const {
    carrito,
    actualizarCantidad,
    eliminarDelCarrito,
    totalCarrito,
    limpiarCarrito,
  } = useCarrito();
  const router = useRouter();
  const [modalExito, setModalExito] = useState({
    abierto: false,
    idOrden: null,
  });

  const realizarPedido = async () => {
    if (carrito.length === 0) {
      alert("El carrito está vacío");
      return;
    }
    const pedido = {
      idCliente: 1 /* TODO */,
      lineas: carrito.map((item) => ({
        idProducto: item.id,
        cantidad: item.cantidad,
        precioUnitario: item.precio,
      })),
    };
    try {
      const respuesta = await crearPedido(pedido);
      limpiarCarrito();
      setModalExito({ abierto: true, idOrden: respuesta.id });
      console.log(modalExito);
    } catch (error) {
      console.error("Error al realizar pedido:", error);
      alert("Error al procesar el pedido");
    }
  };

  if (carrito.length === 0) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh] bg-white">
        <Card className="w-full max-w-md border border-black/10 bg-white shadow-subtle">
          <CardContent className="text-center p-8">
            <div className="text-black/20 mb-4">
              <ShoppingBag className="h-16 w-16 mx-auto" />
            </div>
            <h2 className="text-2xl font-light text-black mb-2">
              Carrito Vacío
            </h2>
            <p className="text-black/60 mb-6 font-light">
              No tienes productos en tu carrito
            </p>
            <Link href="/">
              <Button className="bg-black hover:bg-black/90 text-white font-medium">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Explorar Productos
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 bg-white">
      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-light text-black">Mi Carrito</h1>
        <p className="text-black/60 font-light">
          {carrito.length} productos seleccionados
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lista de productos */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border border-black/10 bg-white shadow-subtle">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-black">Productos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {carrito.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center space-x-4 p-4 border border-black/10 rounded-lg bg-black/5"
                >
                  <img
                    src={item.imagen || "/placeholder.svg"}
                    alt={item.nombre}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-black truncate">
                      {item.nombre}
                    </h3>
                    <p className="text-sm text-black/60 font-light">
                      ${item.precio.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        actualizarCantidad(item.id, item.cantidad - 1)
                      }
                      className="h-8 w-8 p-0 border border-black/10 hover:bg-black/5"
                    >
                      <Minus className="h-4 w-4 text-black" />
                    </Button>
                    <span className="w-8 text-center text-sm font-medium text-black">
                      {item.cantidad}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        actualizarCantidad(item.id, item.cantidad + 1)
                      }
                      className="h-8 w-8 p-0 border border-black/10 hover:bg-black/5"
                    >
                      <Plus className="h-4 w-4 text-black" />
                    </Button>
                  </div>
                  <div className="text-right min-w-[80px]">
                    <p className="font-medium text-black">
                      ${(item.precio * item.cantidad).toLocaleString()}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => eliminarDelCarrito(item.id)}
                      className="text-red-600 hover:text-red-800 hover:bg-red-50 h-6 w-6 p-0"
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
          <Card className="border border-black/10 bg-white shadow-subtle">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-black">
                Resumen del Pedido
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-black/60 font-light">
                  Subtotal ({carrito.length} productos)
                </span>
                <span className="font-medium text-black">
                  ${totalCarrito.toLocaleString()}
                </span>
              </div>
              <Separator className="bg-black/10" />
              <div className="flex justify-between text-lg font-medium">
                <span className="text-black">Total</span>
                <span className="text-black">
                  ${totalCarrito.toLocaleString()}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Botón de realizar pedido */}
          <Button
            onClick={realizarPedido}
            className="w-full bg-black hover:bg-black/90 text-white h-12 text-lg font-medium transition-all duration-200"
          >
            Realizar Pedido: ${totalCarrito.toLocaleString()}
          </Button>
        </div>
      </div>

      {/* Modal de éxito */}
      <Dialog
        open={modalExito.abierto}
        onOpenChange={(open) => {
          setModalExito((prev) => ({ ...prev, abierto: open }));
          if (!open && modalExito.idOrden) router.push("/pedidos");
        }}
      >
        <DialogContent className="max-w-md z-[9999] bg-white border border-black/10">
          <DialogHeader>
            <div className="flex flex-col items-center justify-center">
              <CheckCircle className="h-16 w-16 text-green-600 mb-2" />
              <DialogTitle className="text-2xl text-black font-medium">
                ¡Pedido realizado!
              </DialogTitle>
            </div>
          </DialogHeader>
          <div className="py-4 text-center">
            <p className="text-lg text-black/80 mb-2 font-light">
              Tu pedido fue registrado correctamente.
            </p>
            <p className="text-sm text-black/60 font-light">
              ID de orden:{" "}
              <span className="font-bold text-black">{modalExito.idOrden}</span>
            </p>
          </div>
          <DialogFooter>
            <Button
              className="w-full bg-black hover:bg-black/90 text-white font-medium transition-all duration-200"
              onClick={() => {
                setModalExito({ abierto: false, idOrden: null });
                router.push("/pedidos");
              }}
            >
              Ir a Mis Pedidos
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
