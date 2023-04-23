#!/bin/python
import re
import r2pipe
from z3 import *

# open binary
r2 = r2pipe.open('./chall', flags=['-2'])

# get strings
iz = r2.cmd('iz')

left  = str(re.escape('all-day'))
right = str(re.escape('the_improbobility'))

streq = re.findall(left+"(.*)"+right, iz)[0]

x = BitVec('x', 128)
s = Solver()
s.add((x << (1 + (x%3))*3) + x == int(streq[::-1]))
if str(s.check()) == 'sat':
    print(s.model())
