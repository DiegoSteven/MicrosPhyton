"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface Producto {
  id: number
  nombre: string
  precio: number
  stock: number
  categoria: string
  imagen: string
  descripcion: string
}

interface ItemCarrito extends Producto {
  cantidad: number
}

interface CarritoContextType {
  carrito: ItemCarrito[]
  agregarAlCarrito: (producto: Producto) => void
  actualizarCantidad: (id: number, cantidad: number) => void
  eliminarDelCarrito: (id: number) => void
  limpiarCarrito: () => void
  totalCarrito: number
  cantidadCarrito: number
}

const CarritoContext = createContext<CarritoContextType | undefined>(undefined)

export function CarritoProvider({ children }: { children: ReactNode }) {
  const [carrito, setCarrito] = useState<ItemCarrito[]>([])

  // Cargar carrito desde localStorage al inicializar
  useEffect(() => {
    const carritoGuardado = localStorage.getItem("carrito")
    if (carritoGuardado) {
      try {
        setCarrito(JSON.parse(carritoGuardado))
      } catch (error) {
        console.error("Error al cargar carrito:", error)
      }
    }
  }, [])

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito))
  }, [carrito])

  const agregarAlCarrito = (producto: Producto) => {
    setCarrito((prev) => {
      const existente = prev.find((item) => item.id === producto.id)
      if (existente) {
        return prev.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: Math.min(item.cantidad + 1, producto.stock) }
            : item
        )
      }
      return [...prev, { ...producto, cantidad: 1 }]
    })
  }

  const actualizarCantidad = (id: number, cantidad: number) => {
    if (cantidad <= 0) {
      eliminarDelCarrito(id)
      return
    }

    setCarrito((prev) =>
      prev.map((item) => (item.id === id ? { ...item, cantidad } : item))
    )
  }

  const eliminarDelCarrito = (id: number) => {
    setCarrito((prev) => prev.filter((item) => item.id !== id))
  }

  const limpiarCarrito = () => {
    setCarrito([])
  }

  const totalCarrito = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0)
  const cantidadCarrito = carrito.reduce((sum, item) => sum + item.cantidad, 0)

  return (
    <CarritoContext.Provider
      value={{
        carrito,
        agregarAlCarrito,
        actualizarCantidad,
        eliminarDelCarrito,
        limpiarCarrito,
        totalCarrito,
        cantidadCarrito,
      }}
    >
      {children}
    </CarritoContext.Provider>
  )
}

export function useCarrito() {
  const context = useContext(CarritoContext)
  if (context === undefined) {
    throw new Error("useCarrito debe ser usado dentro de un CarritoProvider")
  }
  return context
} 