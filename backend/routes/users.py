from flask import Flask, request, jsonify
from flask_cors import CORS
from firebase_admin import credentials, firestore, initialize_app

app = Flask(__name__)

# Initialize Firestore DB

cred = credentials.Certificate("../key.json")
default_app = initialize_app(cred)
db = firestore.client()
usersCollection = db.collection("users")

CORS(app)

class User(object):
    def __init__(self, uid, id, userType):
        self.uid = uid
        self.id = id
        self.userType = userType

    def json(self):
        return {
            "uid": self.uid,
            "id": self.id,
            "userType": self.userType
        }
    
@app.route("/users/<string:uid>", methods=["GET"])
def get_user_type(uid):
    users = []
    for doc in usersCollection.get():
        user = doc.to_dict()
        users.append(user)
    
    for user in users:
        if user["uid"] == uid:
            return jsonify({
                "code": 200,
                "data": user
            }), 200
    
    return jsonify({
        "code": 404,
        "message": "User not found."
    }), 404

@app.route("/users", methods=["POST"])
def add_user():
    data = request.get_json()
    try:
        usersCollection.document().set(data)
    except:
        return jsonify({
            "code": 500,
            "message": "Error creating user."
        }), 500

    return jsonify({
        "code": 201,
        "message": "Successfully created user.",
        "data": data
    }), 201

if __name__ == "__main__":
        app.run(port=5006, debug=True)