import pika, json
from config import Config

def publicar_evento_despacho_listo(id_orden):
    try:
        credentials = pika.PlainCredentials(Config.RABBITMQ_USER, Config.RABBITMQ_PASS)
        connection = pika.BlockingConnection(pika.ConnectionParameters(
            host=Config.RABBITMQ_HOST,
            credentials=credentials
        ))
        channel = connection.channel()
        channel.exchange_declare(exchange='pedido.exchange', exchange_type='topic')

        mensaje = {"idOrden": id_orden}
        channel.basic_publish(
            exchange='pedido.exchange',
            routing_key='despacho.listo_envio',
            body=json.dumps(mensaje)
        )

        print(f"[✅] Evento publicado: despacho.listo_envio → orden_id={id_orden}")
        connection.close()

    except Exception as e:
        print(f"[❌] Error publicando evento: {e}")
