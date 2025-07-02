from app import create_app
from models import db
from events.listener import iniciar_listener

app = create_app()

with app.app_context():
    db.create_all()  # Solo crear la estructura

iniciar_listener()
