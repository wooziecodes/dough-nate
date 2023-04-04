import os
import json
import pika
import time
from firebase_admin import credentials, firestore, initialize_app
import telegram
import telegram.ext
from telegram.ext import Updater


# Initialize Firestore
cred = credentials.Certificate('./key.json')
initialize_app(cred)
db = firestore.client()

# Telegram Bot Token
TELEGRAM_TOKEN = os.environ.get("TELEGRAM_TOKEN")
updater = Updater('6160910424:AAFzXahHVctqzM8zD6mLM-Njqe4_f3x4WJ8')
bot = updater.bot


# RabbitMQ Connection
RABBITMQ_HOST = os.environ.get("RABBITMQ_HOST", "localhost")
connection = pika.BlockingConnection(pika.ConnectionParameters(RABBITMQ_HOST))
channel = connection.channel()

channel.queue_declare(queue='timer_ping')


# def get_bakery_info(bakery_id):
#     print(f"Fetching bakery info for listing_id: {bakery_id}")
#     bakery_ref = db.collection('bakeries').document(bakery_id)
#     bakery = bakery_ref.get()
#     if bakery.exists:
#         print(f"Found bakery info: {bakery.to_dict()}")
#         return bakery.to_dict()
#     else:
#         print(f"No bakery document found for listing_id: {bakery_id}")
#         return None

def process_data(data):
    try:
        bakery_name = data.get('name')
        bakery_address = data.get('address')
        # sample summary msg
        summary = f"Hello dough-naters! {bakery_name} at {bakery_address} still has items available. Grab it before it's gone!"

        return summary

    except Exception as e:
        print(f"Error processing data: {e}")
        return "Error processing bakery data"



# def on_message(ch, method, properties, body):
#     data = json.loads(body)
#     ping = data.get("ping")

#     if ping == "Timer":
#         message = "Ping received from Timer microservice."
#         chat_id = "-1001982079564"
#         listing_id = data.get("listing_id")
#         bakery_id = data.get("bakeryId")  
#         bakery_info = get_bakery_info(bakery_id)
#         processed_data = process_data(bakery_info)
#         bot.send_message(chat_id=chat_id, text=processed_data)
#         print(" [x] Message sent: %r" % message)
#         ch.basic_ack(delivery_tag=method.delivery_tag)
#     else:
#         print(" [x] Invalid ping data.")

def on_message(ch, method, properties, body):
    data = json.loads(body)
    ping = data.get("ping")

    if ping == "Timer":
        message = "Ping received from Timer microservice."
        chat_id = "-1001982079564"
        bakery_data = {
            'name': data.get('bakeryName'),
            'address': data.get('bakeryAddress')
        }
        processed_data = process_data(bakery_data)  # Pass bakery_data directly
        bot.send_message(chat_id=chat_id, text=processed_data)
        print(" [x] Message sent: %r" % message)
        ch.basic_ack(delivery_tag=method.delivery_tag)
    else:
        print(" [x] Invalid ping data.")



channel.basic_consume(queue='timer_ping', on_message_callback=on_message)

print(" [*] Waiting for messages. To exit press CTRL+C")
channel.start_consuming()
