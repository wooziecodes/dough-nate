import os
from flask import Flask, request, jsonify
from firebase_admin import credentials, firestore, initialize_app
from telegram import Bot
from telegram import Update
from telegram.ext import CommandHandler, MessageHandler, Filters, Dispatcher

# book.py
app = Flask(__name__)

# Initialize Firestore
cred = credentials.Certificate('path/to/your/firebase/credentials.json')
initialize_app(cred)
db = firestore.client()

# Telegram Bot Token
TELEGRAM_TOKEN = os.environ.get("TELEGRAM_TOKEN")
bot = Bot(token=TELEGRAM_TOKEN)
dispatcher = Dispatcher(bot=bot, update_queue=None, use_context=True)

# Firestore collection for books
books_ref = db.collection('books')

class Book:
    def __init__(self, isbn13, title, price, availability):
        self.isbn13 = isbn13
        self.title = title
        self.price = price
        self.availability = availability

    def json(self):
        return {"isbn13": self.isbn13, "title": self.title, "price": self.price, "availability": self.availability}


# Modify the get_all() function
@app.route("/book")
def get_all():
    booklist = [Book(**doc.to_dict()) for doc in books_ref.stream()]
    if len(booklist):
        return jsonify(
            {
                "code": 200,
                "data": {
                    "books": [book.json() for book in booklist]
                }
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": "There are no books."
        }
    ), 404

# Modify the find_by_isbn13() function
@app.route("/book/<string:isbn13>")
def find_by_isbn13(isbn13):
    book_doc = books_ref.document(isbn13).get()
    if book_doc.exists:
        return jsonify(
            {
                "code": 200,
                "data": Book(**book_doc.to_dict()).json()
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": "Book not found."
        }
    ), 404

# Modify the create_book() function
@app.route("/book/<string:isbn13>", methods=['POST'])
def create_book(isbn13):
    if books_ref.document(isbn13).get().exists:
        return jsonify(
            {
                "code": 400,
                "data": {
                    "isbn13": isbn13
                },
                "message": "Book already exists."
            }
        ), 400

    data = request.get_json()
    book = Book(isbn13, **data)

    try:
        books_ref.document(isbn13).set(book.json())
    except:
        return jsonify(
            {
                "code": 500,
                "data": {
                    "isbn13": isbn13
                },
                "message": "An error occurred creating the book."
            }
        ), 500

    return jsonify(
        {
            "code": 201,
            "data": book.json()
        }
    ), 201

# New route for receiving messages from other microservices
@app.route("/incoming_message", methods=['POST'])
def incoming_message():
    data = request.get_json()

    if data:
        message = data.get('message')
        if message:
            chat_id = os.environ.get("TELEGRAM_CHAT_ID")  # You can replace this with a specific chat ID
            bot.send_message(chat_id=chat_id, text=message)

            return jsonify({"code": 200, "message": "Message sent to Telegram"}), 200
        else:
            return jsonify({"code": 400, "message": "Message is missing"}), 400
    else:
        return jsonify({"code": 400, "message": "Invalid request data"}), 400


if __name__ == '__main__':
    app.run(port=5000, debug=True)
