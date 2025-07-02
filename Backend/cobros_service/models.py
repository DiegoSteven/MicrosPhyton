from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Cobro(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    id_orden = db.Column(db.Integer, nullable=False)
    monto = db.Column(db.Float, nullable=False, default=0.0)
    estado = db.Column(db.String(30), default='EN_ESPERA')
