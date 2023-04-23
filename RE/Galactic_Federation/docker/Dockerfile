FROM ubuntu:22.04

run apt-get -qq update && apt-get install -qq xinetd

copy galactic_federation.bin /chal
run chmod 755 /chal

copy flag.txt /
copy federation_logo.txt /

copy service.conf /service.conf
copy wrapper /wrapper
copy banner_fail /

run chmod +x /wrapper

EXPOSE 31337/TCP

cmd ["/usr/sbin/xinetd", "-filelog", "-", "-dontfork", "-f", "/service.conf"]
