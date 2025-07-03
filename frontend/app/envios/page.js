"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  listarEnvios,
  crearEnvio,
  eliminarEnvio,
  avanzarEstadoEnvio,
  devolverEnvio,
  cancelarEnvio,
} from "../api/envios/envios_api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Truck, CheckCircle, XCircle, Clock, Eye, RefreshCw, Wifi, Plus } from "lucide-react";
import ModalCrearEnvio from "@/components/envios/ModalCrearEnvio";
import { ArrowRight, Undo2, Ban, Trash2 } from "lucide-react";

// Función para obtener el estilo del badge según el estado
function getEstadoBadge(estado) {
  switch (estado) {
    case 'EnTransito':
      return <Badge variant="default" className="bg-orange-100 text-orange-800">En Tránsito</Badge>;
    case 'Entregado':
      return <Badge variant="default" className="bg-green-100 text-green-800">Entregado</Badge>;
    case 'Devuelto':
      return <Badge variant="default" className="bg-blue-100 text-blue-800">Devuelto</Badge>;
    case 'Cancelado':
      return <Badge variant="destructive">Cancelado</Badge>;
    default:
      return <Badge variant="outline">{estado}</Badge>;
  }
}

// Función para obtener el icono según el estado
function getEstadoIcon(estado) {
  switch (estado) {
    case 'EnTransito':
      return Truck;
    case 'Entregado':
      return CheckCircle;
    case 'Devuelto':
      return Undo2;
    case 'Cancelado':
      return XCircle;
    default:
      return Clock;
  }
}

