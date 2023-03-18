import os
from flask import Flask, request, jsonify
import telegram
import time
from firebase_admin import credentials, firestore, initialize_app
from telegram import Bot

app = Flask(__name__)

# Initialize Firestore
cred = credentials.Certificate('path/to/your/firebase/credentials.json')
initialize_app(cred)
db = firestore.client()

# Telegram Bot Token
TELEGRAM_TOKEN = os.environ.get("TELEGRAM_TOKEN")
bot = telegram.Bot(token='6160910424:AAFzXahHVctqzM8zD6mLM-Njqe4_f3x4WJ8')


@app.route("/timer_ping", methods=['POST'])
def timer_ping():
    data = request.get_json()
    ping = data.get("ping")

    if ping == "Timer":
        message = "Ping received from Timer microservice."
        chat_id = "-1001982079564"
        bot.send_message(chat_id=chat_id, text=message)
        return jsonify({"code": 200, "message": "Ping received successfully."})
    else:
        return jsonify({"code": 400, "message": "Invalid ping data."}), 400

if __name__ == '__main__':
    app.run(port=5000, debug=True)
