from flask import Flask
from routes.envio_routes import envio_bp

app = Flask(__name__)
app.config.from_object('config.Config')
app.register_blueprint(envio_bp)

if __name__ == '__main__':
    app.run(debug=True)
