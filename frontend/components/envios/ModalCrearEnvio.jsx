"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function ModalCrearEnvio({ open, onClose, onSubmit }) {
  const [form, setForm] = useState({
    idDespacho: "",
    nombreDestinatario: "",
    direccionEntrega: "",
    telefono: "",
    ciudad: "",
  });

  useEffect(() => {
    if (!open) {
      setForm({
        idDespacho: "",
        nombreDestinatario: "",
        direccionEntrega: "",
        telefono: "",
        ciudad: "",
      });
    }
  }, [open]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, idDespacho: Number(form.idDespacho) });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Crear Envío</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="block text-sm mb-1">ID Despacho</label>
            <input
              type="number"
              name="idDespacho"
              value={form.idDespacho}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">
              Nombre del Destinatario
            </label>
            <input
              name="nombreDestinatario"
              value={form.nombreDestinatario}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Dirección de Entrega</label>
            <input
              name="direccionEntrega"
              value={form.direccionEntrega}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Teléfono</label>
            <input
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Ciudad</label>
            <input
              name="ciudad"
              value={form.ciudad}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Crear</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
