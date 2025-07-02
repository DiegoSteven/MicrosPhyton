from flask import Flask
from config import Config
from models import db
from routes.cobro_routes import cobro_bp
from flask_cors import CORS


def create_app():
    app = Flask(__name__)
    CORS(app, origins=["*"])
    app.config.from_object(Config)
    db.init_app(app)
    app.register_blueprint(cobro_bp)
    return app
