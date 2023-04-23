# Solving Bin7 (fart)
## Initial Analysis
Initial Checksec reveals a pretty standard compilation. No PIE, no Canary, partial RELRO, NX stack.
```
[*] '/home/rob/Documents/VR_Midterm/bin7/fart'
    Arch:     amd64-64-little
    RELRO:    Partial RELRO
    Stack:    No canary found
    NX:       NX enabled
    PIE:      No PIE (0x400000)
```
From there, I began reversing the binary to search for any vulnerabilities. However, there did not
appear to be any. Rather, the program takes in input using `read`, up to 30000 bytes, and stores it
in a 30000 byte buffer which sits atop the heap. This suggests no buffer based overflow.

Next the program passes that input into a function called `interpret`, almost as if this program was
some sort of interpreter. Now the interpret function seems to loop through each character in your
input and throw it at a switch statement. That switch statement checks for the characters `+-,.<>[]`
which happens to also be the characterset for an esoteric programming language called BrainFart. 

BrainFrick is a surprisingly simple language made to simulate a turing machine. Just like a turing
machine, BrainFudge has a tape (or array) with traditionally 30000 slots. Each index of the tape
can hold a value between 0 - 255 (a character). You can move the head left and right respectively
along the tape using `<` and `>`, you can increment the current node with `+` and decrememnt with
`-`, and you can input a character to the current node with `,` and output a character with `.`.

BrainFlip also has loops denoted using `[` and `]`. The way loops work is that `[` simply denotes
the beginning of the loop and `]` acts as a jnz instruction, where the program jumps to the last
`[` instruction if the head currently points to a nonzero node. Effectively, this acts like in c
a do-while loop with `do{...}while(current_node != 0);` where the `...` is the innards of the loop.

## The Funky Math
Through analyzing the interpret function thoroughly, it does in fact follow all the rules previously
mentioned for BrainHeck, and even has a second character array of 30000 to act as the tape. In fact,
the entire program is simply an intepreter for BrainFunk, with one exception. 

After the inputted program halts, the interpret function does some math with each element of the 
tape, and then checks it against the value `0x732b5ec6`. It is not quite clear through static
analysis what the math is actually doing, and this was made very apparent when looking at this
in GDB.

Static analysis showed enough to tell that some value is being obtained from the current node in
the tape, is being casted incorrectly and in a very strange way, and then is subtracted from the
total, which starts at 0. For readability, I have renamed the variables in Binary Ninja. Note the
call to `win`, implying we need to properly set the tape to the exact values which will get us
to that value. 
```
004013d6      int32_t total = 0;
0040141a      for (int32_t index = 0; index <= 29999; index = (index + 1))
0040140f      {
0040140a          current_slot = ((uint64_t)(total - *(int8_t*)(&tape_addr + ((int64_t)index))));
0040140c          total = current_slot;
0040140c      }
00401423      if (total == 0x732b5ec6)
0040141c      {
0040142a          current_slot = win();
0040142a      }
00401431      return current_slot;
```

Like I mentioned before, GDB reveals a very crucial detail. It's hard to explain in words, however
visually its clear the nonsense that ensues, and that the values of the first three elements in
the tape persist throughout the entire calculation. However, to test this I also needed to write
some BrainShoot code that set the tape to some test values. Using python I sent the following
code:
```
code = (b'+' * 0xAA) + '>' + (b'+' * 0xBB) + '>' + (b'+' * 0xCC) + '>' + (b'+' * 0xDD) + '>' + (b'+' * 0xEE) + '>'
```

This code sets the tape to the following:
```
------------------------------------
| 0xAA | 0xBB | 0xCC | 0xDD | 0xEE |
------------------------------------
   0      1      2      3      4

indeces 5-29999: 0x00
```

The calculation done to set the variable `current_slot` as shown by GDB will take the value stored
in total (moved into `edx`) and subtract from it the following value placed in `ecx`: `0xCCBBAAAA`.
The second calculation, `ecx` contains `0xCCBBAABB`, then `0xCCBBAACC`, then `0xCCBBAADD` and so on.
Notice how indeces 0, 1, and 2 all persist in the calculation as the leftmost 24 bits in `ecx`, with
the current node being the rightmost 8 bits. 

