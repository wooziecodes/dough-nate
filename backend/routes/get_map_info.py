import requests
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)

CORS(app)

@app.route("/getMapInfo/<string:listingId>/<string:uid>", methods=["GET"])
def getMapInfo(listingId, uid):
    try:
        print('-1')
        postals = []
        print('0')
        listingData = requests.get("http://listing/listings/" + listingId)
        print('1')
        listing = listingData.json()["data"]
        bakeryData = requests.get("http://bakery/bakeries/" + listing["bakeryId"])
        print('2')
        bakery = bakeryData.json()["data"]
        postals.append({
            "postal": bakery["postal"],
            "name": bakery["name"]
        })
        userData = requests.get("users/users/" + uid)
        print('3')
        user = userData.json()["data"]
        if (user["userType"] != "bakery" or listing["charityId"] != ""):
            charityData = requests.get("http://charity/charities/" + listing["charityId"])
            print('4')

            charity = charityData.json()["data"]
            postals.append({
                "postal": charity["postal"],
                "name": charity["name"]
            })
        print('5')
        
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
    app.run(host="0.0.0.0", port=5030, debug=True)