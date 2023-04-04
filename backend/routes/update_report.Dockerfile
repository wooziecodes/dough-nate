FROM python:3-slim
WORKDIR /usr/src/app
COPY requirements.txt ./
RUN python3 -m pip install --no-cache-dir -r requirements.txt
COPY ./update_report.py ./key.json .
CMD ["python3", "./update_report.py", "./key.json"]