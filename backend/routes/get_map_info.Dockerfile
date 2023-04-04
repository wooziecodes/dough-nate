FROM python:3-slim
WORKDIR /usr/src/app
COPY requirements.txt ./
RUN python -m pip insall --no-cache-dir -r requirements.txt
COPY ./get_map_info.py ../key.json .
CMD ["python", "./get_map_info.py", "../key.json"]
