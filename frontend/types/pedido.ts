export interface LineaPedido {
  idProducto: number;
  cantidad: number;
  precioUnitario: number;
}

export interface Pedido {
  id: number;
  idCliente: number;
  total: number;
  estado: string;
  lineas: LineaPedido[];
}

export interface PedidoNuevo {
  idCliente: number;
  lineas: LineaPedido[];
}


export interface PedidoListaProps {
  pedidos: Pedido[];
}
