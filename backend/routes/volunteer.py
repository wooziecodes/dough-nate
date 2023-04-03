from flask import Flask, request, jsonify
from flask_cors import CORS
from firebase_admin import credentials, firestore, initialize_app

app = Flask(__name__)

# Initialize Firestore DB

cred = credentials.Certificate("../key.json")
default_app = initialize_app(cred)
db = firestore.client()
volunteerCollection = db.collection("volunteers")

CORS(app)

class Report(object):
    def __init__(self, volunteerName, volunteerPhone, volunteerEmail, driverPlate, isBanned):
        self.volunteerName = volunteerName
        self.volunteerPhone = volunteerPhone
        self.volunteerEmail = volunteerEmail
        self.driverPlate = driverPlate
        self.isBanned = isBanned

    def json(self):
        return {
            "volunteerName": self.volunteerName,
            "volunteerPhone": self.volunteerPhone,
            "volunteerEmail": self.volunteerEmail,
            "driverPlate": self.driverPlate,
            "isBanned": self.isBanned
        }

@app.route("/volunteers", methods=["GET"])
def get_volunteers():
    volunteers = []
    for doc in volunteerCollection.get():
        vol = doc.to_dict()
        vol["id"] = doc.id
        volunteers.append(vol)
    return jsonify({
        "code": 200,
        "data": volunteers
    }), 200

@app.route("/volunteers/<string:volunteerId>", methods=["GET"])
def find_by_id(volunteerId):
    if volunteerId:
        doc_ref = volunteerCollection.document(volunteerId)
        doc = doc_ref.get()
        if not doc.exists:
            return jsonify({
                "code": 404,
                "message": "Volunteer not found."
            }), 404
        vol = doc.to_dict()
        vol["id"] = doc.id
        return jsonify({
            "code": 200,
            "data": vol
        }), 200
    return jsonify({
        "code": 404,
        "message": "Volunteer not found."
    }), 404

@app.route("/volunteers", methods=["POST"])
def create_volunteer():
    data = request.get_json()
    id = data["id"]
    del data["id"]
    try:
        volunteerCollection.document(id).set(data)
    except:
        return jsonify({
            "code": 500,
            "message": "Error creating volunteer."
        }), 500

    return jsonify({
        "code": 201,
        "message": "Successfully created volunteer.",
        "data": data
    }), 201

@app.route("/volunteers/<string:volunteerId>", methods=["PUT"])
def update_volunteer(volunteerId):
    data = request.get_json()
    if not data:
        return jsonify({
            "code": 400,
            "message": "Please provide data to update the volunteer."
        }), 400
    doc_ref = volunteerCollection.document(volunteerId)
    if not doc_ref.get().exists:
        return jsonify({
            "code": 404,
            "message": "Volunteer not found."
        }), 404
    doc_ref.update(data)
    return jsonify({
        "code": 200,
        "message": "Volunteer updated successfully."
    }), 200

@app.route("/volunteers/<string:volunteerId>", methods=["DELETE"])
def delete_volunteer(volunteerId):
    if volunteerId:
        doc_ref = volunteerCollection.document(volunteerId)
        if not doc_ref.get().exists:
            return jsonify({
                "code": 404,
                "message": "Volunteer not found."
            }), 404
        doc_ref.delete()
        return jsonify({
            "code": 200,
            "message": "Volunteer deleted successfully."
        }), 200
    return jsonify({
        "code": 500,
        "message": "Error deleting volunteer."
    }), 500

if __name__ == "__main__":
        app.run(port=5003, debug=True)