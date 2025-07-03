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
import { Badge } from "@/components/ui/badge";
import { Eye, RefreshCw, Truck } from "lucide-react";
import PedidoDetalleDialog from "./PedidoDetalleDialog";
import PedidoSeguimientoDialog from "./PedidoSeguimientoDialog";
import EstadoEnvioBadge from "./EstadoEnvioBadge";
import { useEnvioEstado } from "@/hooks/useEnvioEstado";
import { PedidoListaProps } from "@/types/pedido";

// Función para obtener el estilo del badge según el estado
function getEstadoBadge(estado: string) {
  switch (estado.toLowerCase()) {
    case 'recibido':
      return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Recibido</Badge>;
    case 'listo para despachar':
      return <Badge variant="default" className="bg-blue-100 text-blue-800">Listo para despachar</Badge>;
    case 'listo para pagar':
      return <Badge variant="default" className="bg-yellow-100 text-yellow-800">Listo para pagar</Badge>;
    case 'enviado':
      return <Badge variant="default" className="bg-green-100 text-green-800">Enviado</Badge>;
    case 'entregado':
      return <Badge variant="default" className="bg-green-600 text-white">Entregado</Badge>;
    case 'cancelado':
      return <Badge variant="destructive">Cancelado</Badge>;
    default:
      return <Badge variant="outline">{estado}</Badge>;
  }
}

// Componente para una fila de pedido con estado de envío
function PedidoRow({ pedido }: { pedido: any }) {
  const { envioInfo, loading } = useEnvioEstado(pedido.id);

  return (
    <TableRow>
      <TableCell className="font-medium">#{pedido.id}</TableCell>
      <TableCell>{pedido.idCliente}</TableCell>
      <TableCell className="font-medium">${pedido.total.toLocaleString()}</TableCell>
      <TableCell>{getEstadoBadge(pedido.estado)}</TableCell>
      <TableCell>
        <EstadoEnvioBadge 
          estado={envioInfo?.estado || 'Sin despacho'} 
          loading={loading} 
        />
      </TableCell>
      <TableCell className="flex gap-2">
        <PedidoDetalleDialog pedido={pedido} />
        <PedidoSeguimientoDialog pedido={pedido} />
      </TableCell>
    </TableRow>
  );
}

interface PedidoListaPropsExtended extends PedidoListaProps {
  onRefresh?: () => void;
  refreshing?: boolean;
}

export default function PedidoLista({ pedidos, onRefresh, refreshing = false }: PedidoListaPropsExtended) {
  return (
    <Card className="border-gray-100 bg-white">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium">Mis Pedidos</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh || (() => window.location.reload())}
          disabled={refreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Actualizando...' : 'Actualizar'}
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
              <TableHead>Estado Envío</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pedidos.map((pedido) => (
              <PedidoRow key={pedido.id} pedido={pedido} />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
