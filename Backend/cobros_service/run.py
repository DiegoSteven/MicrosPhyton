from app import create_app
from models import db

import logging  
log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)


app = create_app()

with app.app_context():
    db.create_all()

app.run(debug=True, port=5005)
