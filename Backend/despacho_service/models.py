from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Despacho(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    id_orden = db.Column(db.Integer, nullable=False)
    estado = db.Column(db.String(50), default='PENDIENTE')
    observaciones = db.Column(db.Text, nullable=True)
    creado_en = db.Column(db.DateTime, default=datetime.utcnow)
    actualizado_en = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
