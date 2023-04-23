f = open('transmission.txt', 'r')
enc = f.readlines()

byte = ''
for line in enc:
    if not ('\x20' == line[0] or '\x09' == line[0]):
        continue
    for c in line:
        if c == '\x20':
            byte += '0'
        elif c == '\x09':
            byte += '1'
        else:
            print(chr(int(byte, 2)), end='')
            byte = ''
print('')
