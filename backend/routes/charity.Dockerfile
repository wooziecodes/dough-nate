FROM python:3-slim
WORKDIR /usr/src/app
COPY requirements.txt ./
RUN python -m pip insall --no-cache-dir -r requirements.txt
COPY ./charity.py ../key.json .
CMD ["python", "./charity.py", "../key.json"]