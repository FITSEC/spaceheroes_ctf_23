FROM ubuntu:latest

ARG DEBIAN_FRONTEND=noninteractive
ENV TZ=America/New_York

RUN apt-get update -y && apt-get -qq -y install socat python3 python3-pip less

COPY . /
RUN python3 -m pip install -r requirements.txt

EXPOSE 5932/tcp
CMD ["python3", "app.py"]

