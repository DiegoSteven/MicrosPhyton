"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useCarrito } from "@/contexts/carrito-context";
import { obtenerProductos } from "@/app/api/inventario/inventario_api";
import { Producto } from "@/app/inventario/page";

export default function ProductoGrid({
  nuevoProducto,
}: {
  nuevoProducto?: Producto;
}) {
  const { agregarAlCarrito, cantidadCarrito } = useCarrito();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    async function fetchProductos() {
      try {
        setLoading(true);
        const data = await obtenerProductos();
        setProductos(data);
      } catch (e) {
        setError("No se pudieron cargar los productos");
      } finally {
        setLoading(false);
      }
    }
    fetchProductos();
  }, []);

  useEffect(() => {
    if (nuevoProducto) {
      setProductos((prev) => [nuevoProducto, ...prev]);
    }
  }, [nuevoProducto]);

  const productosFiltrados = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  let content: React.ReactNode;
  if (loading) {
    content = (
      <div className="text-center py-12 text-black/60 font-light">Cargando productos...</div>
    );
  } else if (error) {
    content = <div className="text-center py-12 text-red-600 font-medium">{error}</div>;
  } else {
    content = (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {productosFiltrados.map((producto: Producto) => {
          const productoCompleto = {
            ...producto,
            categoria: (producto as any).categoria || "General",
            imagen: (producto as any).imagen || producto.imagen_url || "/placeholder.svg?height=200&width=200",
            descripcion: (producto as any).descripcion || "Sin descripción",
          };

          return (
            <Card
              key={producto.id}
              className="group transition-all duration-300 border border-black/10 hover:shadow-medium bg-white rounded-lg overflow-hidden"
            >
              <CardHeader className="p-0">
                <div className="relative h-48 bg-black/5 flex items-center justify-center overflow-hidden">
                  {producto.imagen_url ? (
                    <img
                      src={producto.imagen_url}
                      alt={producto.nombre}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Search className="h-16 w-16 text-black/20" />
                  )}
                </div>
              </CardHeader>

              <CardContent className="p-4 space-y-3">
                <CardTitle className="text-lg font-medium text-black truncate">
                  {producto.nombre}
                </CardTitle>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <span className="text-black text-xl font-light">
                    ${producto.precio.toLocaleString()}
                  </span>
                  <Badge
                    variant={producto.stock > 10 ? "secondary" : "destructive"}
                    className={`text-xs w-fit ${
                      producto.stock > 10 
                        ? "bg-black/10 text-black" 
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {producto.stock > 10 ? "Disponible" : "Stock bajo"}
                  </Badge>
                </div>

                <p className="text-sm text-black/60 font-light">
                  Stock: {producto.stock} unidades
                </p>
              </CardContent>

              <CardFooter className="p-4 pt-0">
                <Button
                  onClick={() => agregarAlCarrito(productoCompleto)}
                  disabled={producto.stock === 0}
                  className={`w-full font-medium transition-all duration-200 ${
                    producto.stock === 0
                      ? "bg-black/10 text-black/40 cursor-not-allowed"
                      : "bg-black hover:bg-black/90 text-white"
                  }`}
                >
                  {producto.stock === 0 ? "Sin Stock" : "Agregar al Carrito"}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-black/40" />
        <Input
          placeholder="Buscar productos..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="pl-10 input-minimal"
        />
      </div>

      {content}

      {!loading && productosFiltrados.length === 0 && (
        <div className="text-center py-12">
          <Search className="h-16 w-16 mx-auto text-black/20 mb-4" />
          <h3 className="text-lg font-medium text-black mb-2">
            No se encontraron productos
          </h3>
          <p className="text-black/60 font-light">Intenta ajustar la búsqueda</p>
        </div>
      )}

      {cantidadCarrito > 0 && (
        <div className="fixed bottom-6 right-6 bg-black text-white px-4 py-2 rounded-full shadow-medium flex items-center space-x-2">
          <span className="text-sm font-medium">{cantidadCarrito}</span>
          <span className="text-xs">producto(s) en carrito</span>
        </div>
      )}
    </div>
  );
}
