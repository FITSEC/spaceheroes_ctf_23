from pwn import *

binary = './fuck'

io = process(binary)

io.sendline(b',+++++++++++++>-------------------------->++++++')
io.sendline(b'A')

print(io.recvline().decode('utf-8'))
