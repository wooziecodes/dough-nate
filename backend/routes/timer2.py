from datetime import datetime, timezone
import os
import time
import pika 
import requests
import json

from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime, timezone
# from dateutil.parser import parse


# RabbitMQ Connection
RABBITMQ_HOST = os.environ.get("RABBITMQ_HOST", "localhost")
connection = pika.BlockingConnection(pika.ConnectionParameters(RABBITMQ_HOST))
channel = connection.channel()
channel.queue_declare(queue='timer_ping')

# cred = credentials.Certificate("../key.json")
# firebase_admin.initialize_app(cred)
# db = firestore.client()

# timer = Flask(__name__)

# sched = BackgroundScheduler()


def pull_data():
    data = requests.get(url="http://127.0.0.1:5004/listings")
    # docs = db.collection('listings').get()
    docs = data.json()['data']
    print(docs)
    now = datetime.now(timezone.utc)

    if docs:
        for doc in docs:
            # doc_dict = doc.to_dict()
            doc_id = doc['id']
            # Parse the releaseTime string to a datetime object
            timestamp_str = doc['releaseTime']
            timestamp = datetime.strptime(timestamp_str, "%a, %d %b %Y %H:%M:%S %Z").replace(tzinfo=timezone.utc)

            # Compare timestamps
            if timestamp > now:
                print('The Firestore timestamp is greater than the current time.')
            else:
                print('The current time is greater than the Firestore timestamp.')
                bakery_id = doc['bakeryId']
                print(f"bakeryId: {bakery_id}")  # check the retrieved bakeryId
                bakery_doc = requests.get(url="http://127.0.0.1:5001/bakeries/"+bakery_id)
                # bakery_doc = db.collection('bakeries').document(bakery_id).get()
                print(bakery_doc)

                if bakery_doc:
                    # bakery_dict = bakery_doc.to_dict()
                    bakery_data = bakery_doc.json()['data']
                    bakery_name = bakery_data['name']
                    bakery_address = bakery_data['bakeryAddress']
                    send_timer_ping(doc_id, bakery_name, bakery_address)  # Pass the bakery name and address
                    # requests.delete("http://127.0.0.1:5004/listings/"+ doc_id)
                    # doc.reference.delete()  # Delete the document
                else:
                    print(f"Bakery document with ID {bakery_id} not found")
    else:
        print('no documents found')



def send_timer_ping(listing_id, bakery_name, bakery_address):
    channel.basic_publish(exchange='',
                          routing_key='timer_ping',
                          body=json.dumps({"ping": "Timer", "listing_id": listing_id, "bakeryName": bakery_name, "bakeryAddress": bakery_address}))


if __name__ == '__main__':
    scheduler = BackgroundScheduler()
    scheduler.add_job(pull_data, 'interval', seconds=5)
    scheduler.start()

    try:
        while True:
            time.sleep(2)
    except (KeyboardInterrupt, SystemExit):
        scheduler.shutdown()
# if __name__ == '__main__':
#     sched.add_job(id='job1', func=pull_data, trigger='interval', seconds = 3)
#     sched.add_job(lambda : sched.print_jobs(),'interval',seconds=3)
#     sched.start()
    # timer.run(port=5003, debug=True, use_reloader = False)

