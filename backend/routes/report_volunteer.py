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
@app.route('/ping', methods = ['GET'])
def pull_data():
    data = requests.get(url="http://host.docker.internal:5004/listings")
    docs = data.json()['data']
    print(docs)
    now = datetime.now(timezone.utc)

    if docs:
        for doc in docs:
            doc_id = doc['id']
            timestamp_str = doc['deliverBy']
            if timestamp_str != "":                
                timestamp = datetime.strptime(timestamp_str, "%a, %d %b %Y %H:%M:%S %Z").replace(tzinfo=timezone.utc)
                status = doc['status']
                if timestamp < now and (status == 'pickingup' or status == 'delivering'):
                    doc_id = doc['id']
                    volunteer_id = doc['volunteerId']
                    obj = {
                        'listingId': doc_id,
                        'reportText': 'Volunteer did not deliver to charity',
                        'reportedUser': volunteer_id,
                        'reportedBy': 'Admin',
                        'type': 'Report',
                        'userType': 'Volunteer'
                        }
                    requests.put("http://host.docker.internal:5004/listings/"+doc_id, json={'status': 'reported'})
                    requests.post("http://host.docker.internal:5005/reports", json=obj)
                    ban = {
                        "isBanned" : True
                        }
                    requests.put("http://host.docker.internal:5003/volunteers/" + volunteer_id, json=ban)

                    print('report created')
        return jsonify({
            "code": 200,
            "message": "check succesful"
        }), 200
    else:
        print('no documents found')
        return jsonify({
            "code": 404,
            "message": "There are no listings."
        }), 404


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5069, debug=True)
