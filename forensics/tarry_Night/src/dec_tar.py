t = bytearray(open("old_tarry_night.tar","rb").read())
for i in range(len(t)):
	t[i] ^= 0x0c
open("tarry_night.tar","wb").write(t)
