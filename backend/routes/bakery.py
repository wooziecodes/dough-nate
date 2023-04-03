from flask import Flask, request, jsonify
from flask_cors import CORS
from firebase_admin import credentials, firestore, initialize_app

app = Flask(__name__)

# Initialize Firestore DB

cred = credentials.Certificate("../key.json")
default_app = initialize_app(cred)
db = firestore.client()
bakeryCollection = db.collection("bakeries")

CORS(app)

class Bakery(object):
    def __init__(self, bakeryName, bakeryEmail, bakeryAddress, bakeryPhone, isBanned):
        self.bakeryName = bakeryName
        self.bakeryEmail = bakeryEmail
        self.bakeryAddress = bakeryAddress
        self.bakeryPhone = bakeryPhone
        self.isBanned = isBanned
    
    def json(self):
        return {
            "bakeryName": self.bakeryName,
            "bakeryEmail": self.bakeryEmail,
            "bakeryAddress": self.bakeryAddress,
            "bakeryPhone": self.bakeryPhone,
            "isBanned": self.isBanned
        }

@app.route("/bakeries", methods=["GET"])
def get_bakeries():
    bakeries = []
    for doc in bakeryCollection.get():
        bakery = doc.to_dict()
        bakery["id"] = doc.id
        bakeries.append(bakery)
    return jsonify({
        "code": 200,
        "data": bakeries
    }), 200

@app.route("/bakeries/<string:bakeryId>", methods=["GET"])
def find_by_id(bakeryId):
    if bakeryId:
        doc_ref = bakeryCollection.document(bakeryId)
        doc = doc_ref.get()
        if not doc.exists:
            return jsonify({
                "code": 404,
                "message": "Bakery not found."
            }), 404
        bakery = doc.to_dict()
        bakery["id"] = doc.id
        return jsonify({
            "code": 200,
            "data": bakery
        }), 200
    return jsonify({
        "code": 404,
        "message": "Bakery not found."
    }), 404

@app.route("/bakeries", methods=["POST"])
def create_bakery():
    data = request.get_json()
    id = data["id"]
    del data["id"]
    try:
        bakeryCollection.document(id).set(data)
    except:
        return jsonify({
            "code": 500,
            "message": "Error creating bakery."
        }), 500
    
    return jsonify({
        "code": 201,
        "message": "Successfully created bakery.",
        "data": data
    }), 201

@app.route("/bakeries/<string:bakeryId>", methods=["PUT"])
def update_bakery(bakeryId):
    if bakeryId:
        data = request.get_json()
        if not data:
            return jsonify({
                "code": 400,
                "message": "Please provide data to update."
            }), 400
        doc_ref = bakeryCollection.document(bakeryId)
        if not doc_ref.get().exists:
            return jsonify({
                "code": 404,
                "message": "Bakery not found."
            }), 404
        doc_ref.update(data)
        return jsonify({
            "code": 200,
            "message": "Bakery updated successfully."
        }), 200

@app.route("/bakeries/<string:bakeryId>", methods=["DELETE"])
def delete_bakery(bakeryId):
    if bakeryId:
        doc_ref = bakeryCollection.document(bakeryId)
        if not doc_ref.get().exists:
            return jsonify({
                "code": 404,
                "message": "Bakery not found."
            }), 404
        doc_ref.delete()
        return jsonify({
            "code": 200,
            "message": "Bakery deleted successfully."
        }), 200
    return jsonify({
        "code": 500,
        "message": "Error deleting bakery."
    }), 500

if __name__ == "__main__":
    app.run(port=5001, debug=True)