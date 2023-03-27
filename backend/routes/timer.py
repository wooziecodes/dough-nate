from flask import Flask, request, jsonify, render_template, send_from_directory
from datetime import datetime, timezone
import time
import os
import firebase_admin
import pytz
from firebase_admin import firestore, credentials, initialize_app
from google.api_core.datetime_helpers import DatetimeWithNanoseconds

from apscheduler.schedulers.background import BackgroundScheduler

cred = credentials.Certificate("./key.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

timer = Flask(__name__)

sched = BackgroundScheduler()

@timer.route('/')
def index():
    return render_template('index.html')

@timer.route('/listings', methods=['POST'])
def add_listings():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Please provide data for the new listing.'}), 400

    doc_ref = db.collection('listings').document()
    doc_ref.set(data)
    return jsonify({'message': 'Listing successfully added', 'id': doc_ref.id}), 201

@timer.route('/listings/<string:listingsId>', methods=['GET'])
def read_listing(listingsId):
    doc_ref = db.collections('listings').document(listingsId)
    doc = doc_ref.get()
    if not doc.exists:
        return jsonify({'error': 'Item not found'}), 404
    return jsonify(doc.to_dict()), 200

@timer.route('/listings', methods=['GET'])
def get_listings():
    docs = db.collection('listings').get()
    
    data = []
    for doc in docs:
        toAppend = doc.to_dict()
        toAppend['id'] = doc.id
        data.append(toAppend)
    return jsonify(data), 200

@timer.route('/listings/<string:listingsId>', methods=['PUT'])
def update_listings(listingsId):
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Please provide data to update the listing.'}), 400
    doc_ref = db.collection('listings').document(listingsId)
    if not doc_ref.get().exists:
        return jsonify({'error': 'Listing not found.'}), 404
    doc_ref.update(data)
    return jsonify({'message': 'Listing updated successfully'}), 200

@timer.route('/listings/<string:listingsId>', methods=['DELETE'])
def delete_listings(listingsId):
    doc_ref = db.collection('listings').document(listingsId)
    if not doc_ref.get().exists:
        return jsonify({'error': 'Listing not found.'}), 404
    doc_ref.delete()
    return jsonify({'message': 'Listing deleted successfully'}), 200


def pull_data():
    docs = db.collection('listings').get()
    now = datetime.now()

    if docs:
        for doc in docs:
            
            #handle id and releaseTime
            doc_dict = doc.to_dict()
            doc_id = doc.id
            timestamp_str = doc_dict['releaseTime']

            timestamp = DatetimeWithNanoseconds.fromisoformat(str(timestamp_str))

            # Get current time in UTC
            now = datetime.now(timezone.utc)

            # Compare timestamps
            if timestamp > now:
                print(doc_id)
                # print(timestamp_str)
                # print(now)
                print('The Firestore timestamp is greater than the current time.')
            else:
                print(doc_id)
                print(timestamp_str)
                print(now)
                print('The current time is greater than the Firestone timestamp.')
                delete_listings(doc_id)

    else:
        print('no documents found')


if __name__ == '__main__':
    sched.add_job(id='job1', func=pull_data, trigger='interval', seconds = 3)
    sched.add_job(lambda : sched.print_jobs(),'interval',seconds=3)
    sched.start()
    timer.run(debug=True, use_reloader = False)