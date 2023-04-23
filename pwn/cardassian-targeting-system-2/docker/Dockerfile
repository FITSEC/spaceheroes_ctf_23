FROM ubuntu:22.04

run apt-get -qq update && apt-get install -qq xinetd 

copy chal/chall_patched /chal
copy chal/libc-2.31.so /libc-2.31.so
copy chal/ld-2.31.so /ld-2.31.so
run chmod +x /chal
run ln -s /libc-2.31.so /libc.so.6
copy flag/flag.txt /flag.txt
copy config/* /

run chmod 755 /chal

EXPOSE 31337/TCP

cmd ["/usr/sbin/xinetd", "-filelog", "-", "-dontfork", "-f", "/service.conf"]
