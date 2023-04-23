FROM ubuntu:18.04
run apt-get -qq update && apt-get install -qq xinetd gcc libseccomp-dev vim build-essential

copy blast_off /opt/blast_off
run chmod 755 /opt/blast_off

copy libblast.so /usr/lib/libblast.so
run chmod 755 /usr/lib/libblast.so


run touch /flag.txt && chmod 644 /flag.txt && echo "shctf{7h1s_i5_Gr0und_C0ntr0l_t0_M4j0r_T0m}" > /flag.txt
copy service.conf /service.conf
copy wrapper /wrapper
run chmod +x /wrapper
copy banner_fail /

ENV LD_LIBRARY_PATH /opt/:$LD_LIBRARY_PATH
EXPOSE 31337/TCP

cmd ["/usr/sbin/xinetd", "-filelog", "-", "-dontfork", "-f", "/service.conf"]

