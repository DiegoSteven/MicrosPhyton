import pika, json
from config import Config
from models import db, Orden, LineaOrden
from app import create_app

app = create_app()

def iniciar_listener():
    credentials = pika.PlainCredentials(Config.RABBITMQ_USER, Config.RABBITMQ_PASS)
    connection = pika.BlockingConnection(pika.ConnectionParameters(
        host=Config.RABBITMQ_HOST,
        credentials=credentials
    ))

    channel = connection.channel()
    channel.exchange_declare(exchange='pedido.exchange', exchange_type='topic')
    channel.queue_declare(queue='producto.info', durable=True)
    channel.queue_bind(exchange='pedido.exchange', queue='producto.info', routing_key='producto.info')

    def callback(ch, method, properties, body):
        data = json.loads(body)
        print("📥 Respuesta de inventario recibida:", data)

        with app.app_context():
            orden = Orden.query.get(data['idPedido'])
            if not orden:
                print(f"⚠️ Orden {data['idPedido']} no encontrada.")
                return

            total = 0
            for item in data['productos']:
                id_prod = item['idProducto']
                precio = item['precioUnitario']

                linea = LineaOrden.query.filter_by(id_orden=orden.id, id_producto=id_prod).first()
                if linea:
                    linea.precio_unitario = precio
                    total += precio * linea.cantidad

            orden.total = total
            orden.estado = "Listo para despachar"
            db.session.commit()

            print(f"✅ Orden {orden.id} actualizada: total = {total}, estado = 'Listo para despachar'")

    print("🟢 Escuchando evento 'producto.info'...")
    channel.basic_consume(queue='producto.info', on_message_callback=callback, auto_ack=True)
    channel.start_consuming()
