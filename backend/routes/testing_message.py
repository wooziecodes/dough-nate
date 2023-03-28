import telegram
import time
import json
import urllib.request
import ssl

from urllib.parse import quote
bot = telegram.Bot(token='6160910424:AAFzXahHVctqzM8zD6mLM-Njqe4_f3x4WJ8')

names = ['weisheng']
TOKEN = "6160910424:AAFzXahHVctqzM8zD6mLM-Njqe4_f3x4WJ8"
CHAT_ID = "-1001982079564"

for name in names:
    message = f"{name}, sings so beautifully, syke this is a test message"
    encoded_message = quote(message)
    url = f"https://api.telegram.org/bot{TOKEN}/sendMessage?chat_id={CHAT_ID}&text={encoded_message}"
    context = ssl.create_default_context()
    context.check_hostname = False
    context.verify_mode = ssl.CERT_NONE
    urllib.request.urlopen(url, context=context)
    # urllib.request.urlopen(url)
    # wait for 7 days
    time.sleep(604800)

