t = bytearray(open("new_tarry_night.tar","rb").read())
for i in range(len(t)):
	t[i] ^= 0x0c
open("out.tar","wb").write(t)
