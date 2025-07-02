from models import db, Despacho
from events.publisher import publicar_evento_despacho_listo

def crear_despacho(data):
    id_orden = data["idOrden"]

    # Verificar si ya hay un despacho con ese id_orden
    existente = Despacho.query.filter_by(id_orden=id_orden).first()
    if existente:
        return None

    nuevo = Despacho(
        id_orden=id_orden,
        observaciones=data.get("observaciones")
    )
    db.session.add(nuevo)
    db.session.commit()
    return nuevo


def listar_despachos():
    return Despacho.query.all()

def avanzar_estado(id):
    despacho = Despacho.query.get(id)
    if not despacho:
        return None

    estado_actual = despacho.estado
    if estado_actual == 'PENDIENTE':
        despacho.estado = 'EN_PREPARACION'
    elif estado_actual == 'EN_PREPARACION':
        despacho.estado = 'LISTO_PARA_ENVIO'
        publicar_evento_despacho_listo(despacho.id_orden)
    elif estado_actual == 'LISTO_PARA_ENVIO':
        return despacho  # Ya es final
    elif estado_actual == 'FALLIDO':
        return despacho  # No avanza
    db.session.commit()
    return despacho

def fallar_despacho(id):
    despacho = Despacho.query.get(id)
    if despacho:
        despacho.estado = 'FALLIDO'
        db.session.commit()
    return despacho
