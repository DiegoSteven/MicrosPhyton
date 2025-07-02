export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
  imagen_url?: string;
}

export interface ProductoNuevo {
  nombre: string;
  precio: number;
  stock: number;
  imagen_url?: string;
}

// Obtener todos los productos
export async function obtenerProductos(): Promise<Producto[]> {
  const res = await fetch("http://localhost:5003/productos", {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Error al obtener productos");
  return res.json();
}

// Crear un nuevo producto
export async function crearProducto(
  producto: ProductoNuevo
): Promise<Producto> {
  const res = await fetch("http://localhost:5003/productos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(producto),
  });
  if (!res.ok) throw new Error("Error al crear producto");
  return res.json();
}
