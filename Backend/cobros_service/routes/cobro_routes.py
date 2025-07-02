from flask import Blueprint, request, jsonify
from services.cobro_service import crear_cobro, procesar_pago, marcar_envio, obtener_cobros

cobro_bp = Blueprint('cobro_bp', __name__)

@cobro_bp.route('/cobros', methods=['POST'])
def crear():
    data = request.get_json()
    cobro = crear_cobro(data)

    if cobro is None:
        return jsonify({"error": "Ya existe un cobro para esta orden"}), 400

    return jsonify({
        "id": cobro.id,
        "idOrden": cobro.id_orden,
        "monto": cobro.monto,
        "estado": cobro.estado
    }), 201

@cobro_bp.route('/cobros/<int:id>/pagar', methods=['PUT'])
def pagar(id):
    cobro = procesar_pago(id)
    if not cobro:
        return jsonify({"error": "Cobro no encontrado"}), 404
    return jsonify({
        "mensaje": "Cobro procesado exitosamente",
        "estado": cobro.estado
    })

@cobro_bp.route('/cobros/<int:id>/enviar', methods=['PUT'])
def enviar(id):
    cobro = marcar_envio(id)
    if not cobro:
        return jsonify({"error": "Cobro no encontrado"}), 404
    return jsonify({
        "mensaje": "Estado actualizado a ENVIADO_DEL_DESPACHO",
        "estado": cobro.estado
    })

@cobro_bp.route('/cobros', methods=['GET'])
def listar():
    lista = obtener_cobros()
    return jsonify([
        {
            "id": c.id,
            "idOrden": c.id_orden,
            "monto": c.monto,
            "estado": c.estado
        } for c in lista
    ])
