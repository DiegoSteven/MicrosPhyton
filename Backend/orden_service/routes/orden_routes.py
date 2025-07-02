from flask import Blueprint, request, jsonify
from services.orden_service import crear_orden, obtener_orden_por_id, listar_ordenes
from models import Orden, LineaOrden

orden_bp = Blueprint('ordenes', __name__)

@orden_bp.route('/ordenes', methods=['POST'])
def crear():
    data = request.get_json()
    orden = crear_orden(data)
    return jsonify({
        "id": orden.id,
        "idCliente": orden.id_cliente,
        "total": orden.total,
        "estado": orden.estado,
        "lineas": [
            {
                "idProducto": l.id_producto,
                "cantidad": l.cantidad,
                "precioUnitario": l.precio_unitario
            } for l in orden.lineas
        ]
    }), 201
@orden_bp.route('/ordenes/<int:id>', methods=['GET'])
def obtener_orden(id):
    orden = obtener_orden_por_id(id)
    if not orden:
        return jsonify({'error': 'Orden no encontrada'}), 404

    return jsonify({
        "id": orden.id,
        "idCliente": orden.id_cliente,
        "total": orden.total,
        "estado": orden.estado,
        "lineas": [
            {
                "idProducto": l.id_producto,
                "cantidad": l.cantidad,
                "precioUnitario": l.precio_unitario
            } for l in orden.lineas
        ]
    })

@orden_bp.route('/ordenes', methods=['GET'])
def listar():
    ordenes = listar_ordenes()
    return jsonify([
        {
            "id": o.id,
            "idCliente": o.id_cliente,
            "total": o.total,
            "estado": o.estado,
            "lineas": [
                {
                    "idProducto": l.id_producto,
                    "cantidad": l.cantidad,
                    "precioUnitario": l.precio_unitario
                } for l in o.lineas
            ]
        } for o in ordenes
    ])
