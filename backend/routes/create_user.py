import requests
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)

CORS(app)

@app.route("/createUser", methods=["POST"])
def createUser():
    try:
        data = request.get_json()
        userData = data["userData"]
        info = data["info"]

        if info["collection"] == "bakeries":
            requests.post("http://127.0.0.1:5001/bakeries", json=userData)
        elif info["collection"] == "charities":
            requests.post("http://127.0.0.1:5002/charities", json=userData)
        else:
            requests.post("http://127.0.0.1:5003/volunteers", json=userData)
        
        requests.post("http://127.0.0.1:5006/users", json={
            "uid": info["uid"],
            "userType": info["userType"],
            "email": info["email"]
        })
    except:
        return jsonify({
            "code": 500,
            "message": "Error creating user."
        }), 500
    return jsonify({
        "code": 200,
        "message": "User created."
    }), 200

if __name__ == "__main__":
    app.run(port=5037, debug=True)