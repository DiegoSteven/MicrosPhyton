export interface Cobro {
  id: number;
  idOrden: number;
  monto: number;
  estado: string;
}

const BASE_URL = "http://localhost:5005/cobros"; // Cambia el puerto si es necesario

export async function obtenerCobros(): Promise<Cobro[]> {
  const res = await fetch(BASE_URL, { cache: "no-store" });
  if (!res.ok) throw new Error("Error al obtener cobros");
  return res.json();
}

export async function crearCobro(data: { idOrden: number; monto: number }): Promise<Cobro> {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al crear cobro");
  return res.json();
}

export async function pagarCobro(id: number): Promise<Cobro> {
  const res = await fetch(`${BASE_URL}/${id}/pagar`, { method: "PUT" });
  if (!res.ok) throw new Error("Error al procesar pago");
  return res.json();
}

export async function enviarCobro(id: number): Promise<Cobro> {
  const res = await fetch(`${BASE_URL}/${id}/enviar`, { method: "PUT" });
  if (!res.ok) throw new Error("Error al marcar como enviado");
  return res.json();
} 