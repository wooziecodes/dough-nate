from flask import Flask, request, jsonify
from flask_cors import CORS
from firebase_admin import credentials, firestore, initialize_app
import requests

app = Flask(__name__)

CORS(app)

@app.route("/order", methods=['POST'])
def accept_order():
    try:
        response = request.get_json()
        uid = response['uid']
        listingId = response['listingId']
        charity_data = requests.get(url="http://host.docker.internal:5002/charities/" + uid).json()['data']

        charity_name = charity_data['name']
        data = {
            "charityId": uid,
            "charityName": charity_name,
            "status": "accepted"
        }
        requests.put(url='http://host.docker.internal:5004/listings/'+listingId, json=data)
    except:
        return jsonify({
            "code": 500,
            "message": "Error creating accepting order."
        }), 500
    return jsonify({
        'code': 200,
        "message": "Order accepted."
    }), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5038, debug=True)