# OLD CODE (FLASK BASED)
# import os
# from flask import Flask, request, jsonify
# import telegram
# import time
# from firebase_admin import credentials, firestore, initialize_app
# from telegram import Bot

# app = Flask(__name__)

# # Initialize Firestore
# cred = credentials.Certificate('path/to/your/firebase/credentials.json')
# initialize_app(cred)
# db = firestore.client()

# # Telegram Bot Token
# TELEGRAM_TOKEN = os.environ.get("TELEGRAM_TOKEN")
# bot = telegram.Bot(token='6160910424:AAFzXahHVctqzM8zD6mLM-Njqe4_f3x4WJ8')


# @app.route("/timer_ping", methods=['POST'])
# def timer_ping():
#     data = request.get_json()
#     ping = data.get("ping")

#     if ping == "Timer":
#         message = "Ping received from Timer microservice."
#         chat_id = "-1001982079564"  
#         #json fetch bakery info from listingID 
#         #process bakery info, food data 
#         bot.send_message(chat_id=chat_id, text=message)
#         return jsonify({"code": 200, "message": "Ping received successfully."})
#     else:
#         return jsonify({"code": 400, "message": "Invalid ping data."}), 400

# if __name__ == '__main__':
#     app.run(port=5000, debug=True)

import os
import json
import pika
import time
from firebase_admin import credentials, firestore, initialize_app
import telegram

# Initialize Firestore
cred = credentials.Certificate('path/to/your/firebase/credentials.json')
initialize_app(cred)
db = firestore.client()

# Telegram Bot Token
TELEGRAM_TOKEN = os.environ.get("TELEGRAM_TOKEN")
bot = telegram.Bot(token='6160910424:AAFzXahHVctqzM8zD6mLM-Njqe4_f3x4WJ8')

# RabbitMQ Connection
RABBITMQ_HOST = os.environ.get("RABBITMQ_HOST", "localhost")
connection = pika.BlockingConnection(pika.ConnectionParameters(RABBITMQ_HOST))
channel = connection.channel()

channel.queue_declare(queue='timer_ping')


def get_bakery_info(listing_id):
    bakery_ref = db.collection('bakery').document(listing_id)
    bakery = bakery_ref.get()
    return bakery.to_dict()


def process_data(data):
    try:
        bakery_name = data.get('name')
        bakery_address = data.get('address')
   

        # sample summary msg
        summary = f"{bakery_name} at {bakery_address} still has items available."

        return summary

    except Exception as e:
        print(f"Error processing data: {e}")
        return "Error processing bakery data"



def on_message(ch, method, properties, body):
    data = json.loads(body)
    ping = data.get("ping")

    if ping == "Timer":
        message = "Ping received from Timer microservice."
        chat_id = "-1001982079564"
        listing_id = data.get("listing_id")
        bakery_info = get_bakery_info(listing_id)
        processed_data = process_data(bakery_info)
        bot.send_message(chat_id=chat_id, text=message)
        print(" [x] Message sent: %r" % message)
        ch.basic_ack(delivery_tag=method.delivery_tag)
    else:
        print(" [x] Invalid ping data.")


channel.basic_consume(queue='timer_ping', on_message_callback=on_message)

print(" [*] Waiting for messages. To exit press CTRL+C")
channel.start_consuming()
