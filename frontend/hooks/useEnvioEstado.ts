import { useState, useEffect } from 'react';
import { listarEnvios } from '@/app/api/envios/envios_api';
import { obtenerDespachos } from '@/app/api/despachos/despachos_api';

export interface EnvioInfo {
  estado: string;
  idEnvio?: number;
  idDespacho?: number;
}

interface Envio {
  id: number;
  idDespacho: number;
  estado: string;
}

interface Despacho {
  id: number;
  idOrden: number;
  estado: string;
}

export function useEnvioEstado(pedidoId: number) {
  const [envioInfo, setEnvioInfo] = useState<EnvioInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnvioInfo = async () => {
      try {
        setLoading(true);
        const [envios, despachos] = await Promise.all([
          listarEnvios(),
          obtenerDespachos()
        ]);

        // Buscar despacho asociado al pedido
        const despacho = despachos.find((d: Despacho) => d.idOrden === pedidoId);
        
        if (despacho) {
          // Buscar envío asociado al despacho
          const envio = envios.find((e: Envio) => e.idDespacho === despacho.id);
          
          if (envio) {
            setEnvioInfo({
              estado: envio.estado,
              idEnvio: envio.id,
              idDespacho: despacho.id
            });
          } else {
            // Hay despacho pero no envío
            setEnvioInfo({
              estado: 'Sin envío',
              idDespacho: despacho.id
            });
          }
        } else {
          // No hay despacho
          setEnvioInfo({
            estado: 'Sin despacho'
          });
        }
      } catch (error) {
        console.error('Error al obtener información de envío:', error);
        setEnvioInfo({
          estado: 'Error'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEnvioInfo();
  }, [pedidoId]);

  return { envioInfo, loading };
} 