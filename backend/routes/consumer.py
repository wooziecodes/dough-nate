import pika
import json

# RabbitMQ Connection
RABBITMQ_HOST = "localhost"
connection = pika.BlockingConnection(pika.ConnectionParameters(RABBITMQ_HOST))
channel = connection.channel()

channel.queue_declare(queue='timer_ping')

message_data = {
    "ping": "Timer",
    "bakeryName": "Test Bakery",
    "bakeryAddress": "123 Test Street"
}

channel.basic_publish(exchange='', routing_key='timer_ping', body=json.dumps(message_data))
print(" [x] Test message sent")
