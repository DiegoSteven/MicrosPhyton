import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, RefreshCw, Truck } from "lucide-react";
import PedidoDetalleDialog from "./PedidoDetalleDialog";
import PedidoSeguimientoDialog from "./PedidoSeguimientoDialog";
import { PedidoListaProps } from "@/types/pedido";

export default function PedidoLista({ pedidos }: PedidoListaProps) {
  return (
    <Card className="border-gray-100 bg-white">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium">Mis Pedidos</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.location.reload()}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualizar
        </Button>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pedido</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pedidos.map((pedido) => (
              <TableRow key={pedido.id}>
                <TableCell>#{pedido.id}</TableCell>
                <TableCell>{pedido.idCliente}</TableCell>
                <TableCell>${pedido.total.toLocaleString()}</TableCell>
                <TableCell>{pedido.estado}</TableCell>
                <TableCell className="flex gap-2">
                  <PedidoDetalleDialog pedido={pedido} />
                  <PedidoSeguimientoDialog pedido={pedido} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
