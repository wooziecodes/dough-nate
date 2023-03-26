# import asyncio
# from telegram import Bot
# from telegram import Update
# from telegram.error import TimedOut

# TELEGRAM_TOKEN = '6160910424:AAFzXahHVctqzM8zD6mLM-Njqe4_f3x4WJ8'
# bot = Bot(token=TELEGRAM_TOKEN)

# async def get_chat_ids():
#     try:
#         updates = await bot.get_updates(timeout=60)
#     except TimedOut as e:
#         print("Error: Timed out.")
#         return

#     for update in updates:
#         chat_id = update.message.chat_id
#         chat_title = update.message.chat.title
#         print(f"Chat ID: {chat_id}, Chat Title: {chat_title}")

# asyncio.run(get_chat_ids())

import telegram
import time
import json
import urllib.request
import ssl

from urllib.parse import quote
bot = telegram.Bot(token='6160910424:AAFzXahHVctqzM8zD6mLM-Njqe4_f3x4WJ8')
# Get the latest update
# update = bot.getUpdates()

# # Get the chat ID from the update
# chat_id = update.message.chat.id

# print(chat_id)  # Print the chat ID


# while True:
#     for name in names:
#         bot.send_message(chat_id='YOUR_CHAT_ID', text='This, {}!'.format(name))
#         time.sleep(7 * 24 * 60 * 60)  # sleep for 7 days

# loop through the names
# for name in names:
#     # send message to chat
#     requests.get(f"https://api.telegram.org/bot{5917180724:AAFLdEV378hB4hnRyKCTXNpw3Cv2ts6w8z0}/sendMessage?chat_id={1001689476573}&text={name}, You're the IC for this week, good luck amigo.")
#     # wait for 7 days
#     time.sleep(604800)
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

