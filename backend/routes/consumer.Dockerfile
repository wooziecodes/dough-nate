FROM python:3-slim
WORKDIR /usr/src/app
COPY requirements.txt ./
RUN python -m pip insall --no-cache-dir -r requirements.txt
COPY ./consumer.py ../key.json .
CMD ["python", "./consumer.py", "../key.json"]