import requests
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)

@app.route("/updateReport/<string:reportId>/<string:userType>", methods=["PUT"])
def updateReport(reportId, userType):
    reportData = requests.get("http://127.0.0.1:5005/reports/" + reportId)
    report = reportData.json()["data"]
    listingId = report["listingId"]
    listingData = requests.get("http://127.0.0.1:5004/listings/" + listingId)
    listing = listingData.json()["data"]
    if userType == "bakery":
        bakeryId = listing["bakeryId"]
        bakeryData = requests.get("http://127.0.0.1:5001/bakeries/" + bakeryId)
        bakery = bakeryData.json()["data"]
        data = {
            "isBanned": not bakery["isBanned"]
        }
        requests.put("http://127.0.0.1:5001/bakeries/" + bakeryId, data=data)
    else:
        volunteerId = listing["volunteerId"]
        volunteerData = requests.get("http://127.0.0.1:5003/volunteers/" + volunteerId)
        volunteer = volunteerData.json()["data"]
        data = {
            "isBanned": not volunteer["isBanned"]
        }
        requests.put("http://127.0.0.1:5003/volunteers/" + volunteerId, data=data)

if __name__ == '__main__':
    app.run(port=5009, debug=True)
