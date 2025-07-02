from flask import Flask
from config import Config
from models import db
from routes.orden_routes import orden_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    db.init_app(app)
    app.register_blueprint(orden_bp)
    return app
