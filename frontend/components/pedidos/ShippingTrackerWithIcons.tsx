
import { Clock, Package, Truck, CheckCircle } from "lucide-react";

// Asegúrate de definir los estados y exportar el componente correctamente
const estadosOrden = ["Recibido", "Preparando", "Enviado", "Entregado"];

// Shipping tracker con iconos (sin doble importación)
const shippingIcons = [Clock, Package, Truck, CheckCircle];

interface ShippingTrackerWithIconsProps {
  estado: string;
}

function ShippingTrackerWithIcons({ estado }: ShippingTrackerWithIconsProps) {
  const estadoIndex = estadosOrden.findIndex(
    (e) => e.toLowerCase() === estado.toLowerCase()
  );
  return (
    <div className="flex items-center gap-2 min-w-[220px]">
      {estadosOrden.map((etapa, idx) => {
        const Icon = shippingIcons[idx] || Package;
        const active = idx <= estadoIndex;
        return (
          <div key={etapa} className="flex items-center">
            <div
              className={`rounded-full w-8 h-8 border-2 flex items-center justify-center transition-colors duration-300
                ${
                  active
                    ? "bg-blue-600 border-blue-600"
                    : "bg-gray-200 border-gray-300"
                }`}
            >
              <Icon
                className={`h-5 w-5 ${active ? "text-white" : "text-gray-400"}`}
              />
            </div>
            {idx < estadosOrden.length - 1 && (
              <div
                className={`h-1 w-8 transition-colors duration-300 ${
                  idx < estadoIndex ? "bg-blue-600" : "bg-gray-200"
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