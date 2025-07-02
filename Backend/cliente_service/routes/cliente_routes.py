from flask import Blueprint, request, jsonify
from services.cliente_service import (
    crear_cliente,
    obtener_clientes,
    obtener_cliente_por_id,
    actualizar_cliente,
    eliminar_cliente
)
cliente_bp = Blueprint('clientes', __name__)

@cliente_bp.route('/clientes', methods=['POST'])
def crear():
    data = request.get_json()
    cliente = crear_cliente(data)
    return jsonify({
        'id': cliente.id,
        'nombre': cliente.nombre,
        'correo': cliente.correo,
        'telefono': cliente.telefono,
        'direccion': cliente.direccion
    }), 201

@cliente_bp.route('/clientes', methods=['GET'])
def listar():
    clientes = obtener_clientes()
    return jsonify([
        {
            'id': c.id,
            'nombre': c.nombre,
            'correo': c.correo,
            'telefono': c.telefono,
            'direccion': c.direccion
        } for c in clientes
    ])

@cliente_bp.route('/clientes/<int:id>', methods=['GET'])
def obtener(id):
    cliente = obtener_cliente_por_id(id)
    if cliente:
        return jsonify({
            'id': cliente.id,
            'nombre': cliente.nombre,
            'correo': cliente.correo,
            'telefono': cliente.telefono,
            'direccion': cliente.direccion
        })
    return jsonify({'error': 'Cliente no encontrado'}), 404
@cliente_bp.route('/clientes/<int:id>', methods=['PUT'])
def actualizar(id):
    data = request.get_json()
    cliente = actualizar_cliente(id, data)
    if cliente:
        return jsonify({
            'id': cliente.id,
            'nombre': cliente.nombre,
            'correo': cliente.correo,
            'telefono': cliente.telefono,
            'direccion': cliente.direccion
        })
    return jsonify({'error': 'Cliente no encontrado'}), 404
@cliente_bp.route('/clientes/<int:id>', methods=['DELETE'])
def eliminar(id):
    if eliminar_cliente(id):
        return jsonify({'mensaje': 'Cliente eliminado correctamente'})
    return jsonify({'error': 'Cliente no encontrado'}), 404
