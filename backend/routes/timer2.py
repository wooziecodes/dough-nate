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
import json

from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime, timezone
from dateutil.parser import parse


# RabbitMQ Connection
RABBITMQ_HOST = os.environ.get("RABBITMQ_HOST", "localhost")
connection = pika.BlockingConnection(pika.ConnectionParameters(RABBITMQ_HOST))
channel = connection.channel()
channel.queue_declare(queue='timer_ping')

cred = credentials.Certificate("../key.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

timer = Flask(__name__)

sched = BackgroundScheduler()


def pull_data():
    docs = db.collection('listings').get()
    now = datetime.now(timezone.utc)

    if docs:
        for doc in docs:
            doc_dict = doc.to_dict()
            doc_id = doc.id
            # Parse the releaseTime string to a datetime object
            timestamp_str = doc_dict['releaseTime']
            timestamp = datetime.strptime(timestamp_str, "%a, %d %b %Y %H:%M:%S %Z").replace(tzinfo=timezone.utc)

            # Compare timestamps
            if timestamp > now:
                print('The Firestore timestamp is greater than the current time.')
            else:
                print('The current time is greater than the Firestore timestamp.')
                bakery_id = doc_dict['bakeryId']
                print(f"bakeryId: {bakery_id}")  # check the retrieved bakeryId
                bakery_doc = db.collection('bakeries').document(bakery_id).get()
                print(bakery_doc)

                if bakery_doc.exists:
                    bakery_dict = bakery_doc.to_dict()
                    bakery_name = bakery_dict['name']
                    bakery_address = bakery_dict['bakeryAddress']
                    send_timer_ping(doc_id, bakery_name, bakery_address)  # Pass the bakery name and address
                    doc.reference.delete()  # Delete the document
                else:
                    print(f"Bakery document with ID {bakery_id} not found")
    else:
        print('no documents found')



def send_timer_ping(listing_id, bakery_name, bakery_address):
    channel.basic_publish(exchange='',
                          routing_key='timer_ping',
                          body=json.dumps({"ping": "Timer", "listing_id": listing_id, "bakeryName": bakery_name, "bakeryAddress": bakery_address}))


if __name__ == '__main__':
    sched.add_job(id='job1', func=pull_data, trigger='interval', seconds = 3)
    sched.add_job(lambda : sched.print_jobs(),'interval',seconds=3)
    sched.start()
    timer.run(port=5003, debug=True, use_reloader = False)

