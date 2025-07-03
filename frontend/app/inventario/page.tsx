// pages/inventario/page.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { crearProducto } from "@/app/api/inventario/inventario_api";
import ProductoGrid from "@/components/inventario/ProductoGrid";

export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
  imagen_url?: string;
}

export default function InventarioPage() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    precio: "",
    stock: "",
    imagen_url: "",
  });
  const [error, setError] = useState("");
  const [nuevoProducto, setNuevoProducto] = useState<Producto | null>(null);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.nombre || !form.precio || !form.stock) {
      setError("Todos los campos son obligatorios");
      return;
    }

    try {
      const productoCreado = await crearProducto({
        nombre: form.nombre,
        precio: parseFloat(form.precio),
        stock: parseInt(form.stock),
        imagen_url: form.imagen_url || undefined,
      });

      setNuevoProducto(productoCreado);
      setForm({ nombre: "", precio: "", stock: "", imagen_url: "" });
      setOpen(false);
    } catch {
      setError("Error al crear producto");
    }
  };

  return (
    <div className="p-8 space-y-8 bg-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-light text-black mb-2">Productos</h1>
          <p className="text-black/60 font-light">Catálogo de productos disponibles</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-black hover:bg-black/90 text-white font-medium px-6 py-2 transition-all duration-200">
              + Agregar producto
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-white border border-black/10">
            <DialogHeader>
              <DialogTitle className="text-black font-medium">Nuevo producto</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                name="nombre"
                placeholder="Nombre del producto"
                value={form.nombre}
                onChange={handleInput}
                autoFocus
                className="input-minimal"
              />
              <Input
                name="precio"
                placeholder="Precio"
                type="number"
                min="0"
                step="0.01"
                value={form.precio}
                onChange={handleInput}
                className="input-minimal"
              />
              <Input
                name="stock"
                placeholder="Stock disponible"
                type="number"
                min="0"
                value={form.stock}
                onChange={handleInput}
                className="input-minimal"
              />
              <Input
                name="imagen_url"
                placeholder="URL de imagen (opcional)"
                value={form.imagen_url}
                onChange={handleInput}
                className="input-minimal"
              />

              {error && <p className="text-red-600 text-sm font-medium">{error}</p>}
              <Button type="submit" className="w-full bg-black hover:bg-black/90 text-white font-medium transition-all duration-200">
                Guardar producto
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <ProductoGrid nuevoProducto={nuevoProducto ?? undefined} />
    </div>
  );
}
