from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Envio(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    idDespacho = db.Column(db.Integer, nullable=False)  
    nombreDestinatario = db.Column(db.String(100), nullable=False)
    direccionEntrega = db.Column(db.String(200), nullable=False)
    telefono = db.Column(db.String(20), nullable=False)
    ciudad = db.Column(db.String(50), nullable=False)
    estado = db.Column(db.String(20), nullable=False, default='EnTransito')

    def cambiar_estado(self, nuevo_estado):
        estados_validos = ['EnTransito', 'Entregado', 'Devuelto', 'Cancelado']
        if nuevo_estado in estados_validos:
            self.estado = nuevo_estado
            return True
        return False

    def avanzar_estado(self):
        estado_actual = estados_envio.get(self.estado)
        if estado_actual:
            estado_actual.siguiente(self)
            return True
        return False

    def devolver(self):
        if self.estado != 'Entregado':
            return False
        self.estado = 'Devuelto'
        return True

    def cancelar(self):
        if self.estado in ['Entregado', 'Devuelto', 'Cancelado']:
            return False
        self.estado = 'Cancelado'
        return True


    def to_dict(self):
        return {
            'id': self.id,
            'idDespacho': self.idDespacho,
            'nombreDestinatario': self.nombreDestinatario,
            'direccionEntrega': self.direccionEntrega,
            'telefono': self.telefono,
            'ciudad': self.ciudad,
            'estado': self.estado
        }

# Patrón State
class EstadoEnvio:
    def siguiente(self, envio):
        pass

    def nombre(self):
        pass

class EnTransito(EstadoEnvio):
    def siguiente(self, envio):
        envio.estado = 'Entregado'

    def nombre(self):
        return 'EnTransito'

class Entregado(EstadoEnvio):
    def siguiente(self, envio):
        envio.estado = 'Devuelto'

    def nombre(self):
        return 'Entregado'

class Devuelto(EstadoEnvio):
    def siguiente(self, envio):
        envio.estado = 'Cancelado'

    def nombre(self):
        return 'Devuelto'

class Cancelado(EstadoEnvio):
    def siguiente(self, envio):
        pass

    def nombre(self):
        return 'Cancelado'

estados_envio = {
    'EnTransito': EnTransito(),
    'Entregado': Entregado(),
    'Devuelto': Devuelto(),
    'Cancelado': Cancelado()
}
