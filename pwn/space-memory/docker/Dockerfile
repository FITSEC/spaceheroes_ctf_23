FROM kalilinux/kali-rolling

run apt-get -qq update && apt-get install -qq xinetd make gcc

COPY libcs50-11.0.1 /libcs50-11.0.1
RUN cd /libcs50-11.0.1 && make install

COPY space_memory /
run chmod 755 /space_memory

COPY ld-linux-x86-64.so.2 /
COPY libc.so.6 /
COPY libcs50.so.11 /
COPY libm.so.6 /

COPY flag.txt /

COPY service.conf /service.conf
COPY wrapper /wrapper
RUN chmod 755 /wrapper
COPY banner_fail /

EXPOSE 31337/TCP

cmd ["/usr/sbin/xinetd", "-filelog", "-", "-dontfork", "-f", "/service.conf"]
