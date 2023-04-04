import requests
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)

CORS(app)

@app.route("/", methods=["GET"])
def hello_world():
    print("hello world")

@app.route("/getMapInfo/<string:listingId>/<string:uid>", methods=["GET"])
def getMapInfo(listingId, uid):
    postals = []
    listingData = requests.get(url="http://host.docker.internal:5004/listings/" + listingId)
    listing = listingData.json()["data"]
    bakeryData = requests.get(url="http://host.docker.internal:5001/bakeries/" + listing["bakeryId"])
    bakery = bakeryData.json()["data"]
    postals.append({
        "postal": bakery["postal"],
        "name": bakery["name"]
    })
    userData = requests.get(url="http://host.docker.internal:5006/users/" + uid)
    user = userData.json()["data"]
    if (user["userType"] != "bakery" or listing["charityId"] != ""):
        charityData = requests.get(url="http://host.docker.internal:5002/charities/" + listing["charityId"])
        charity = charityData.json()["data"]
        postals.append({
            "postal": charity["postal"],
            "name": charity["name"]
        })
        
    return jsonify({
            "code": 200,
            "data": postals
        }), 200

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5030, debug=True)