import { Badge } from "@/components/ui/badge";
import { Truck, Package, XCircle, Clock } from "lucide-react";

interface EstadoEnvioBadgeProps {
  estado: string;
  loading?: boolean;
}

export default function EstadoEnvioBadge({ estado, loading = false }: EstadoEnvioBadgeProps) {
  if (loading) {
    return (
      <Badge variant="outline" className="bg-gray-50 text-gray-500">
        <Clock className="h-3 w-3 mr-1 animate-pulse" />
        Cargando...
      </Badge>
    );
  }

  switch (estado.toLowerCase()) {
    case 'sin despacho':
      return (
        <Badge variant="outline" className="bg-gray-50 text-gray-600">
          <Package className="h-3 w-3 mr-1" />
          Sin despacho
        </Badge>
      );
    case 'sin envío':
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
          <Package className="h-3 w-3 mr-1" />
          Sin envío
        </Badge>
      );
    case 'entransito':
      return (
        <Badge variant="default" className="bg-orange-100 text-orange-800">
          <Truck className="h-3 w-3 mr-1" />
          En tránsito
        </Badge>
      );
    case 'entregado':
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          <Truck className="h-3 w-3 mr-1" />
          Entregado
        </Badge>
      );
    case 'devuelto':
      return (
        <Badge variant="default" className="bg-blue-100 text-blue-800">
          <Truck className="h-3 w-3 mr-1" />
          Devuelto
        </Badge>
      );
    case 'cancelado':
      return (
        <Badge variant="destructive">
          <XCircle className="h-3 w-3 mr-1" />
          Cancelado
        </Badge>
      );
    case 'error':
      return (
        <Badge variant="destructive">
          <XCircle className="h-3 w-3 mr-1" />
          Error
        </Badge>
      );
    default:
      return (
        <Badge variant="outline">
          <Package className="h-3 w-3 mr-1" />
          {estado}
        </Badge>
      );
  }
} 