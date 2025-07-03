from flask import Flask
from flask_cors import CORS
from models import db
from routes.envio_routes import envio_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')

    CORS(app, origins=["*"]) 
    db.init_app(app)

    app.register_blueprint(envio_bp)
    return app
