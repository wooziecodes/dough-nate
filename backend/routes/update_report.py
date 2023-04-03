import requests
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)

@app.route("/updateReport/<string:reportId>/<string:isBanned>/<string:userType>", methods=["PUT"])
def updateReport(reportId, isBanned, userType):
    reportData = requests.get("http://127.0.0.1:5005/reports/" + reportId)
    report = reportData.json()["data"]
    listingId = report["listingId"]
    listingData = requests.get("http://127.0.0.1:5004/listings/" + listingId)
    listing = listingData.json()["data"]
    data = {
            "isBanned": isBanned == "true"
        }
    if userType == "bakery":
        bakeryId = listing["bakeryId"]
        requests.put("http://127.0.0.1:5001/bakeries/" + bakeryId, data=data)
    else:
        volunteerId = listing["volunteerId"]
        requests.put("http://127.0.0.1:5003/volunteers/" + volunteerId, data=data)

if __name__ == '__main__':
    app.run(port=5009, debug=True)
