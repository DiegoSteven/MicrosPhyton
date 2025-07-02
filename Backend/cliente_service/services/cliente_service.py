from models import db, Cliente

def crear_cliente(data):
    cliente = Cliente(
        nombre=data['nombre'],
        correo=data['correo'],
        telefono=data.get('telefono'),
        direccion=data.get('direccion')
    )
    db.session.add(cliente)
    db.session.commit()
    return cliente

def obtener_clientes():
    return Cliente.query.all()

def obtener_cliente_por_id(cliente_id):
    return Cliente.query.get(cliente_id)

def actualizar_cliente(id, data):
    cliente = Cliente.query.get(id)
    if cliente:
        cliente.nombre = data.get('nombre', cliente.nombre)
        cliente.correo = data.get('correo', cliente.correo)
        cliente.telefono = data.get('telefono', cliente.telefono)
        cliente.direccion = data.get('direccion', cliente.direccion)
        db.session.commit()
        return cliente
    return None
def eliminar_cliente(id):
    cliente = Cliente.query.get(id)
    if cliente:
        db.session.delete(cliente)
        db.session.commit()
        return True
    return False
