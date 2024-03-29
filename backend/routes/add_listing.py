import requests
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)

CORS(app)

@app.route("/addListing", methods=["POST"])
def addListing():
    try:
        data = request.get_json()
        uid = data["uid"]
        breadContent = data["breadContent"]
        allergens = data["allergens"]
        utcDate = data["utcDate"]
        utcDate2 = data["utcDate2"]
        bakeriesData = requests.get("http://host.docker.internal:5001/bakeries/" + uid)
        bakery = bakeriesData.json()["data"]
        bakeryName = bakery["name"]
        newData = {
            "allergens": allergens,
            "bakeryId": uid,
            "bakeryName": bakeryName,
            "breadContent": breadContent,
            "charityId": "",
            "charityName": "",
            "status": "created",
            "createTime": utcDate,
            "releaseTime": utcDate2,
            "deliverBy": "",
            "volunteerId": "",
            "volunteerName": "",
            "hidden": False
        }
        requests.post("http://host.docker.internal:5004/listings", json=newData)
    except:
        return jsonify({
            "code": 500,
            "message": "Error adding listing."
        }), 500
    return jsonify({
            "code": 200,
            "message": "Listing added successfully.",
            "data": data
        }), 200

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5020, debug=True)