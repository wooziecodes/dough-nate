FROM python:3-slim
WORKDIR /usr/src/app
COPY requirements.txt ./
RUN python -m pip insall --no-cache-dir -r requirements.txt
COPY ./add_listing.py ./key.json .
CMD ["python", "./add_listing.py", "./key.json"]
