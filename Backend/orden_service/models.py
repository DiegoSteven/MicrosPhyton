from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Orden(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    id_cliente = db.Column(db.Integer, nullable=False)
    total = db.Column(db.Float, default=0.00)
    estado = db.Column(db.String(50), default='Recibido')

    lineas = db.relationship('LineaOrden', backref='orden', cascade="all, delete-orphan")

class LineaOrden(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    id_orden = db.Column(db.Integer, db.ForeignKey('orden.id'), nullable=False)
    id_producto = db.Column(db.Integer, nullable=False)
    cantidad = db.Column(db.Integer, nullable=False)
    precio_unitario = db.Column(db.Float, nullable=False)
