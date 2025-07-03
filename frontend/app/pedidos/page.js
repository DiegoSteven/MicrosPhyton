"use client";

import { useState, useEffect, useCallback } from "react";
import { Breadcrumb } from "@/components/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, XCircle, Wifi } from "lucide-react";
import { obtenerPedidos } from "@/app/api/pedidos/pedidos_api";
import PedidoLista from "@/components/pedidos/PedidoLista";

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  const fetchPedidos = useCallback(async (isAutoRefresh = false) => {
    try {
      if (!isAutoRefresh) {
        setError(null);
      }
      const data = await obtenerPedidos();
      setPedidos(data);
      setLastUpdate(new Date());
    } catch (e) {
      if (!isAutoRefresh) {
        setError("No se pudieron cargar los pedidos");
        console.error("Error al cargar pedidos:", e);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPedidos(false);
  };

  useEffect(() => {
    fetchPedidos(false);
  }, [fetchPedidos]);

  // Actualización automática cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading && !refreshing) {
        fetchPedidos(true);
      }
    }, 30000); // 30 segundos

    return () => clearInterval(interval);
  }, [fetchPedidos, loading, refreshing]);

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb />
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-light text-gray-900">Mis Pedidos</h1>
            <p className="text-gray-600">Seguimiento de tus pedidos y entregas</p>
          </div>
          
        </div>
      </div>

      {loading ? (
        <EstadoPlaceholder icon={FileText} texto="Cargando pedidos..." />
      ) : error ? (
        <EstadoPlaceholder 
          icon={XCircle} 
          texto={error}
          botonText="Reintentar"
          botonOnClick={handleRefresh}
        />
      ) : pedidos.length === 0 ? (
        <EstadoPlaceholder
          icon={FileText}
          texto="No tienes pedidos"
          botonText="Explorar Productos"
          botonHref="/"
        />
      ) : (
        <PedidoLista 
          pedidos={pedidos} 
          onRefresh={handleRefresh}
          refreshing={refreshing}
        />
      )}
    </div>
  );
}

function EstadoPlaceholder({ icon: Icon, texto, botonText, botonHref, botonOnClick }) {
  return (
    <Card className="border-gray-100 bg-white">
      <CardContent className="text-center p-12">
        <div className="text-gray-400 mb-4">
          <Icon className="h-16 w-16 mx-auto" />
        </div>
        <h2 className="text-xl font-medium text-gray-900 mb-4">{texto}</h2>
        {botonText && (botonHref || botonOnClick) && (
          botonHref ? (
            <a href={botonHref}>
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm">
                {botonText}
              </button>
            </a>
          ) : (
            <button 
              onClick={botonOnClick}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
            >
              {botonText}
            </button>
          )
        )}
      </CardContent>
    </Card>
  );
}
