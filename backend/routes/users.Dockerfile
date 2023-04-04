FROM python:3-slim
WORKDIR /usr/src/app
COPY requirements.txt ./
RUN python3 -m pip install --no-cache-dir -r requirements.txt
COPY ./users.py ./key.json .
CMD ["python3", "./users.py", "./key.json"]