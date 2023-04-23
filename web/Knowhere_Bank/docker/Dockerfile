FROM ubuntu:22.04

ARG DEBIAN_FRONTEND=noninteractive
ENV TZ=America/New_York

RUN apt-get update -y && apt-get -qq -y install php

COPY . /


EXPOSE 9999/tcp
CMD ["php", "-S","0.0.0.0:9999"]

