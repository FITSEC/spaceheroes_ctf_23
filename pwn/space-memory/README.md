# space-memory

Someone needeed to keep thier mind fresh in space but they seem to be a cheater with secret backdoor... Exploit their backdoor to steal their flag!

Author: [teeman22](https://github.com/tylzars)



## ret2libcs502libm2libc

This challnege allows the 'pwnr' to discover the many C libraries that can be compiled into a binary. You can enter the secret debugger to leak a function pointer to get the base address of the highest library included in the file.
From there, you can use ldd to find the linked libraries and compute the offsets between them to get a LibC base address and call system().

Dockerfile can be compiled with `docker build -t pwn_chal .` in the docker directory.

The file itself can be compiled from the start with `gcc -o 4memory 4memory.c -libcs50 -libm -no-pie`.

`gcc -o space_memory space_memory.c -l:libcs50.so.11 -l:libm.so.6 -l:libc.so.6 -l:ld-linux-x86-64.so.2`

The solve script can be run with Python3 and pwntools installed against a remote binary or a locally running one.
