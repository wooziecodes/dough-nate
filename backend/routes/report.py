from flask import Flask, request, jsonify
from flask_cors import CORS
from firebase_admin import credentials, firestore, initialize_app

app = Flask(__name__)

# Initialize Firestore DB

cred = credentials.Certificate('../key.json')
default_app = initialize_app(cred)
db = firestore.client()
reportsCollection = db.collection('reports')

CORS(app)

class Report(object):
    def __init__(self, listingId, reportStatus, reportText, reportType):
        self.listingId = listingId
        self.reportStatus = reportStatus
        self.reportText = reportText
        self.reportType = reportType

    def json(self):
        return {
            "listingId": self.listingId,
            "reportStatus": self.reportStatus,
            "reportText": self.reportText,
            "reportType": self.reportType
        }

@app.route('/reports', methods=['GET'])
def get_reports():
    reports = []
    for doc in reportsCollection.get():
        report = doc.to_dict()
        report['id'] = doc.id
        reports.append(report)
    return jsonify({
        "code": 200,
        "data": reports
    }), 200

@app.route('/reports/<string:reportId>', methods=['GET'])
def find_by_id(reportId):
    if reportId:
        doc_ref = reportsCollection.document(reportId)
        doc = doc_ref.get()
        if not doc.exists:
            return jsonify({
                "code": 404,
                "message": "Report not found."
            }), 404
        report = doc.to_dict()
        report['id'] = doc.id
        return jsonify({
            "code": 200,
            "data": report
        }), 200
    return jsonify({
        "code": 404,
        "message": "Report not found."
    }), 404

@app.route('/reports', methods=['POST'])
def create_listing():
    data = request.get_json()
    try:
        reportsCollection.document().set(data)
    except:
        return jsonify({
            "code": 500,
            "message": "Error creating report."
        }), 500

    return jsonify({
        "code": 201,
        "message": "Successfully created report",
        "data": data
    }), 201

@app.route('/reports/<string:reportId>', methods=['PUT'])
def update_report(reportId):
    data = request.get_json()
    if not data:
        return jsonify({
            "code": 400,
            "message": "Please provide data to update the report."
        }), 400
    doc_ref = reportsCollection.document(reportId)
    if not doc_ref.get().exists:
        return jsonify({
            "code": 404,
            "message": "Report not found"
        }), 404
    doc_ref.update(data)
    return jsonify({
        "code": 200,
        "message": "Report updated successfully"
    }), 200

@app.route('/reports/<string:reportId>', methods=['DELETE'])
def delete_report(reportId):
    if reportId:
        doc_ref = reportsCollection.document(reportId)
        if not doc_ref.get().exists:
            return jsonify({
                "code": 404,
                "message": "Report not found"
            }), 404
        doc_ref.delete()
        return jsonify({
            "code": 200,
            "message": "Report deleted successfully"
        }), 200
    return jsonify({
        "code": 500,
        "message": "Error deleting report."
    }), 500

if __name__ == '__main__':
        app.run(port=5005, debug=True)