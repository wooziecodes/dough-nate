from flask import Flask, request, jsonify, render_template, send_from_directory
from datetime import datetime, timezone
import os
import time
import pika 
import requests
import json
from flask import Flask, request, jsonify
# from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime, timezone
# from dateutil.parser import parse

app = Flask(__name__)

# RabbitMQ Connection
RABBITMQ_HOST = os.environ.get("RABBITMQ_HOST", "localhost")
connection = pika.BlockingConnection(pika.ConnectionParameters(RABBITMQ_HOST))
channel = connection.channel()
channel.queue_declare(queue='timer_ping')

@app.route('/ping', methods = ['GET'])
def pull_data():
    data = requests.get(url="http://host.docker.internal:5004/listings")
    docs = data.json()['data']
    print(docs)
    now = datetime.now(timezone.utc)

    if docs:
        for doc in docs:
            doc_id = doc['id']
            timestamp_str = doc['releaseTime']
            timestamp = datetime.strptime(timestamp_str, "%a, %d %b %Y %H:%M:%S %Z").replace(tzinfo=timezone.utc)
            status = doc['status']
            if timestamp < now and status == "created":
                print('The current time is greater than the Firestore timestamp.')
                bakery_id = doc['bakeryId']
                print(f"bakeryId: {bakery_id}")  # check the retrieved bakeryId
                bakery_doc = requests.get(url="http://host.docker.internal:5001/bakeries/"+bakery_id)
                print(bakery_doc)

                if bakery_doc:
                    bakery_data = bakery_doc.json()['data']
                    bakery_name = bakery_data['name']
                    bakery_address = bakery_data['bakeryAddress']
                    send_timer_ping(doc_id, bakery_name, bakery_address)  # Pass the bakery name and address
                    requests.put(url="http://host.docker.internal:5004/listings/"+doc_id, json={
                        "status": "expired"
                    })
                else:
                    print(f"Bakery document with ID {bakery_id} not found")
                    return jsonify({
                        "code": 404,
                        "message": "There is no such listing."
                    }), 520
        return jsonify({
                        "code": 200,
                        "message": "check successful."
                    }), 200
    else:
        print('no documents found')
        return jsonify({
            "code": 404,
            "message": "There are no listings."
        }), 404



def send_timer_ping(listing_id, bakery_name, bakery_address):
    channel.basic_publish(exchange='',
                          routing_key='timer_ping',
                          body=json.dumps({"ping": "Timer", "listing_id": listing_id, "bakeryName": bakery_name, "bakeryAddress": bakery_address}))


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5070, debug=True)
