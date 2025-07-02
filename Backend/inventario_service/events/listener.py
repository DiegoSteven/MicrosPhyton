import pika, json
from config import Config
from services.inventario_service import obtener_info_productos
from events.publisher import publicar_evento
from models import db
from app import create_app  # 👈 IMPORTANTE: importar la app

# Crear instancia de la aplicación Flask
app = create_app()

def iniciar_listener():
    credentials = pika.PlainCredentials(Config.RABBITMQ_USER, Config.RABBITMQ_PASS)
    connection = pika.BlockingConnection(pika.ConnectionParameters(
        host=Config.RABBITMQ_HOST,
        credentials=credentials
    ))

    channel = connection.channel()
    channel.exchange_declare(exchange='pedido.exchange', exchange_type='topic')
    channel.queue_declare(queue='producto.consultar', durable=True)
    channel.queue_bind(exchange='pedido.exchange', queue='producto.consultar', routing_key='producto.consultar')

    def callback(ch, method, properties, body):
        data = json.loads(body)
        print("📥 Consulta recibida:", data)

        # Aquí se activa el contexto de aplicación de Flask
        with app.app_context():
            productos_info = obtener_info_productos(data)

            publicar_evento("producto.info", {
                "idPedido": data["idPedido"],
                "productos": productos_info
            })

            print("✅ Respuesta enviada a 'producto.info'")

    print("🟢 Escuchando eventos en 'producto.consultar'...")
    channel.basic_consume(queue='producto.consultar', on_message_callback=callback, auto_ack=True)
    channel.start_consuming()
