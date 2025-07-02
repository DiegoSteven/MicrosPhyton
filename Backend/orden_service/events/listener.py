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

    # 🟢 Listener producto.info
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

    channel.basic_consume(queue='producto.info', on_message_callback=callback, auto_ack=True)

    # 🔄 Listener despacho.listo_envio
    channel.queue_declare(queue='despacho.listo_envio', durable=True)
    channel.queue_bind(exchange='pedido.exchange', queue='despacho.listo_envio', routing_key='despacho.listo_envio')

    def callback_despacho(ch, method, properties, body):
        data = json.loads(body)
        id_orden = data.get('idOrden')
        print(f"📦 Evento recibido: despacho.listo_envio → orden_id={id_orden}")

        with app.app_context():
            orden = Orden.query.get(id_orden)
            if orden:
                orden.estado = "Listo para pagar"
                db.session.commit()
                print(f"✅ Orden {id_orden} actualizada a estado: 'Listo para pagar'")
            else:
                print(f"⚠️ Orden {id_orden} no encontrada.")

    channel.basic_consume(queue='despacho.listo_envio', on_message_callback=callback_despacho, auto_ack=True)

    # 💰 Listener pago.exitoso
    channel.queue_declare(queue='pago.exitoso', durable=True)
    channel.queue_bind(exchange='pedido.exchange', queue='pago.exitoso', routing_key='pago.exitoso')

    def callback_pago(ch, method, properties, body):
        data = json.loads(body)
        id_orden = data.get('idOrden')
        print(f"💰 Evento recibido: pago.exitoso → orden_id={id_orden}")

        with app.app_context():
            orden = Orden.query.get(id_orden)
            if orden:
                orden.estado = "Enviado"
                db.session.commit()
                print(f"✅ Orden {id_orden} actualizada a estado: 'Enviado'")
            else:
                print(f"⚠️ Orden {id_orden} no encontrada.")

    channel.basic_consume(queue='pago.exitoso', on_message_callback=callback_pago, auto_ack=True)

    print("🟢 Escuchando eventos 'producto.info', 'despacho.listo_envio' y 'pago.exitoso'...")
    channel.start_consuming()
