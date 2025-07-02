from flask import Blueprint, request, jsonify
from services.inventario_service import crear_producto, obtener_productos, obtener_producto_por_id

producto_bp = Blueprint('productos', __name__)


@producto_bp.route('/productos', methods=['POST'])
def crear():
    data = request.get_json()
    producto = crear_producto(data)
    return jsonify({
        'id': producto.id,
        'nombre': producto.nombre,
        'precio': producto.precio,
        'stock': producto.stock,
        'imagen_url': producto.imagen_url
    }), 201


@producto_bp.route('/productos', methods=['GET'])
def listar():
    productos = obtener_productos()
    return jsonify([
        {
            'id': p.id,
            'nombre': p.nombre,
            'precio': p.precio,
            'stock': p.stock,
            'imagen_url': p.imagen_url
        } for p in productos
    ])


@producto_bp.route('/productos/<int:id>', methods=['GET'])
def obtener(id):
    producto = obtener_producto_por_id(id)
    if producto:
        return jsonify({
            'id': producto.id,
            'nombre': producto.nombre,
            'precio': producto.precio,
            'stock': producto.stock,
            'image': producto.image,
            'imagen_url': producto.imagen_url
        })
    return jsonify({'error': 'Producto no encontrado'}), 404
