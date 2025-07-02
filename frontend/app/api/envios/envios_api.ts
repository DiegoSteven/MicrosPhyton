// Funciones para consumir la API de envíos

const API_URL = 'http://localhost:8088/api/envios';

export async function listarEnvios() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Error al obtener envíos');
  return res.json();
}

export async function obtenerEnvio(id: number) {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error('Error al obtener el envío');
  return res.json();
}

export async function crearEnvio(data: { idDespacho: number; transportista: string; guiaSeguimiento: string; }) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al crear el envío');
  return res.json();
}

export async function eliminarEnvio(id: number) {
  const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Error al eliminar el envío');
  return res.json();
}

export async function avanzarEstadoEnvio(id: number) {
  const res = await fetch(`${API_URL}/${id}/avanzar`, { method: 'POST' });
  if (!res.ok) throw new Error('No se pudo avanzar el estado');
  return res.json();
}

export async function devolverEnvio(id: number) {
  const res = await fetch(`${API_URL}/${id}/devolver`, { method: 'POST' });
  if (!res.ok) throw new Error('No se pudo devolver el envío');
  return res.json();
}

export async function cancelarEnvio(id: number) {
  const res = await fetch(`${API_URL}/${id}/cancelar`, { method: 'POST' });
  if (!res.ok) throw new Error('No se pudo cancelar el envío');
  return res.json();
} 