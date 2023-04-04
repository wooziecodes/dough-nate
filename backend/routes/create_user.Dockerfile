FROM python:3-slim
WORKDIR /usr/src/app
COPY requirements.txt ./
RUN python -m pip insall --no-cache-dir -r requirements.txt
COPY ./create_used.py ./key.json .
CMD ["python", "./create_user.py", "./key.json"]
