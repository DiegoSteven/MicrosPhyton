import { useState, useEffect } from "react";
import { Package } from "lucide-react";
import {
  obtenerProductoPorId,
  Producto,
} from "@/app/api/inventario/inventario_api";

// Componente para mostrar el detalle de una línea de producto con nombre
interface LineaProducto {
  idProducto: number;
  cantidad: number;
  precioUnitario: number;
}

export default function ProductoLineaDetalle({ linea }: { linea: LineaProducto }) {
  const [producto, setProducto] = useState<Producto | null>(null);
  useEffect(() => {
    let activo = true;
    obtenerProductoPorId(linea.idProducto)
      .then((prod: Producto) => {
        if (activo) setProducto(prod);
      })
      .catch(() => setProducto(null));
    return () => {
      activo = false;
    };
  }, [linea.idProducto]);
  return (
    <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4 shadow-sm">
      <div className="flex items-center gap-3">
        {producto && producto.imagen_url ? (
          <img
            src={producto.imagen_url}
            alt={producto.nombre}
            className="h-14 w-14 rounded object-cover border"
          />
        ) : (
          <Package className="h-7 w-7 text-black-500" />
        )}
        <div>
          <div className="font-semibold text-gray-900">
            Producto #{linea.idProducto}
          </div>
          {producto && (
            <div className="text-sm text-gray-700 font-medium">
              {producto.nombre}
            </div>
          )}
          <div className="text-sm text-gray-500">
            Cantidad: <span className="font-medium">{linea.cantidad}</span>
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-base text-gray-700">
          Precio unitario:{" "}
          <span className="font-medium">
            ${linea.precioUnitario.toLocaleString()}
          </span>
        </div>
        <div className="text-lg font-bold text-black">
          Subtotal: {(linea.precioUnitario * linea.cantidad).toLocaleString()}
        </div>
      </div>
    </div>
  );
}
