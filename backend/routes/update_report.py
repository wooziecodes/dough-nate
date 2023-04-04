import requests
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)

CORS(app)

@app.route("/updateReport/<string:reportId>/<string:userType>", methods=["PUT"])
def updateReport(reportId, userType):
    try:
        reportData = requests.get("http://127.0.0.1:5005/reports/" + reportId)
        report = reportData.json()["data"]
        if "listingId" in report:
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
                requests.put("http://127.0.0.1:5001/bakeries/" + bakeryId, json=data)
            
            else:
                print("volunteer")
                volunteerId = listing["volunteerId"]
                volunteerData = requests.get("http://127.0.0.1:5003/volunteers/" + volunteerId)
                volunteer = volunteerData.json()["data"]
                data = {
                    "isBanned": not volunteer["isBanned"]
                }
                requests.put("http://127.0.0.1:5003/volunteers/" + volunteerId, json=data)
            return jsonify({
                    "code": 201,
                    "message": "Report updated successfully.",
                    "data": data
                }), 201
        else:
            if userType == "bakery":
                bakeryData = requests.get("http://127.0.0.1:5001/bakeries/" + report["reportedBy"])
                bakery = bakeryData.json()["data"]
                
                data = {
                    "isBanned": not bakery["isBanned"]
                }
                requests.put("http://127.0.0.1:5001/bakeries/" + report["reportedBy"], json=data)
            
            else:
                print("volunteer")
                volunteerId = listing["volunteerId"]
                volunteerData = requests.get("http://127.0.0.1:5003/volunteers/" + volunteerId)
                volunteer = volunteerData.json()["data"]
                data = {
                    "isBanned": not volunteer["isBanned"]
                }
                requests.put("http://127.0.0.1:5003/volunteers/" + volunteerId, json=data)
            return jsonify({
                    "code": 201,
                    "message": "Report updated successfully.",
                    "data": data
                }), 201
    except:
        return jsonify({
            "code": 500,
            "message": "Error updating report."
        }), 500

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5041, debug=True)
