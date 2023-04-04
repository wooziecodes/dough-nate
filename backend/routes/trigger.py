from flask import Flask, request, jsonify, render_template, send_from_directory
from datetime import datetime, timezone
import os
import time
import pika 
import requests
import json
from flask import Flask, request, jsonify
# from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime, timezone
# from dateutil.parser import parse
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
