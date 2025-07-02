"use client";

import React, { useEffect, useState } from "react";
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
import { Truck, CheckCircle, XCircle, Clock, Eye } from "lucide-react";
import ModalCrearEnvio from "@/components/envios/ModalCrearEnvio";
import { ArrowRight, Undo2, Ban, Trash2 } from "lucide-react";


const estadoColors = {
  EnTransito: "bg-orange-100 text-orange-800",
  Entregado: "bg-green-100 text-green-800",
  Devuelto: "bg-blue-100 text-blue-800",
  Cancelado: "bg-red-100 text-red-800",
};

const estadoIcons = {
  EnTransito: Truck,
  Entregado: CheckCircle,
  Devuelto: CheckCircle,
  Cancelado: XCircle,
};

export default function EnviosPage() {
  const [envios, setEnvios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const cargarEnvios = async () => {
    setLoading(true);
    try {
      const data = await listarEnvios();
      setEnvios(data);
    } catch (e) {
      setError("Error al cargar los envíos");
    }
    setLoading(false);
  };

  useEffect(() => {
    cargarEnvios();
  }, []);

  const handleCrear = async (nuevoEnvio) => {
    try {
      await crearEnvio(nuevoEnvio);
      setMensaje("✅ Envío creado");
      setModalOpen(false);
      cargarEnvios();
    } catch (e) {
      setMensaje("Error al crear el envío");
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Eliminar este envío?")) return;
    try {
      await eliminarEnvio(id);
      setMensaje("🚫 Envío eliminado");
      cargarEnvios();
    } catch (e) {
      setMensaje("Error al eliminar");
    }
  };

  const handleAvanzar = async (id) => {
    try {
      await avanzarEstadoEnvio(id);
      setMensaje("✅ Estado avanzado");
      cargarEnvios();
    } catch (e) {
      setMensaje("No se pudo avanzar el estado");
    }
  };

  const handleDevolver = async (id) => {
    try {
      await devolverEnvio(id);
      setMensaje("🔄 Envío devuelto");
      cargarEnvios();
    } catch (e) {
      setMensaje("No se pudo devolver");
    }
  };

  const handleCancelar = async (id) => {
    try {
      await cancelarEnvio(id);
      setMensaje("❌ Envío cancelado");
      cargarEnvios();
    } catch (e) {
      setMensaje("No se pudo cancelar");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-light text-gray-900">Envíos</h1>
        <p className="text-gray-600">
          Gestiona y revisa el estado de tus envíos
        </p>
      </div>
      <Button onClick={() => setModalOpen(true)} className="mb-4">
        + Nuevo Envío
      </Button>
      {mensaje && (
        <div className="mb-3 text-green-700 font-medium">{mensaje}</div>
      )}
      {loading ? (
        <div>Cargando...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
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
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {envios.map((envio) => {
            const EstadoIcon = estadoIcons[envio.estado] || Clock;
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
                        <Badge className={estadoColors[envio.estado]}>
                          <EstadoIcon className="h-4 w-4 mr-1 inline" />
                          {envio.estado}
                        </Badge>
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
                          title="Avanzar"
                        >
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => handleDevolver(envio.id)}
                          title="Devolver"
                        >
                          <Undo2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => handleCancelar(envio.id)}
                          title="Cancelar"
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
                              <strong>Estado:</strong> {envio.estado}
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
