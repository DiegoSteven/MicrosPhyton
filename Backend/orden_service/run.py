from app import create_app
from models import db
from events.listener import iniciar_listener
import threading

import logging  
log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)

app = create_app()

with app.app_context():
    db.create_all()

listener_thread = threading.Thread(target=iniciar_listener, daemon=True)
listener_thread.start()

app.run(debug=True, port=5002)
