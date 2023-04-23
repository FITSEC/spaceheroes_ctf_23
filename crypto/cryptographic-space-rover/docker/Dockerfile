FROM ubuntu:latest

ARG DEBIAN_FRONTEND=noninteractive
ENV TZ=America/New_York

RUN apt-get update -y && apt-get -qq -y install socat python3 python3-pip less
RUN python3 -m pip install psutil setproctitle

COPY flag.txt /flag.txt
RUN chown root:root /flag.txt
RUN chmod 644 /flag.txt

COPY checker.txt /checker.txt
RUN chown root:root /checker.txt
RUN chmod 644 /checker.txt

COPY nasa_crypto.py /nasa_crypto.py
RUN chown root:root /nasa_crypto.py
RUN chmod +x /nasa_crypto.py

COPY start.sh /start.sh
RUN chmod 755 /start.sh

EXPOSE 31337/tcp
CMD ["./start.sh"]