export default function EnviosPage() {
  const [envios, setEnvios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [lastUpdate, setLastUpdate] = useState(null);

  const cargarEnvios = useCallback(async (isAutoRefresh = false) => {
    try {
      if (!isAutoRefresh) {
        setError("");
      }
      const data = await listarEnvios();
      setEnvios(data);
      setLastUpdate(new Date());
    } catch (e) {
      if (!isAutoRefresh) {
        setError("Error al cargar los envíos");
        console.error("Error al cargar envíos:", e);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    cargarEnvios(false);
  };

  useEffect(() => {
    cargarEnvios(false);
  }, [cargarEnvios]);

  // Actualización automática cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading && !refreshing) {
        cargarEnvios(true);
      }
    }, 30000); // 30 segundos

    return () => clearInterval(interval);
  }, [cargarEnvios, loading, refreshing]);

  const handleCrear = async (nuevoEnvio) => {
    try {
      await crearEnvio(nuevoEnvio);
      setMensaje("✅ Envío creado exitosamente");
      setModalOpen(false);
      cargarEnvios(false);
    } catch (e) {
      setMensaje("❌ Error al crear el envío");
      console.error("Error al crear envío:", e);
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este envío?")) return;
    try {
      await eliminarEnvio(id);
      setMensaje("🚫 Envío eliminado exitosamente");
      cargarEnvios(false);
    } catch (e) {
      setMensaje("❌ Error al eliminar el envío");
      console.error("Error al eliminar envío:", e);
    }
  };

  const handleAvanzar = async (id) => {
    try {
      await avanzarEstadoEnvio(id);
      setMensaje("✅ Estado avanzado exitosamente");
      cargarEnvios(false);
    } catch (e) {
      setMensaje("❌ No se pudo avanzar el estado");
      console.error("Error al avanzar estado:", e);
    }
  };

  const handleDevolver = async (id) => {
    try {
      await devolverEnvio(id);
      setMensaje("🔄 Envío devuelto exitosamente");
      cargarEnvios(false);
    } catch (e) {
      setMensaje("❌ No se pudo devolver el envío");
      console.error("Error al devolver envío:", e);
    }
  };

  const handleCancelar = async (id) => {
    try {
      await cancelarEnvio(id);
      setMensaje("❌ Envío cancelado exitosamente");
      cargarEnvios(false);
    } catch (e) {
      setMensaje("❌ No se pudo cancelar el envío");
      console.error("Error al cancelar envío:", e);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-light text-gray-900">Envíos</h1>
            <p className="text-gray-600">
              Gestiona y revisa el estado de tus envíos
            </p>
          </div>
         
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button onClick={() => setModalOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Envío
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Actualizando...' : 'Actualizar'}
        </Button>
      </div>

      {mensaje && (
        <div className={`p-3 rounded-md font-medium ${
          mensaje.includes('✅') || mensaje.includes('🔄') 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {mensaje}
        </div>
      )}

      {loading ? (
        <Card className="border-gray-100 bg-white">
          <CardContent className="text-center p-12">
            <div className="text-gray-400 mb-4">
              <Truck className="h-16 w-16 mx-auto animate-pulse" />
            </div>
            <h2 className="text-xl font-medium text-gray-900 mb-2">
              Cargando envíos...
            </h2>
          </CardContent>
        </Card>
      ) : error ? (
        <Card className="border-gray-100 bg-white">
          <CardContent className="text-center p-12">
            <div className="text-gray-400 mb-4">
              <XCircle className="h-16 w-16 mx-auto" />
            </div>
            <h2 className="text-xl font-medium text-gray-900 mb-4">{error}</h2>
            <Button onClick={handleRefresh} className="bg-black text-white px-4 py-2 rounded hover:bg-black">
              Reintentar
            </Button>
          </CardContent>
        </Card>
      ) : envios.length === 0 ? (
        <Card className="border-gray-100 bg-white">
          <CardContent className="text-center p-12">
            <div className="text-gray-400 mb-4">
              <Truck className="h-16 w-16 mx-auto" />
            </div>
            <h2 className="text-xl font-medium text-gray-900 mb-2">
              No hay envíos
            </h2>
            <p className="text-gray-600 mb-6">
              Crea tu primer envío para verlo aquí
            </p>
            <Button onClick={() => setModalOpen(true)} className="bg-black text-white px-4 py-2 rounded hover:bg-black">
              Crear Envío
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {envios.map((envio) => {
            const EstadoIcon = getEstadoIcon(envio.estado);
            return (
              <Card
                key={envio.id}
                className="border-gray-100 bg-white hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                    <div className="space-y-2 w-full">
                      <CardTitle className="flex items-center justify-between">
                        <span className="text-lg font-medium">
                          Envío #{envio.id}
                        </span>
                        <div className="flex items-center gap-2">
                          <EstadoIcon className="h-4 w-4 text-gray-500" />
                          {getEstadoBadge(envio.estado)}
                        </div>
                      </CardTitle>

                      <div className="text-sm text-gray-700 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        <div>
                          <strong>📦 ID Despacho:</strong> {envio.idDespacho}
                        </div>
                        <div>
                          <strong>👤 Destinatario:</strong>{" "}
                          {envio.nombreDestinatario}
                        </div>
                        <div>
                          <strong>📍 Ciudad:</strong> {envio.ciudad}
                        </div>
                        <div>
                          <strong>📞 Teléfono:</strong> {envio.telefono}
                        </div>
                        <div className="col-span-2">
                          <strong>🏠 Dirección:</strong>{" "}
                          {envio.direccionEntrega}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 min-w-[200px]">
                      <div className="flex gap-2 flex-wrap">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => handleAvanzar(envio.id)}
                          title="Avanzar Estado"
                          disabled={envio.estado === 'Cancelado'}
                        >
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => handleDevolver(envio.id)}
                          title="Devolver"
                          disabled={envio.estado !== 'Entregado'}
                        >
                          <Undo2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => handleCancelar(envio.id)}
                          title="Cancelar"
                          disabled={['Entregado', 'Devuelto', 'Cancelado'].includes(envio.estado)}
                        >
                          <Ban className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="destructive"
                          onClick={() => handleEliminar(envio.id)}
                          title="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalles
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg">
                          <DialogHeader>
                            <DialogTitle className="text-xl font-medium">
                              Detalles del Envío #{envio.id}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-2 text-sm text-gray-700">
                            <div>
                              <strong>ID Despacho:</strong> {envio.idDespacho}
                            </div>
                            <div>
                              <strong>Nombre Destinatario:</strong>{" "}
                              {envio.nombreDestinatario}
                            </div>
                            <div>
                              <strong>Dirección:</strong>{" "}
                              {envio.direccionEntrega}
                            </div>
                            <div>
                              <strong>Teléfono:</strong> {envio.telefono}
                            </div>
                            <div>
                              <strong>Ciudad:</strong> {envio.ciudad}
                            </div>
                            <div>
                              <strong>Estado:</strong> {getEstadoBadge(envio.estado)}
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      )}
      <ModalCrearEnvio
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCrear}
      />
    </div>
  );
}
