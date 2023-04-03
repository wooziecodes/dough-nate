import requests
import pytz
from datetime import datetime, timezone
from apscheduler.schedulers.background import BackgroundScheduler
import time

def pull_data():
    data = requests.get("http://127.0.0.1:5004/listings")
    docs = data.json()['data']
    print(docs)

    if docs:
        for doc in docs:

            doc_id = doc['id']
            timestamp_str = doc['releaseTime']
            timestamp_str = ''.join(timestamp_str.split(','))
            timestamp1 = datetime.strptime(timestamp_str, '%a %d %b %Y %H:%M:%S %Z')
            timestamp = pytz.utc.localize(timestamp1)
            now = datetime.now(timezone.utc)

            if timestamp > now:
                print('The Firestore timestamp is greater than the current time.')
            else:
                print(timestamp_str)
                print(now)
                print('The current time is greater than the Firestone timestamp.')
                requests.delete("http://127.0.0.1:5004/listings/" + doc_id)

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