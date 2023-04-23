from Crypto.Hash import SHA256
import random, time
from randcrack import RandCrack
from Crypto.Util.number import inverse
from pwn import *

rc = RandCrack()

#p = process("../src/DSAlien.py")
p=remote("spaceheroes-dsalien.chals.io", 443, ssl=True, sni="spaceheroes-dsalien.chals.io")
p.interactive()
#master_x = p.recvline()

# store master parameters
p.recvuntil(b'y = ')
master_y = int(p.recvuntil(b'\n')[:-1].decode('ascii'))
p.recvuntil(b'g = ')
master_g = int(p.recvuntil(b'\n')[:-1].decode('ascii'))
p.recvuntil(b'p = ')
master_p = int(p.recvuntil(b'\n')[:-1].decode('ascii'))
p.recvuntil(b'q = ')
master_q = int(p.recvuntil(b'\n')[:-1].decode('ascii'))
#master_q_bitlength = master_q.bit_length()

#print(master_y)
#print(master_g)
#print(master_p)
#print(master_q)

# Generate and save user key
p.sendline(b'1')
p.recvuntil(b'y = ')
user_y = int(p.recvuntil(b'\n')[:-1].decode('ascii'))
p.recvuntil(b'g = ')
user_g = int(p.recvuntil(b'\n')[:-1].decode('ascii'))
p.recvuntil(b'p = ')
user_p = int(p.recvuntil(b'\n')[:-1].decode('ascii'))
p.recvuntil(b'q = ')
user_q = int(p.recvuntil(b'\n')[:-1].decode('ascii'))
p.recvuntil(b'x = ')
user_x = int(p.recvuntil(b'\n')[:-1].decode('ascii'))

#print(user_y)
#print(user_g)
#print(user_p)
#print(user_q)
#print(user_x)

# Generate and submit output from random
for i in range(624):
	#print(i)
	p.sendline(b'3')
	p.sendline(b'Silly Alien!')
	p.sendline(b'4294967294')
	print(p.recvuntil(b'---K GENERATED FOR SIGNATURE---\n'))
	rand_val = int(p.recvuntil(b'\n')[:-1].decode('utf-8'))
	#print("rand_val: " + str(rand_val))
	rc.submit(rand_val)

# Get message from Ali
p.sendline(b'4')
p.recvuntil(b'I find your conversation boring and disinteresting, simple human.\nR:   ')
r = int(p.recvuntil(b'\n')[:-1].decode('utf-8'))
p.recvuntil(b'S:   ')
s = int(p.recvuntil(b'\n')[:-1].decode('utf-8'))
msg_bytes = bytes("I find your conversation boring and disinteresting, simple human.", "ascii")
h = SHA256.new(msg_bytes).digest()
h = int.from_bytes(h, "big")

# Caculate the K that was used by Ali
k = rc.predict_randrange(2,master_q)
#print(f"our k {k}")
# Calculate master private key with  x = ((s * k) – H(m)) * r-1 mod q
print("calculating x...")
x = (((s*k)-h)*inverse(r,master_q)) % master_q

# Set our DSA Key to Ali's key
p.sendline(b'2')
p.sendline(bytes(str(master_y),'ascii'))
p.sendline(bytes(str(master_g),'ascii'))
p.sendline(bytes(str(master_p),'ascii'))
p.sendline(bytes(str(master_q),'ascii'))
p.sendline(bytes(str(x),'ascii'))

#print("our x: "+str(x))
#print("master x: " + str(master_x))
#print("y: "+str(master_y))
#print("g: "+str(master_g))
#print("p: "+str(master_p))
#print("q: "+str(master_q))

# Send command to take control of the ship and get the flag!
p.sendline(b'3')
p.sendline(b'COMMAND: TAKE CONTROL')
p.sendline(bytes(str(master_q) ,'ascii'))
p.sendline(b'4')
p.interactive()

#https://github.com/tna0y/Python-random-module-cracker
