import pika, json
from config import Config

def publicar_evento(routing_key, mensaje):
    credentials = pika.PlainCredentials(Config.RABBITMQ_USER, Config.RABBITMQ_PASS)
    connection = pika.BlockingConnection(pika.ConnectionParameters(
        host=Config.RABBITMQ_HOST,
        credentials=credentials
    ))
    channel = connection.channel()
    channel.exchange_declare(exchange='pedido.exchange', exchange_type='topic')
    channel.basic_publish(
        exchange='pedido.exchange',
        routing_key=routing_key,
        body=json.dumps(mensaje)
    )
    connection.close()
