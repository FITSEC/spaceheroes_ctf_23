FROM ubuntu:22.04

RUN apt-get update -y && apt-get -qq -y install socat python3 python3-pip
run apt-get install -y python3 python3-pip
run python3 -m pip install pycryptodome

copy DSAlien.py /DSAlien.py
copy flag.txt /flag.txt
copy start.sh /start.sh

run chmod 755 DSAlien.py
run chmod 755 /start.sh

EXPOSE 31337/TCP
cmd ["./start.sh"]
