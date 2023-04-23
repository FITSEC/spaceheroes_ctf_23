FROM ubuntu:22.04

run apt-get -qq update && apt-get install -qq xinetd 

copy chal/cardassian-targeting-system /chal
run chmod +x /chal  
copy flag/flag.txt /flag.txt
copy config/* /

run chmod 755 /chal

EXPOSE 31337/TCP

cmd ["/usr/sbin/xinetd", "-filelog", "-", "-dontfork", "-f", "/service.conf"]
