from datetime import datetime, timezone
import time
from google.api_core.datetime_helpers import DatetimeWithNanoseconds
import requests
import json

from apscheduler.schedulers.background import BackgroundScheduler

def pull_data():
    data = requests.get(url="http://127.0.0.1:5004/listings")
    docs = data.json()['data']
    now = datetime.now(timezone.utc)

    if docs:
        for doc in docs:
            doc_id = doc['id']
            timestamp_str = doc['deliverBy']
            if timestamp_str != "":
                timestamp = datetime.strptime(timestamp_str, "%a, %d %b %Y %H:%M:%S %Z").replace(tzinfo=timezone.utc)
                status = doc['status']
                if timestamp < now and (status == 'pickingup' or status == 'delivering'):
                    print(doc_id + " " + status)
                    doc_id = doc['id']
                    obj = {
                        'listingId': doc_id,
                        'reportStatus': 'reviewing',
                        'reportText': 'Volunteer did not deliver to charity',
                        'reportType': 'volunteer'
                        }
                    requests.put("http://127.0.0.1:5004/listings/"+doc_id, json={'status': 'reported'})
                    requests.post("http://127.0.0.1:5005/reports", json=obj)
                    volunteer_id = doc['volunteerId']
                    ban = {
                        "isBanned" : True
                    }
                    requests.put("http://127.0.0.1:5003/volunteers/" + volunteer_id, json=ban)
                    print('report created')
            else:
                print("Listing "+ doc_id+" not accepted")
    else:
        print('no documents found')

if __name__ == '__main__':
    scheduler = BackgroundScheduler()
    scheduler.add_job(pull_data, 'interval', seconds=5)
    scheduler.start()

    try:
        while True:
            time.sleep(2)
    except (KeyboardInterrupt, SystemExit):
        scheduler.shutdown()