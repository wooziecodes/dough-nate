import pika
import json

RABBITMQ_HOST = "localhost"
connection = pika.BlockingConnection(pika.ConnectionParameters(RABBITMQ_HOST))
channel = connection.channel()

def callback(ch, method, properties, body):
    data = json.loads(body)
    print(f" [x] Received {data}")

channel.basic_consume(queue='timer_ping', on_message_callback=callback, auto_ack=True)
print(' [*] Waiting for messages. To exit press CTRL+C')
channel.start_consuming()
