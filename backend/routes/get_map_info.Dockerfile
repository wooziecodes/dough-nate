FROM python:3-slim
WORKDIR /usr/src/app
COPY requirements.txt ./
RUN python3 -m pip install --no-cache-dir -r requirements.txt
COPY ./get_map_info.py ./key.json .
CMD ["python3", "./get_map_info.py", "./key.json"]
