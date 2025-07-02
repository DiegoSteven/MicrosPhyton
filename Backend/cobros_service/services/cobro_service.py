from models import db, Cobro
from events.publisher import publicar_pago_exitoso

def crear_cobro(data):
    id_orden = data['idOrden']
    monto = data.get('monto', 0.0)

    # ✅ Verificar si ya existe un cobro para esa orden
    cobro_existente = Cobro.query.filter_by(id_orden=id_orden).first()
    if cobro_existente:
        return None  # señal de error

    nuevo = Cobro(id_orden=id_orden, monto=monto)
    db.session.add(nuevo)
    db.session.commit()
    return nuevo

def procesar_pago(cobro_id):
    cobro = Cobro.query.get(cobro_id)
    if not cobro:
        return None

    cobro.estado = 'PAGADO'
    db.session.commit()
    publicar_pago_exitoso(cobro.id_orden)
    return cobro

def marcar_envio(cobro_id):
    cobro = Cobro.query.get(cobro_id)
    if not cobro:
        return None

    cobro.estado = 'ENVIADO_DEL_DESPACHO'
    db.session.commit()
    return cobro

def obtener_cobros():
    return Cobro.query.all()
