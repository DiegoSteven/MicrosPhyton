"use client";

import { useState, useEffect } from "react";
import { Breadcrumb } from "@/components/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, XCircle } from "lucide-react";
import { obtenerPedidos } from "@/app/api/pedidos/pedidos_api";
import PedidoLista from "@/components/pedidos/PedidoLista";

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPedidos() {
      try {
        const data = await obtenerPedidos();
        setPedidos(data);
      } catch (e) {
        setError("No se pudieron cargar los pedidos");
      } finally {
        setLoading(false);
      }
    }
    fetchPedidos();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb />
      <div className="space-y-2">
        <h1 className="text-3xl font-light text-gray-900">Mis Pedidos</h1>
        <p className="text-gray-600">Seguimiento de tus pedidos y entregas</p>
      </div>

      {loading ? (
        <EstadoPlaceholder icon={FileText} texto="Cargando pedidos..." />
      ) : error ? (
        <EstadoPlaceholder icon={XCircle} texto={error} />
      ) : pedidos.length === 0 ? (
        <EstadoPlaceholder
          icon={FileText}
          texto="No tienes pedidos"
          botonText="Explorar Productos"
          botonHref="/"
        />
      ) : (
        <PedidoLista pedidos={pedidos} />
      )}
    </div>
  );
}

function EstadoPlaceholder({ icon: Icon, texto, botonText, botonHref }) {
  return (
    <Card className="border-gray-100 bg-white">
      <CardContent className="text-center p-12">
        <div className="text-gray-400 mb-4">
          <Icon className="h-16 w-16 mx-auto" />
        </div>
        <h2 className="text-xl font-medium text-gray-900 mb-4">{texto}</h2>
        {botonText && botonHref && (
          <a href={botonHref}>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm">
              {botonText}
            </button>
          </a>
        )}
      </CardContent>
    </Card>
  );
}
