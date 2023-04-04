from flask import Flask, request, jsonify
from flask_cors import CORS
from firebase_admin import credentials, firestore, initialize_app
import requests

app = Flask(__name__)

CORS(app)

@app.route("/hide_listing/<string:bakeryId>", methods=['GET'])
def hide_listing(bakeryId):
    try:
        listings = requests.get("http://host.docker.internal:5004/listings/bakery/" + bakeryId).json()['data']

        for listing in listings:
            listingId = listing['id']
            if listing['hidden'] == True:
                requests.put("http://host.docker.internal:5004/listings/" + listingId, json={
                    "hidden": False
                })
            else:
                requests.put("http://host.docker.internal:5004/listings/" + listingId, json={
                    "hidden": True
                })
    except:
        return jsonify({
            "code": 500,
            "message": "Error hiding listings."
        }), 500
    return jsonify({
        'code': 200,
        "message": "Listings hidden."
    }), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5056, debug=True)