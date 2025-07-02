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
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light text-gray-900">Inventario</h1>
          <p className="text-gray-600">Gestiona tu stock de productos</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              + Agregar producto
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Nuevo producto</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                name="nombre"
                placeholder="Nombre"
                value={form.nombre}
                onChange={handleInput}
                autoFocus
              />
              <Input
                name="precio"
                placeholder="Precio"
                type="number"
                min="0"
                step="0.01"
                value={form.precio}
                onChange={handleInput}
              />
              <Input
                name="stock"
                placeholder="Stock"
                type="number"
                min="0"
                value={form.stock}
                onChange={handleInput}
              />
              <Input
                name="imagen_url"
                placeholder="URL de imagen"
                value={form.imagen_url}
                onChange={handleInput}
              />

              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button type="submit" className="w-full bg-blue-600 text-white">
                Guardar
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <ProductoGrid nuevoProducto={nuevoProducto ?? undefined} />
    </div>
  );
}
