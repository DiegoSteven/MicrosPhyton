from flask import Flask
from flask_cors import CORS
from routes.envio_routes import envio_bp

app = Flask(__name__)
CORS(app)
app.config.from_object('config.Config')
app.register_blueprint(envio_bp)

if __name__ == '__main__':
    app.run(debug=True)
