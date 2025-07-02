from flask import Flask
from config import Config
from models import db
from routes.despacho_routes import despacho_bp
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app, origins=["*"]) 
    app.config.from_object(Config)
    db.init_app(app)
    app.register_blueprint(despacho_bp)
    return app
