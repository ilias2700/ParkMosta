FROM python:3.8
WORKDIR /app
COPY requirements.txt .
RUN rm -f /etc/apt/apt.conf.d/docker-clean
RUN pip install -r requirements.txt
COPY . .