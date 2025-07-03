"use client";
import { useEffect, useState } from "react";
import {
  obtenerCobros,
  crearCobro,
  pagarCobro,
  enviarCobro,
  Cobro,
} from "@/app/api/cobros/cobros_api";
import { obtenerPedidos } from "@/app/api/pedidos/pedidos_api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign, CheckCircle } from "lucide-react";

const ESTADO_COLORS: Record<string, string> = {
  EN_ESPERA: "bg-yellow-200 text-yellow-800",
  PAGADO: "bg-green-200 text-green-800",
  ENVIADO_DEL_DESPACHO: "bg-blue-200 text-blue-800",
};

export default function CobrosPage() {
  const [cobros, setCobros] = useState<Cobro[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [idOrden, setIdOrden] = useState("");
  const [monto, setMonto] = useState("");
  const [creando, setCreando] = useState(false);
  const [pedidos, setPedidos] = useState<any[]>([]);

  useEffect(() => {
    fetchCobros();
    fetchPedidos();
  }, []);

  const fetchCobros = async () => {
    try {
      setLoading(true);
      const data = await obtenerCobros();
      setCobros(data);
      setError(null);
    } catch {
      setError("No se pudieron cargar los cobros.");
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

  // Filtrar pedidos que no tienen cobro
  const pedidosSinCobro = pedidos.filter(
    (p) => !cobros.some((c) => c.idOrden === p.id)
  );

  // Función para actualizar el monto cuando se selecciona un pedido
  const handlePedidoChange = (pedidoId: string) => {
    setIdOrden(pedidoId);
    if (pedidoId) {
      const pedidoSeleccionado = pedidos.find(p => p.id === Number(pedidoId));
      if (pedidoSeleccionado) {
        setMonto(pedidoSeleccionado.total.toString());
      }
    } else {
      setMonto("");
    }
  };

  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreando(true);
    try {
      await crearCobro({ idOrden: Number(idOrden), monto: Number(monto) });
      setIdOrden("");
      setMonto("");
      fetchCobros();
    } catch {
      alert("Error al crear cobro.");
    } finally {
      setCreando(false);
    }
  };

  const handlePagar = async (id: number) => {
    await pagarCobro(id);
    fetchCobros();
  };

  const handleEnviar = async (id: number) => {
    await enviarCobro(id);
    fetchCobros();
  };

  return (
    <div className="p-6 space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl text-black flex items-center gap-2">
            <DollarSign className="h-5 w-5" /> Gestión de Cobros
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* FORMULARIO */}
          <form
            onSubmit={handleCrear}
            className="grid gap-4 md:grid-cols-3 sm:grid-cols-2"
          >
            {/* Pedido */}
            <div className="col-span-1">
              <Label>Pedido</Label>
              <select
                value={idOrden}
                onChange={(e) => handlePedidoChange(e.target.value)}
                className="w-full border rounded px-3 py-2 bg-white"
                required
              >
                <option value="">Selecciona un pedido</option>
                {pedidosSinCobro.map((p) => (
                  <option key={p.id} value={p.id}>
                    #{p.id} - Cliente {p.idCliente} - ${p.total}
                  </option>
                ))}
              </select>
            </div>
            {/* Monto */}
            <div className="col-span-1">
              <Label>Monto</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                placeholder="Selecciona un pedido"
                value={monto}
                readOnly
                className="bg-gray-50 cursor-not-allowed"
              />
            </div>
            {/* Botón */}
            <div className="col-span-1 flex items-end">
              <button
                type="submit"
                className="bg-black hover:bg-black text-white px-4 py-2 rounded shadow w-full transition disabled:opacity-50"
                disabled={creando || !idOrden}
              >
                {creando ? "Creando..." : "Crear cobro"}
              </button>
            </div>
          </form>
          {/* TABLA DE COBROS */}
          {loading ? (
            <div className="text-gray-500 text-center py-4">
              Cargando cobros...
            </div>
          ) : error ? (
            <div className="text-red-600 text-center py-4">{error}</div>
          ) : (
            <div className="overflow-x-auto rounded border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-100">
                    <TableHead>ID</TableHead>
                    <TableHead>Pedido</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cobros.map((c) => (
                    <TableRow key={c.id} className="hover:bg-gray-50">
                      <TableCell>#{c.id}</TableCell>
                      <TableCell>#{c.idOrden}</TableCell>
                      <TableCell>${c.monto.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            ESTADO_COLORS[c.estado] ||
                            "bg-gray-100 text-gray-700"
                          }
                        >
                          {c.estado.replace(/_/g, " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="flex flex-wrap gap-2">
                        {c.estado !== "PAGADO" && (
                          <button
                            onClick={() => handlePagar(c.id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded transition text-sm"
                            disabled={c.estado !== "EN_ESPERA"}
                            title="Pagar"
                          >
                            <CheckCircle className="inline-block w-4 h-4 mr-1" />
                            Pagar
                          </button>
                        )}
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
