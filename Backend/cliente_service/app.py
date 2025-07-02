from flask import Flask
from config import Config
from models import db
from routes.cliente_routes import cliente_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    db.init_app(app)
    app.register_blueprint(cliente_bp)
    return app
