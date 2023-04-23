FROM ubuntu:latest

ARG DEBIAN_FRONTEND=noninteractive
ENV TZ=America/New_York

RUN apt-get update -y && apt-get -qq -y install python3 python3-pip

COPY . /
RUN python3 -m pip install Flask

EXPOSE 8661/tcp
ENTRYPOINT ["python3", "app.py"]
