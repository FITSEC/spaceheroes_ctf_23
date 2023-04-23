from pwn import *
import time
context.log_level = 'INFO'

binary = args.BIN
context.terminal = ["tmux", "splitw", "-h"]

# We can see that if we get a letter correct, our UUID will be displayed as the name of the process.

gs = '''
continue
'''

def start():
    if args.REMOTE:
        return remote("spaceheroes-cryptographic-space-rover.chals.io", 443, ssl=True, sni="spaceheroes-cryptographic-space-rover.chals.io")
        #return remote("10.91.70.21", 31337)
    else:
        return process(['python3', 'nasa_crypto.py'])

# All symbols possible for a flag
all_possible_symbols = ""
all_possible_symbols += string.ascii_lowercase
all_possible_symbols += string.digits
all_possible_symbols += string.punctuation

print(all_possible_symbols)

# Master string
master_string = b""

while True: 

  for i in range(1,50):
    if (b"}" in master_string): 
        break

    # Loop through all characters
    for thing in all_possible_symbols[all_possible_symbols.index("a"):]:
        
        # Add a character to our iter string
        iter_string = master_string
        iter_string += thing.encode()

        # Open connection
        conn = start()
        conn.recvuntil(b"Session UUID:                              |    |\n           |   |    ")
        uuid_save = conn.recvuntilS(b' ').strip(" ")
        #print(uuid_save)

        conn.sendline(iter_string)

        try: 
            for i in range(0, len(iter_string)):
                var = conn.recvline_contains(uuid_save.encode())
            
            master_string = iter_string
            
            print("*"*160)
            print(master_string)
            print("*"*160)
            conn.close()
            break
        except: 
            conn.close()