from flask import Flask, request, jsonify
from flask_cors import CORS
from firebase_admin import credentials, firestore, initialize_app

app = Flask(__name__)

# Initialize Firestore DB

cred = credentials.Certificate("./key.json")
default_app = initialize_app(cred)
db = firestore.client()
listingsCollection = db.collection("listings")

CORS(app)


@app.route("/listings", methods=["GET"])
def get_listings():
    listings = []
    for doc in listingsCollection.get():
        listing = doc.to_dict()
        listing["id"] = doc.id
        listings.append(listing)
    
    if len(listings) > 0:
        return jsonify({
            "code": 200,
            "data": listings
        }), 200
    return jsonify({
        "code": 404,
        "message": "There are no listings."
    }), 404

@app.route("/listings/<string:listingId>", methods=["GET"])
def find_by_id(listingId):
    if listingId:
        doc_ref = listingsCollection.document(listingId)
        doc = doc_ref.get()
        if not doc.exists:
            return jsonify({
                "code": 404,
                "message": "Listing not found."
            }), 404
        listing = doc.to_dict()
        listing["id"] = doc.id
        return jsonify({
            "code": 200,
            "data": listing
        }), 200
    return jsonify({
        "code": 404,
        "message": "Listing not found."
    }), 404

@app.route("/listings/charity/<string:charityId>", methods = ["GET"])
def get_charity_listings(charityId):
    if charityId:
        listings = []
        docs = listingsCollection.where("charityId", "==", charityId).stream()
        for doc in docs:
            listing = doc.to_dict()
            listing["id"] = doc.id
            listings.append(listing)
        if len(listings) > 0:
            return jsonify({
                    "code": 200,
                    "data": listings
                }), 200
    return jsonify({
        "code": 404,
        "message": "No listings with such charity."
    }), 404

@app.route('/listings/bakery/<string:bakeryId>', methods = ["GET"])
def get_bakery_listings(bakeryId):
    if bakeryId:
        listings = []
        docs =  listingsCollection.where('bakeryId', '==', bakeryId).stream()
        for doc in docs:
            listing = doc.to_dict()
            listing['id'] = doc.id
            listings.append(listing)
        if len(listings) > 0:
            return jsonify({
                    "code": 200,
                    "data": listings
                }), 200
    return jsonify({
        "code": 404,
        "message": "No listings with such bakery."
    }), 404

@app.route('/listings/volunteer/<string:volunteerId>', methods = ['GET'])
def get_volunteer_listings(volunteerId):
    if volunteerId:
        listings = []
        docs = listingsCollection.where('volunteerId', '==', volunteerId).stream()
        for doc in docs:
            listing = doc.to_dict()
            listing['id'] = doc.id
            listings.append(listing)
        if len(listings) > 0:
            return jsonify({
                    "code": 200,
                    "data": listings
                }), 200
    return jsonify({
        "code": 404,
        "message": "No listings with such volunteer."
    }), 404


@app.route("/listings", methods=["POST"])
def add_listing():
    data = request.get_json()
    try:
        listingsCollection.document().set(data)
    except:
        return jsonify({
            "code": 500,
            "message": "Error creating listing."
        }), 500
    
    return jsonify({
        "code": 201,
        "message": "Successfully created listing.",
    }), 201
    
@app.route("/listings/<string:listingId>", methods=["PUT"])
def update_listing(listingId):
    data = request.get_json()
    if not data:
        return jsonify({
            "code": 400,
            "message": "Please provide data to update the listing."
        }), 400
    doc_ref = listingsCollection.document(listingId)
    if not doc_ref.get().exists:
        return jsonify({
            "code": 404,
            "message": "Listing not found."
        }), 404
    doc_ref.update(data)
    return jsonify({
        "code": 200,
        "message": "Listing updated successfully."
    }), 200

@app.route("/listings/<string:listingId>", methods=["DELETE"])
def delete_listing(listingId):
    if listingId:
        doc_ref = listingsCollection.document(listingId)
        if not doc_ref.get().exists:
            return jsonify({
                "code": 404,
                "message": "Listing not found."
            }), 404
        doc_ref.delete()
        return jsonify({
            "code": 200,
            "message": "Listing deleted successfully."
        }), 200
    return jsonify({
        "code": 500,
        "message": "Error deleting listing."
    }), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5004, debug=True)