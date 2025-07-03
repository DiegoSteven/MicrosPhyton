import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Truck } from "lucide-react";
import ShippingTrackerWithIcons from "./ShippingTrackerWithIcons";
import EstadoEnvioBadge from "./EstadoEnvioBadge";
import { useEnvioEstado } from "@/hooks/useEnvioEstado";
import { Pedido } from "@/types/pedido";

// Estados reales del backend
const estadosOrden = ["Recibido", "Listo para despachar", "Listo para pagar", "Enviado"];

export default function PedidoSeguimientoDialog({ pedido }: { pedido: Pedido }) {
  const { envioInfo, loading } = useEnvioEstado(pedido.id);

  // Función para obtener el estado actual en formato legible
  const getEstadoDisplay = (estado: string) => {
    const estadoLower = estado.toLowerCase();
    switch (estadoLower) {
      case 'recibido':
        return 'Recibido';
      case 'listo para despachar':
        return 'Listo para despachar';
      case 'listo para pagar':
        return 'Listo para pagar';
      case 'enviado':
        return 'Enviado';
      default:
        return estado;
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-blue-600 text-black hover:bg-blue-50"
        >
          <Truck className="h-4 w-4 mr-2" />
          Seguimiento
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium">
            Seguimiento de la Orden #{pedido.id}
          </DialogTitle>
        </DialogHeader>
        <div className="py-6 flex flex-col items-center">
          <ShippingTrackerWithIcons estado={pedido.estado} />
          
          {/* Estado actual */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-2">Estado actual:</p>
            <p className="text-lg font-semibold text-black-600">
              {getEstadoDisplay(pedido.estado)}
            </p>
          </div>

          {/* Estado del envío */}
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600 mb-2">Estado del envío:</p>
            <EstadoEnvioBadge 
              estado={envioInfo?.estado || 'Sin despacho'} 
              loading={loading} 
            />
          </div>

          {/* Etapas del proceso */}
          <div className="flex justify-between w-full mt-6 text-xs text-gray-500">
            {estadosOrden.map((etapa, idx) => {
              const isCurrent = etapa.toLowerCase() === pedido.estado.toLowerCase();
              const isCompleted = estadosOrden.indexOf(etapa) <= estadosOrden.indexOf(getEstadoDisplay(pedido.estado));
              
              return (
                <span
                  key={etapa}
                  className={`text-center ${
                    isCurrent
                      ? "text-black-700 font-semibold"
                      : isCompleted
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                >
                  {etapa}
                </span>
              );
            })}
          </div>

          {/* Información adicional */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg w-full">
            <h4 className="font-medium text-gray-900 mb-2">Información del pedido:</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Cliente:</strong> #{pedido.idCliente}</p>
              <p><strong>Total:</strong> ${pedido.total.toLocaleString()}</p>
              <p><strong>Productos:</strong> {pedido.lineas?.length || 0} artículos</p>
              {envioInfo?.idDespacho && (
                <p><strong>Despacho:</strong> #{envioInfo.idDespacho}</p>
              )}
              {envioInfo?.idEnvio && (
                <p><strong>Envío:</strong> #{envioInfo.idEnvio}</p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
