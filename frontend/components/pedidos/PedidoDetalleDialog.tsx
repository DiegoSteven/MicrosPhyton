import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import ProductoLineaDetalle from "./ProductoLineaDetalle";
import { Pedido } from "@/types/pedido";

export default function PedidoDetalleDialog({ pedido }: { pedido: Pedido }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="h-4 w-4 mr-2" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium">
            Detalle de la Orden #{pedido.id}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 mt-4">
          {pedido.lineas.map((linea, idx) => (
            <ProductoLineaDetalle key={idx} linea={linea} />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