So what can we do with this information? Well first lets understand better the end goal. These values
are being subbed from zero, meaning we are underflowing from 0 to `0xFFFFFFFF`, and we want to stop
at `0x732b5ec6`. Well, we can calculate what the sum of the array would be by computing the value
of `0x100000000 - 0x732b5ec6`, which evaluates to be `0x8cd4a13a`. For now lets assume the calculation 
is the same for every element in the array, and try to see what value will need to be subtracted from 
total at each iteration. We can take this, divide by 30000, and we get the value `78758.171...`, 
rounded down is the hex value `0x133a6`. We can ignore the remainder for now, as it will be an easy
fix later. 

So, knowing each sub should be about `0x133a6`, we can use this information to determine the values
for the first three elements, which persist. Observe the following tape:
```
------------------------------------
| 0x33 | 0x01 | 0x00 | 0xA6 | 0xA6 |
------------------------------------
   0      1      2      3      4
```
Assume elements 5 through 29999 are also all `0xA6`. With this, each subtraction for elements 3 and
onward will subtract the value `0x000133A6`, which gets us very close to the value. However, we must
consider as well that the first three subtractions are with the values `0x00013333`, `0x00013301`,
and `0x00013300`. Knowing that we cannot change these calculations, let us repeat our analysis from
before, but with just elements 3-29999, and subtracting these first three values from our desired sum.
Our new sum becomes `0x8cd4a13a - 0x13333 - 0x13301 - 0x13300 = 0x8cd10806`. Like before, lets take
this value and divide it by the slots we have left and we get `0x8cd10806 / 29997 = 78758.1864...`
which rounds down to that same hex value as before, `0x133a6`.

Ok wonderful, so we just need to account for the remainder, which ends up being `5592`. This however
is a simple fix, as we just need 5592 of the elements in our 30000 character array to be incremented
by one, containing the value `0xA7`, and the math should check out.

## Crafting the Solution
Before implementing this into a solve script, I wrote the following test script in python to properly
initialize the array and print out the difference between the value we calculate for the difference
and the value checked for in order to win. For again simplicity's sake, I arbitrarily picked 10 elements
deep to be the start of the 5592 incremented values.
```
arr = []
for i in range(30000):
        arr.append(0xa6)

arr[0] = 0x33
arr[1] = 0x01
arr[2] = 0x00

num = arr[2] << 24
num += arr[1] << 16
num += arr[0] << 8

total = 0x100000000

for i in range(30000):
        total -= num + arr[i]

diff = total - 0x732b5ec6

for i in range(diff):
        arr[i + 10] += 1

total = 0x100000000
for i in range(30000):
        total -= num + arr[i]

print(hex(total - 0x732b5ec6))
```

Running this script outputs `0x0`, which is good and means that if we can set the tape to exactly this
state, we should get a call to win.

Quick reminder of what our tape looks like after the script executes:
```
-----------------------------------------------
| 0x33 | 0x01 | 0x00 | 0xA6 | 0xA7  | 0xA6    |
-----------------------------------------------
   0      1      2     3-9   10-5602 5603-29999
```

All that was left was to write some BrainDarn code that sets the tape to these values. Unfortunately,
we are limited to 30000 characters so spamming `+` and then `>` to increment the tape one at a time
is not possible. However, the comma exists which takes a character from `stdin` and inserts the ascii
value into the tape. So, lets write some BrainDang code that reads in a character to each element:
```
,[>,]
```

Note the comma outside the loop, which is needed because if we dont set the head before looping we will
never enter the loop. The loop innards are simple: move right, and read in a character. Great! Now we
just have to use pwntools to send each character to stdin to set our tape.
```
convert = b''
for c in arr:
        convert += b'%c' %(c)
...
p.sendline(convert)
```

Those with a keen eye probably spotted this outcome a few paragraphs ago, but this code does not work
in setting the tape, and GDB had confirmed it when I ran it and looked at the sum at the end of the 
interpret function. The first three computations are just fine, but the computations for elements 3
and onward all sub by `0x13300`. Drats! 

In fact, each element afterwards was also set to `0x00`. This is not good, but I quickly realized the 
issue was element 2. Since we initialize that to null, the loop exits at that point since the head 
points to zero, and our program halts. To fix this, we just need to adjust our BrainDrats code so that
the first three initializations are not included in the loop. Also, because I did not know whether or
not `getchar` read in null bytes, I manually send it via pwntools as `0x01` and decrement it in my 
BrainCrap code.

The final BrainFuck code looks like this:
```
,>,>,->,[>,]
```

Running my solve script again in GDB, calculations 3 onward appeared to be `0x133a6` like we wanted
from before. So I removed my breakpoint and just let it run and the win function got called. So then
I ran it against the remote server and obtained the flag. 
