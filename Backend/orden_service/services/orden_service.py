from models import db, Orden, LineaOrden
from events.publisher import publicar_evento

def crear_orden(data):
    orden = Orden(id_cliente=data['idCliente'])
    db.session.add(orden)
    db.session.flush()  # para obtener ID

    total = 0
    for item in data['lineas']:
        precio = item['precioUnitario']
        linea = LineaOrden(
            id_orden=orden.id,
            id_producto=item['idProducto'],
            cantidad=item['cantidad'],
            precio_unitario=precio
        )
        db.session.add(linea)
        total += precio * item['cantidad']

    orden.total = total
    db.session.commit()

    # Enviar evento a inventario para consulta de stock y precio
    publicar_evento("producto.consultar", {
        "idPedido": orden.id,
        "productos": [
            {"idProducto": l.id_producto, "cantidad": l.cantidad}
            for l in orden.lineas
        ]
    })

    return orden
def obtener_orden_por_id(id):
    return Orden.query.get(id)

def listar_ordenes():
    return Orden.query.all()