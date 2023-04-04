FROM python:3-slim
WORKDIR /usr/src/app
COPY requirements.txt ./
RUN python -m pip insall --no-cache-dir -r requirements.txt
COPY ./report_volunteer.py ./key.json .
CMD ["python", "./report_volunteer.py", "./key.json"]
