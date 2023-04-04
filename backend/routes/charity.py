from flask import Flask, request, jsonify
from flask_cors import CORS
from firebase_admin import credentials, firestore, initialize_app

app = Flask(__name__)

# Initialize Firestore DB

cred = credentials.Certificate("../key.json")
default_app = initialize_app(cred)
db = firestore.client()
charityCollection = db.collection("charities")

CORS(app)

@app.route("/charities", methods=["GET"])
def get_charities():
    charities = []
    for doc in charityCollection.get():
        charity = doc.to_dict()
        charity["id"] = doc.id
        charities.append(charity)

    if len(charities) > 0:
        return jsonify({
            "code": 200,
            "data": charities
        }), 200
    return jsonify({
        "code": 404,
        "message": "There are no charities."
    }), 404

@app.route("/charities/<string:charityId>", methods=["GET"])
def find_by_id(charityId):
    if charityId:
        doc_ref = charityCollection.document(charityId)
        doc = doc_ref.get()
        if not doc.exists:
            return jsonify({
                "code": 404,
                "message": "Charity not found."
            }), 404
        charity = doc.to_dict()
        charity["id"] = doc.id
        return jsonify({
            "code": 200,
            "data": charity
        }), 200
    return jsonify({
        "code": 404,
        "message": "Charity not found."
    }), 404

@app.route("/charities", methods=["POST"])
def create_charity():
    data = request.get_json()
    id = data["id"]
    del data["id"]
    try:
        charityCollection.document(id).set(data)
    except:
        return jsonify({
            "code": 500,
            "message": "Error creating charity."
        }), 500

    return jsonify({
        "code": 201,
        "message": "Successfully created charity.",
        "data": data
    }), 201

@app.route("/charities/<string:charityId>", methods=["PUT"])
def update_charity(charityId):
    data = request.get_json()
    if not data:
        return jsonify({
            "code": 400,
            "message": "Please provide data to update the charity."
        }), 400
    doc_ref = charityCollection.document(charityId)
    if not doc_ref.get().exists:
        return jsonify({
            "code": 404,
            "message": "Charity not found."
        }), 404
    doc_ref.update(data)
    return jsonify({
        "code": 200,
        "message": "Charity updated successfully."
    }), 200

@app.route("/charities/<string:charityId>", methods=["DELETE"])
def delete_volunteer(charityId):
    if charityId:
        doc_ref = charityCollection.document(charityId)
        if not doc_ref.get().exists:
            return jsonify({
                "code": 404,
                "message": "Charity not found."
            }), 404
        doc_ref.delete()
        return jsonify({
            "code": 200,
            "message": "Charity deleted successfully."
        }), 200
    return jsonify({
        "code": 500,
        "message": "Error deleting charity."
    }), 500

if __name__ == "__main__":
        app.run(port=5002, debug=True)