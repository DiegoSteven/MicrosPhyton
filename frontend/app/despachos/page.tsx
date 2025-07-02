"use client";

import { useEffect, useState } from "react";
import {
  obtenerDespachos,
  crearDespacho,
  avanzarDespacho,
  fallarDespacho,
  Despacho,
} from "@/app/api/despachos/despachos_api";
import { obtenerPedidos } from "@/app/api/pedidos/pedidos_api";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Box,  RefreshCw, AlertTriangle, Check } from "lucide-react";

const OBSERVACIONES_PREDEFINIDAS = [
  "Listo para envío",
  "Requiere revisión",
  "Entrega urgente",
  "Observación especial",
];

const ESTADO_COLORS: Record<string, string> = {
  PENDIENTE: "bg-gray-200 text-gray-700",
  EN_PREPARACION: "bg-yellow-200 text-yellow-800",
  LISTO_PARA_ENVIO: "bg-green-200 text-green-800",
  FALLIDO: "bg-red-200 text-red-800",
};

export default function DespachosPage() {
  const [despachos, setDespachos] = useState<Despacho[]>([]);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [idOrden, setIdOrden] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [obsCustom, setObsCustom] = useState("");
  const [creando, setCreando] = useState(false);

  useEffect(() => {
    fetchDespachos();
    fetchPedidos();
  }, []);

  const fetchDespachos = async () => {
    try {
      setLoading(true);
      const data = await obtenerDespachos();
      setDespachos(data);
      setError(null);
    } catch {
      setError("No se pudieron cargar los despachos.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPedidos = async () => {
    try {
      const data = await obtenerPedidos();
      setPedidos(data);
    } catch {}
  };

  const pedidosSinDespacho = pedidos.filter(
    (p) => !despachos.some((d) => d.idOrden === p.id)
  );

  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreando(true);
    try {
      await crearDespacho({
        idOrden: Number(idOrden),
        observaciones: observaciones === "custom" ? obsCustom : observaciones,
      });
      setIdOrden("");
      setObservaciones("");
      setObsCustom("");
      fetchDespachos();
    } catch {
      alert("Error al crear despacho.");
    } finally {
      setCreando(false);
    }
  };

  const handleAvanzar = async (id: number) => {
    await avanzarDespacho(id);
    fetchDespachos();
  };

  const handleFallar = async (id: number) => {
    await fallarDespacho(id);
    fetchDespachos();
  };

  return (
    <div className="p-6 space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl text-blue-800 flex items-center gap-2">
            <Box className="h-5 w-5" />
            Gestión de Despachos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* FORMULARIO */}
          <form
            onSubmit={handleCrear}
            className="grid gap-4 md:grid-cols-4 sm:grid-cols-2"
          >
            {/* Pedido */}
            <div className="col-span-1">
              <Label>Pedido</Label>
              <select
                value={idOrden}
                onChange={(e) => setIdOrden(e.target.value)}
                className="w-full border rounded px-3 py-2 bg-white"
                required
              >
                <option value="">Selecciona un pedido</option>
                {pedidosSinDespacho.map((p) => (
                  <option key={p.id} value={p.id}>
                    #{p.id} - Cliente {p.idCliente} - ${p.total}
                  </option>
                ))}
              </select>
            </div>

            {/* Observaciones predefinidas */}
            <div className="col-span-1">
              <Label>Observaciones</Label>
              <select
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                className="w-full border rounded px-3 py-2 bg-white"
              >
                <option value="">Sin observaciones</option>
                {OBSERVACIONES_PREDEFINIDAS.map((obs) => (
                  <option key={obs} value={obs}>
                    {obs}
                  </option>
                ))}
                <option value="custom">Otra...</option>
              </select>
            </div>

            {/* Observación personalizada */}
            {observaciones === "custom" && (
              <div className="col-span-1">
                <Label>Personalizada</Label>
                <Input
                  placeholder="Escribe observación"
                  value={obsCustom}
                  onChange={(e) => setObsCustom(e.target.value)}
                  required
                />
              </div>
            )}

            {/* Botón */}
            <div className="col-span-1 flex items-end">
              <button
                type="submit"
                disabled={creando || !idOrden}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow w-full transition disabled:opacity-50"
              >
                {creando ? "Creando..." : "Crear despacho"}
              </button>
            </div>
          </form>

          {/* TABLA DE DESPACHOS */}
          {loading ? (
            <div className="text-gray-500 text-center py-4">Cargando despachos...</div>
          ) : error ? (
            <div className="text-red-600 text-center py-4">{error}</div>
          ) : (
            <div className="overflow-x-auto rounded border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-100">
                    <TableHead>ID</TableHead>
                    <TableHead>Pedido</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Observaciones</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {despachos.map((d) => (
                    <TableRow key={d.id} className="hover:bg-gray-50">
                      <TableCell>#{d.id}</TableCell>
                      <TableCell>#{d.idOrden}</TableCell>
                      <TableCell>
                        <Badge className={ESTADO_COLORS[d.estado] || "bg-gray-100 text-gray-700"}>
                          {d.estado.replace(/_/g, " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>{d.observaciones || "-"}</TableCell>
                      <TableCell className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleAvanzar(d.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded transition text-sm"
                          disabled={d.estado === "LISTO_PARA_ENVIO" || d.estado === "FALLIDO"}
                          title="Avanzar"
                        >
                          <Check className="inline-block w-4 h-4 mr-1" />
                          Avanzar
                        </button>
                        <button
                          onClick={() => handleFallar(d.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition text-sm"
                          disabled={d.estado === "FALLIDO" || d.estado === "LISTO_PARA_ENVIO"}
                          title="Fallar"
                        >
                          <AlertTriangle className="inline-block w-4 h-4 mr-1" />
                          Fallar
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
