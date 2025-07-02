from flask import Flask  # 👈 IMPORTANTE
from config import Config
from models import db
from routes.producto_routes import producto_bp

def create_app():
    app = Flask(__name__)  # Ya no fallará aquí
    app.config.from_object(Config)
    db.init_app(app)
    app.register_blueprint(producto_bp)
    return app
