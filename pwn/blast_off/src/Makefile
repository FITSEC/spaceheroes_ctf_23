docker:
	gcc -shared -fPIC -o libblast.so blast_lib.c 
	gcc blast_off.c -L /opt/ -lblast -o blast_off -fno-stack-protector -no-pie

move:
	chown solardebris blast_off libblast.so
	cp blast_off libblast.so ../docker/
	cp libblast.so /usr/lib/
