import time
import requests
from apscheduler.schedulers.background import BackgroundScheduler

def pull_data():
    requests.get('http://127.0.0.1:5069/ping')
    requests.get('http://127.0.0.1:5070/ping')
    print('pinging')


if __name__ == '__main__':
    scheduler = BackgroundScheduler()
    scheduler.add_job(pull_data, 'interval', seconds=5)
    scheduler.start()

    try:
        while True:
            time.sleep(2)
    except (KeyboardInterrupt, SystemExit):
        scheduler.shutdown()
