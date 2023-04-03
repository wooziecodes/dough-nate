import requests
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)

@app.route("/updateReport/<string:reportId>/<string:isBanned>", methods=["PUT"])
def updateReport(reportId, isBanned):
    reportData = requests.get("http://127.0.0.1:5004/listings/" + reportId)
    report = reportData.json()["data"]
    listingId = report["listingId"]
    listingData = requests.get("http://127.0.0.1:5004/listings/" + listingId)
    listing = listingData.json()["data"]
    bakeryId = listing["bakeryId"]
    data = {
        "isBanned": isBanned
    }
    requests.put("http://127.0.0.1:5001/bakeries/" + bakeryId, data=data)

if __name__ == '__main__':
    app.run(port=5009, debug=True)
