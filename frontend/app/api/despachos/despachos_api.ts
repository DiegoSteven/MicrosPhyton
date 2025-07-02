export interface Despacho {
  id: number;
  idOrden: number;
  estado: string;
  observaciones?: string;
}

const BASE_URL = "http://localhost:5004/despachos";

export async function obtenerDespachos(): Promise<Despacho[]> {
  const res = await fetch(BASE_URL, { cache: "no-store" });
  if (!res.ok) throw new Error("Error al obtener despachos");
  return res.json();
}

export async function crearDespacho(data: {
  idOrden: number;
  observaciones?: string;
}): Promise<Despacho> {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al crear despacho");
  return res.json();
}

export async function avanzarDespacho(id: number): Promise<Despacho> {
  const res = await fetch(`${BASE_URL}/${id}/avanzar`, { method: "PUT" });
  if (!res.ok) throw new Error("Error al avanzar estado del despacho");
  return res.json();
}

export async function fallarDespacho(id: number): Promise<Despacho> {
  const res = await fetch(`${BASE_URL}/${id}/fallar`, { method: "PUT" });
  if (!res.ok) throw new Error("Error al marcar despacho como fallido");
  return res.json();
}
