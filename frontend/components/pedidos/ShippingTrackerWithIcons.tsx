import { Clock, Package, Truck, CheckCircle, CreditCard } from "lucide-react";

// Estados reales del backend
const estadosOrden = ["Recibido", "Listo para despachar", "Listo para pagar", "Enviado"];

// Iconos correspondientes a cada estado
const shippingIcons = [Clock, Package, CreditCard, CheckCircle];

interface ShippingTrackerWithIconsProps {
  estado: string;
}

function ShippingTrackerWithIcons({ estado }: ShippingTrackerWithIconsProps) {
  // Mapeo de estados del backend a índices
  const getEstadoIndex = (estado: string): number => {
    const estadoLower = estado.toLowerCase();
    switch (estadoLower) {
      case 'recibido':
        return 0;
      case 'listo para despachar':
        return 1;
      case 'listo para pagar':
        return 2;
      case 'enviado':
        return 3;
      default:
        // Si no coincide, buscar por similitud
        return estadosOrden.findIndex(e => 
          e.toLowerCase().includes(estadoLower) || 
          estadoLower.includes(e.toLowerCase())
        );
    }
  };

  const estadoIndex = getEstadoIndex(estado);
  const currentIndex = estadoIndex >= 0 ? estadoIndex : 0;

  return (
    <div className="flex items-center gap-2 min-w-[280px]">
      {estadosOrden.map((etapa, idx) => {
        const Icon = shippingIcons[idx] || Package;
        const active = idx <= currentIndex;
        const isCurrent = idx === currentIndex;
        
        return (
          <div key={etapa} className="flex items-center">
            <div
              className={`rounded-full w-8 h-8 border-2 flex items-center justify-center transition-colors duration-300
                ${
                  isCurrent
                    ? "bg-blue-600 border-blue-600 shadow-lg"
                    : active
                    ? "bg-green-600 border-green-600"
                    : "bg-gray-200 border-gray-300"
                }`}
            >
              <Icon
                className={`h-5 w-5 ${
                  isCurrent || active ? "text-white" : "text-gray-400"
                }`}
              />
            </div>
            {idx < estadosOrden.length - 1 && (
              <div
                className={`h-1 w-8 transition-colors duration-300 ${
                  idx < currentIndex ? "bg-green-600" : "bg-gray-200"
                }`}
              ></div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default ShippingTrackerWithIcons;