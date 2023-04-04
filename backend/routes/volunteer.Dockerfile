FROM python:3-slim
WORKDIR /usr/src/app
COPY requirements.txt ./
RUN python -m pip install --no-cache-dir -r requirements.txt
COPY ./volunteer.py ../key.json .
CMD ["python", "./volunteer.py", "../key.json"]