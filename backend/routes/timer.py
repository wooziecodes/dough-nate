from flask import Flask, request, jsonify, render_template, send_from_directory
from datetime import datetime, timezone
import time
import os
import firebase_admin
import pytz
import pika 
from firebase_admin import firestore, credentials, initialize_app
from google.api_core.datetime_helpers import DatetimeWithNanoseconds
import requests

from apscheduler.schedulers.background import BackgroundScheduler

# RabbitMQ Connection
RABBITMQ_HOST = os.environ.get("RABBITMQ_HOST", "localhost")
connection = pika.BlockingConnection(pika.ConnectionParameters(RABBITMQ_HOST))
channel = connection.channel()
channel.queue_declare(queue='timer_ping')

cred = credentials.Certificate("./key.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

timer = Flask(__name__)

sched = BackgroundScheduler()


def pull_data():
    data = requests.get("http://127.0.0.1:5004/listings")
    docs = data.json()['data']
    print(docs)
    # docs = db.collection('listings').get()
    # now = datetime.now()

    if docs:
        for doc in docs:
            #handle id and releaseTime
            # doc_dict = doc.to_dict()
            doc_id = doc['id']
            timestamp_str = doc['releaseTime']
            
            # timestamp = DatetimeWithNanoseconds.fromisoformat()
            # Fri 31 Mar 2023 08:28:07 GMT
            timestamp_str = ''.join(timestamp_str.split(','))
            timestamp1 = datetime.strptime(timestamp_str, '%a %d %b %Y %H:%M:%S %Z')
            timestamp = pytz.utc.localize(timestamp1)
            # print(datetime_object)
            # timestamp = DatetimeWithNanoseconds.fromisoformat(str(timestamp_str))

            # Get current time in UTC
            now = datetime.now(timezone.utc)

            # Compare timestamps
            if timestamp > now:
                # print(doc_id)
                # print(timestamp_str)
                # print(now)
                print('The Firestore timestamp is greater than the current time.')
            else:
                # print(doc_id)
                print(timestamp_str)
                print(now)

                print('The current time is greater than the Firestone timestamp.')
                send_timer_ping(doc_id)  # Call send_timer_ping() with the document ID
                #send listing to telebot
                # formatted_data = {
                #     "bakeryName": doc['bakeryName'],
                #     "breadContent": doc['breadContent'],
                #     "allergens": doc['allergens']
                # }
                # requests.post("http://127.0.0.1:5000/timer_ping", data=jsonify({
                #     "code": 69,
                #     "data": formatted_data
                # }))
                requests.delete("http://127.0.0.1:5004/listings/" + doc_id)

    else:
        print('no documents found')


#listing id
def send_timer_ping(listing_id):
    data = {
        "ping": "Timer",
        "listing_id": listing_id
    }
    channel.basic_publish(exchange='', routing_key='timer_ping', body=json.dumps(data))
    print(" [x] Sent %r" % data)

if __name__ == '__main__':
    sched.add_job(id='job1', func=pull_data, trigger='interval', seconds = 3)
    sched.add_job(lambda : sched.print_jobs(),'interval',seconds=3)
    sched.start()
    timer.run(port=5003, debug=True, use_reloader = False)





# @timer.route('/')
# def index():
#     return render_template('index.html')

# @timer.route('/listings', methods=['POST'])
# def add_listings():
#     data = request.get_json()
#     if not data:
#         return jsonify({'error': 'Please provide data for the new listing.'}), 400

#     doc_ref = db.collection('listings').document()
#     doc_ref.set(data)
#     return jsonify({'message': 'Listing successfully added', 'id': doc_ref.id}), 201

# @timer.route('/listings/<string:listingsId>', methods=['GET'])
# def read_listing(listingsId):
#     doc_ref = db.collections('listings').document(listingsId)
#     doc = doc_ref.get()
#     if not doc.exists:
#         return jsonify({'error': 'Item not found'}), 404
#     return jsonify(doc.to_dict()), 200

# @timer.route('/listings', methods=['GET'])
# def get_listings():
#     docs = db.collection('listings').get()
    
#     data = []
#     for doc in docs:
#         toAppend = doc.to_dict()
#         toAppend['id'] = doc.id
#         data.append(toAppend)
#     return jsonify(data), 200

# @timer.route('/listings/<string:listingsId>', methods=['PUT'])
# def update_listings(listingsId):
#     data = request.get_json()
#     if not data:
#         return jsonify({'error': 'Please provide data to update the listing.'}), 400
#     doc_ref = db.collection('listings').document(listingsId)
#     if not doc_ref.get().exists:
#         return jsonify({'error': 'Listing not found.'}), 404
#     doc_ref.update(data)
#     return jsonify({'message': 'Listing updated successfully'}), 200

# @timer.route('/listings/<string:listingsId>', methods=['DELETE'])
# def delete_listings(listingsId):
#     doc_ref = db.collection('listings').document(listingsId)
#     if not doc_ref.get().exists:
#         return jsonify({'error': 'Listing not found.'}), 404
#     doc_ref.delete()
#     return jsonify({'message': 'Listing deleted successfully'}), 200
