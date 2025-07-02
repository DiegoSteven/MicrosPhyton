import { PedidoNuevo } from '@/types/pedido';

export async function obtenerPedidos() {
  const res = await fetch('http://localhost:5002/ordenes', {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Error al obtener pedidos');
  return res.json();
}

export async function crearPedido(pedido: PedidoNuevo) {
  const res = await fetch('http://localhost:5002/ordenes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(pedido),
  });
  if (!res.ok) throw new Error('Error al crear pedido');
  return res.json();
} 