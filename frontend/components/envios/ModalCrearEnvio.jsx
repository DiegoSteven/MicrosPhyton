"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { obtenerDespachos } from "@/app/api/despachos/despachos_api";
import { listarEnvios } from "@/app/api/envios/envios_api";

export default function ModalCrearEnvio({ open, onClose, onSubmit }) {
  const [form, setForm] = useState({
    idDespacho: "",
    nombreDestinatario: "",
    direccionEntrega: "",
    telefono: "",
    ciudad: "",
  });
  const [despachos, setDespachos] = useState([]);
  const [loadingDespachos, setLoadingDespachos] = useState(false);

  useEffect(() => {
    if (open) {
      setForm({
        idDespacho: "",
        nombreDestinatario: "",
        direccionEntrega: "",
        telefono: "",
        ciudad: "",
      });
      fetchDespachos();
    }
  }, [open]);

  const fetchDespachos = async () => {
    setLoadingDespachos(true);
    try {
      const [despachosData, enviosData] = await Promise.all([
        obtenerDespachos(),
        listarEnvios(),
      ]);
      // Filtrar: solo despachos 'Listo para enviar' y que no tengan envío asociado
      const despachosConEnvio = new Set(enviosData.map(e => e.idDespacho));
      const despachosFiltrados = despachosData.filter(
        d => d.estado === 'LISTO_PARA_ENVIO' && !despachosConEnvio.has(d.id)
      );
      setDespachos(despachosFiltrados);
    } catch {}
    setLoadingDespachos(false);
  };

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
            <label className="block text-sm mb-1">Despacho</label>
            <select
              name="idDespacho"
              value={form.idDespacho}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
              disabled={loadingDespachos}
            >
              <option value="">Selecciona un despacho</option>
              {despachos.map((d) => (
                <option key={d.id} value={d.id}>
                  #{d.id} - Orden #{d.idOrden} - Estado: {d.estado}
                </option>
              ))}
            </select>
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
