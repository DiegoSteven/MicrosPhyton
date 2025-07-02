from flask import Blueprint, request, jsonify
from models import db, Envio

envio_bp = Blueprint('envio_bp', __name__, url_prefix='/api/envios')


# ✅ Obtener todos los envíos
@envio_bp.route('', methods=['GET'])
def listar_envios():
    envios = Envio.query.all()
    return jsonify([e.to_dict() for e in envios])


# ✅ Obtener envío por ID
@envio_bp.route('/<int:id>', methods=['GET'])
def obtener_envio(id):
    envio = Envio.query.get(id)
    if envio:
        return jsonify(envio.to_dict())
    return jsonify({'error': 'Envío no encontrado'}), 404


# ✅ Crear nuevo envío
@envio_bp.route('', methods=['POST'])
def crear_envio():
    data = request.get_json()
    envio = Envio(
        idDespacho=data['idDespacho'],
        transportista=data['transportista'],
        guiaSeguimiento=data['guiaSeguimiento'],
        estado='EnTransito'
    )
    db.session.add(envio)
    db.session.commit()
    return jsonify(envio.to_dict()), 201


# ✅ Eliminar (lógico)
@envio_bp.route('/<int:id>', methods=['DELETE'])
def eliminar_envio(id):
    envio = Envio.query.get(id)
    if envio:
        envio.eliminado = True
        db.session.commit()
        return jsonify({'message': '🚫 Envío eliminado.'})
    return jsonify({'error': 'Envío no encontrado'}), 404


# ✅ Avanzar estado
@envio_bp.route('/<int:id>/avanzar', methods=['POST'])
def avanzar_estado_envio(id):
    envio = Envio.query.get(id)
    if envio and envio.avanzar_estado():
        db.session.commit()
        return jsonify({'message': '✅ Estado avanzado.'})
    return jsonify({'error': '⚠️ No se pudo avanzar el estado.'}), 400


# ✅ Marcar como devuelto
@envio_bp.route('/<int:id>/devolver', methods=['POST'])
def devolver_envio(id):
    envio = Envio.query.get(id)
    if envio and envio.devolver():
        db.session.commit()
        return jsonify({'message': '🔄 Envío marcado como devuelto.'})
    return jsonify({'error': '⚠️ No se pudo devolver el envío.'}), 400


# ✅ Cancelar envío
@envio_bp.route('/<int:id>/cancelar', methods=['POST'])
def cancelar_envio(id):
    envio = Envio.query.get(id)
    if envio and envio.cancelar():
        db.session.commit()
        return jsonify({'message': '❌ Envío cancelado.'})
    return jsonify({'error': '⚠️ No se pudo cancelar el envío.'}), 400
