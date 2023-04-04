import requests
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)

CORS(app)

@app.route("/getMapInfo/<string:listingId>/<string:uid>", methods=["GET"])
def getMapInfo(listingId, uid):
    try:
        postals = []
        listingData = requests.get("http://127.0.0.1:5004/listings/" + listingId)
        listing = listingData.json()["data"]
        bakeryData = requests.get("http://127.0.0.1:5001/bakeries/" + listing["bakeryId"])
        bakery = bakeryData.json()["data"]
        postals.append({
            "postal": bakery["postal"],
            "name": bakery["name"]
        })
        userData = requests.get("http://127.0.0.1:5006/users/" + uid)
        user = userData.json()["data"]
        if (user["userType"] != "bakery" or listing["charityId"] != ""):
            charityData = requests.get("http://127.0.0.1:5002/charities/" + listing["charityId"])
            charity = charityData.json()["data"]
            postals.append({
                "postal": charity["postal"],
                "name": charity["name"]
            })
    except:
        return jsonify({
            "code": 500,
            "message": "Error getting postals."
        }), 500
    return jsonify({
            "code": 200,
            "data": postals
        }), 200

if __name__ == '__main__':
    app.run(port=5030, debug=True)