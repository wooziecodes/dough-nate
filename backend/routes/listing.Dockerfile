FROM python:3-slim
WORKDIR /usr/src/app
COPY requirements.txt ./
RUN python3 -m pip install --no-cache-dir -r requirements.txt
COPY ./listing.py ./key.json .
CMD ["python3", "./listing.py", "./key.json"]