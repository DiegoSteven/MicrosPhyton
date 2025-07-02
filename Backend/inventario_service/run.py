from app import create_app
from models import db
from events.listener import iniciar_listener
import threading

app = create_app()

# Crear la base de datos (estructura solamente)
with app.app_context():
    db.create_all()

# Lanzar el listener en un hilo aparte
listener_thread = threading.Thread(target=iniciar_listener, daemon=True)
listener_thread.start()

# Iniciar Flask (puerto HTTP)
app.run(debug=True, port=5003)
