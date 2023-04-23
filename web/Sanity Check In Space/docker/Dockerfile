FROM ubuntu:20.04

ARG DEBIAN_FRONTEND=noninteractive
ENV TZ=America/New_York

RUN apt-get update -y \
    && apt-get -qq -y install python3 python3-pip iputils-ping \
    && pip3 install flask

COPY . /app/

WORKDIR /app
EXPOSE 31337/tcp
USER nobody
CMD ["python3", "/app/app.py"]

