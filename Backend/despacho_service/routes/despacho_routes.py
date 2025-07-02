from flask import Blueprint, request, jsonify
from services.despacho_service import crear_despacho, listar_despachos, avanzar_estado, fallar_despacho

despacho_bp = Blueprint('despacho_bp', __name__)

@despacho_bp.route('/despachos', methods=['POST'])
def crear():
    data = request.get_json()
    despacho = crear_despacho(data)

    if despacho is None:
        return jsonify({"error": "Ya existe un despacho para esta orden"}), 400

    return jsonify({
        "id": despacho.id,
        "idOrden": despacho.id_orden,
        "estado": despacho.estado
    }), 201


@despacho_bp.route('/despachos', methods=['GET'])
def listar():
    lista = listar_despachos()
    return jsonify([
        {
            "id": d.id,
            "idOrden": d.id_orden,
            "estado": d.estado,
            "observaciones": d.observaciones
        } for d in lista
    ])

@despacho_bp.route('/despachos/<int:id>/avanzar', methods=['PUT'])
def avanzar(id):
    despacho = avanzar_estado(id)
    if not despacho:
        return jsonify({"error": "No encontrado"}), 404
    return jsonify({"mensaje": "Estado actualizado", "estado": despacho.estado})

@despacho_bp.route('/despachos/<int:id>/fallar', methods=['PUT'])
def fallar(id):
    despacho = fallar_despacho(id)
    if not despacho:
        return jsonify({"error": "No encontrado"}), 404
    return jsonify({"mensaje": "Despacho marcado como fallido"})
