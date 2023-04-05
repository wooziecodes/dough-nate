from flask import Flask, request, jsonify
from flask_cors import CORS
from firebase_admin import credentials, firestore, initialize_app
import requests

app = Flask(__name__)

CORS(app)

@app.route("/pickup", methods=['PUT'])
def pickup_order():
    try:
        response = request.get_json()
        uid = response['uid']
        listingId = response['listingId']
        utcDate = response['utcDate']
        volunteer_data = requests.get(url="http://host.docker.internal:5003/volunteers/" + uid).json()['data']

        volunteer_name = volunteer_data['name']
        data = {
            "volunteerId": uid,
            "volunteerName": volunteer_name,
            "status": "pickingup",
            "deliverBy": utcDate
        }
        requests.put(url='http://host.docker.internal:5004/listings/'+listingId, json=data)
    except:
        return jsonify({
            "code": 500,
            "message": "Error picking up order."
        }), 500
    return jsonify({
        'code': 200,
        "message": "Order picked up."
    }), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5033, debug=True)