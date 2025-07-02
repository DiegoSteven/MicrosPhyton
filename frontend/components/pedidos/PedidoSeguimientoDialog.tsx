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
import { Pedido } from "@/types/pedido";
const estadosOrden = ["Recibido", "Preparando", "Enviado", "Entregado"];

export default function PedidoSeguimientoDialog({ pedido }: { pedido: Pedido }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-blue-600 text-blue-600"
        >
          <Truck className="h-4 w-4 mr-2" />
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
          <div className="flex justify-between w-full mt-4 text-xs text-gray-500">
            {estadosOrden.map((etapa, idx) => (
              <span
                key={etapa}
                className={
                  idx ===
                  estadosOrden.findIndex(
                    (e) => e.toLowerCase() === pedido.estado.toLowerCase()
                  )
                    ? "text-blue-700 font-semibold"
                    : ""
                }
              >
                {etapa}
              </span>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
