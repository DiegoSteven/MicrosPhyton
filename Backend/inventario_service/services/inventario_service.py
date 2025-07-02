from models import db, Producto

def obtener_info_productos(data):
    productos = []
    for item in data.get("productos", []):
        id_producto = item["idProducto"]
        cantidad = item["cantidad"]
        prod = Producto.query.get(id_producto)
        if prod and prod.stock >= cantidad:
            prod.stock -= cantidad
            productos.append({
                "idProducto": prod.id,
                "precioUnitario": prod.precio
            })
    db.session.commit()
    return productos

def crear_producto(data):
    producto = Producto(
        nombre=data['nombre'],
        precio=data['precio'],
        stock=data['stock']
    )
    db.session.add(producto)
    db.session.commit()
    return producto

def obtener_productos():
    return Producto.query.all()

def obtener_producto_por_id(id):
    return Producto.query.get(id)

