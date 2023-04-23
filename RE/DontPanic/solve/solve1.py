#!/bin/python

from z3 import *
from pwn import *
context.log_level = 'warning'
io = remote("spaceheroes-dontpanic.chals.io", 443, ssl=True, sni="spaceheroes-dontpanic.chals.io")

streq = "5517378053351061091180594008489976005"

x = BitVec('x', 128)
s = Solver()
s.add((x << (1 + (x%3))*3) + x == int(streq[::-1]))
if str(s.check()) == 'sat':
    io.recvline()
    io.sendline(str(s.model())[5:-1].encode('utf-8'))
    io.recvline()
    print(io.recvline().decode('utf-8'), end="")

