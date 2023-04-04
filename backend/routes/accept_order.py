from flask import Flask, request, jsonify
from flask_cors import CORS
from firebase_admin import credentials, firestore, initialize_app
import requests

app = Flask(__name__)

@app.route("/order/<string:uid>/<string:listingId>", methods=['POST'])
def accept_order(uid, listingId):
    charity_data = requests.get(url="http://localhost:5002/charities/" + uid).json()['data']

    charity_name = charity_data['name']
    data = {
        "charityId": uid,
        "charityName": charity_name,
        "status": "accepted"
    }
    header = {
        "Accept": "application/json",
        "Content-type": "application/json"
    }
    try:
        requests.put(url='http://localhost:5004/listings/'+listingId, headers=header, data=data)
    except:
        return jsonify({
            "code": 500,
            "message": "Error creating bakery."
        }), 500
    return jsonify({
        'code': 200,
        "message": "successful acceptance"
    }), 200

if __name__ == "__main__":
    app.run(port=5038, debug=True)