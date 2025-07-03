from app import app
from models import db

import logging  
log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)


if __name__ == '__main__':
    with app.app_context():
        db.init_app(app)
        db.create_all()
    app.run(port=5008, debug=True)
