"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Filter } from "lucide-react"
import { useCarrito } from "@/contexts/carrito-context"
import { Breadcrumb } from "@/components/breadcrumb"

// Simulación de productos del microservicio de inventario
const productos = [
  {
    id: 1,
    nombre: "Aceite de Cocina Premium",
    precio: 4500,
    stock: 25,
    categoria: "Aceites",
    imagen: "/placeholder.svg?height=200&width=200",
    descripcion: "Aceite de girasol premium para cocina",
  },
  {
    id: 2,
    nombre: "Arroz Blanco 1kg",
    precio: 2800,
    stock: 50,
    categoria: "Granos",
    imagen: "/placeholder.svg?height=200&width=200",
    descripcion: "Arroz blanco de primera calidad",
  },
  {
    id: 3,
    nombre: "Leche Entera 1L",
    precio: 1200,
    stock: 30,
    categoria: "Lácteos",
    imagen: "/placeholder.svg?height=200&width=200",
    descripcion: "Leche entera pasteurizada",
  },
  {
    id: 4,
    nombre: "Pan de Molde",
    precio: 1800,
    stock: 15,
    categoria: "Panadería",
    imagen: "/placeholder.svg?height=200&width=200",
    descripcion: "Pan de molde integral",
  },
  {
    id: 5,
    nombre: "Detergente Líquido",
    precio: 3200,
    stock: 20,
    categoria: "Limpieza",
    imagen: "/placeholder.svg?height=200&width=200",
    descripcion: "Detergente líquido concentrado",
  },
  {
    id: 6,
    nombre: "Café Molido 500g",
    precio: 5500,
    stock: 12,
    categoria: "Bebidas",
    imagen: "/placeholder.svg?height=200&width=200",
    descripcion: "Café molido premium",
  },
]

export default function HomePage() {
  const { agregarAlCarrito, cantidadCarrito } = useCarrito()
  const [filtroCategoria, setFiltroCategoria] = useState("Todos")
  const [busqueda, setBusqueda] = useState("")

  const categorias = ["Todos", ...new Set(productos.map((p) => p.categoria))]

  const productosFiltrados = productos.filter((producto) => {
    const cumpleCategoria = filtroCategoria === "Todos" || producto.categoria === filtroCategoria
    const cumpleBusqueda = producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                          producto.descripcion.toLowerCase().includes(busqueda.toLowerCase())
    return cumpleCategoria && cumpleBusqueda
  })

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb />
      
      {/* Header minimalista */}
      <div className="space-y-4">
        <h1 className="text-3xl font-light text-gray-900">Productos</h1>
        <p className="text-gray-600">Descubre nuestra selección de productos de calidad</p>
      </div>

      {/* Filtros y búsqueda */}
      <div className="space-y-4">
        {/* Búsqueda */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar productos..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="pl-10 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Filtros de categoría */}
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">Filtrar por:</span>
          <div className="flex flex-wrap gap-2">
            {categorias.map((categoria) => (
              <Button
                key={categoria}
                variant={filtroCategoria === categoria ? "default" : "outline"}
                size="sm"
                onClick={() => setFiltroCategoria(categoria)}
                className="text-xs"
              >
                {categoria}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid de productos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {productosFiltrados.map((producto) => (
          <Card key={producto.id} className="group hover:shadow-lg transition-all duration-300 border-gray-100 bg-white">
            <CardHeader className="p-0">
              <div className="relative overflow-hidden rounded-t-lg">
                <img
                  src={producto.imagen || "/placeholder.svg"}
                  alt={producto.nombre}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2">
                  <Badge 
                    variant={producto.stock > 10 ? "secondary" : "destructive"}
                    className="text-xs"
                  >
                    {producto.stock > 10 ? "Disponible" : "Stock bajo"}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div>
                <CardTitle className="text-lg font-medium text-gray-900 mb-1">
                  {producto.nombre}
                </CardTitle>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {producto.descripcion}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-light text-gray-900">
                  ${producto.precio.toLocaleString()}
                </span>
                <Badge variant="outline" className="text-xs">
                  {producto.categoria}
                </Badge>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button 
                onClick={() => agregarAlCarrito(producto)} 
                disabled={producto.stock === 0}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {producto.stock === 0 ? "Sin Stock" : "Agregar al Carrito"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Mensaje cuando no hay productos */}
      {productosFiltrados.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron productos</h3>
          <p className="text-gray-600">Intenta ajustar los filtros o la búsqueda</p>
        </div>
      )}

      {/* Indicador de carrito flotante */}
      {cantidadCarrito > 0 && (
        <div className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">{cantidadCarrito}</span>
            <span className="text-xs">productos</span>
          </div>
        </div>
      )}
    </div>
  )
}
