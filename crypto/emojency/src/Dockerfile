FROM ubuntu:22.04

RUN apt-get update -y && apt-get -qq -y install socat python3 python3-pip
RUN apt-get install -y python3 python3-pip
RUN python3 -m pip install pycryptodome

COPY main.py ./main.py
COPY emojis.py ./emojis.py
COPY primes.py ./primes.py
COPY config.py ./config.py
COPY start.sh ./start.sh

RUN chmod 755 ./main.py
RUN chmod 755 ./emojis.py
RUN chmod 755 ./primes.py
RUN chmod 755 ./config.py
RUN chmod 755 ./start.sh

EXPOSE 31337/TCP
cmd ["./start.sh"]
