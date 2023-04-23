from pwn import *
ciphertext = "783f3977627a693a320f313e421e29513e036e485565360a172b00790c211a7b117b4a7814510b2d4b0b01465448580a0369520824294c670c3758706407013e271b624934147f1e70187c1c72666949405c5b4550495e5e02390607217f11695a61587c6351536b741d301d6d182c48254e7f4927683d19"
cipher_bytes = bytearray.fromhex(ciphertext)
A = b''
B = b''
C = b''
for i in range(len(cipher_bytes)):
	if i < len(cipher_bytes)/3:
		A += cipher_bytes[i].to_bytes(1, 'big')
	elif i < 2*len(cipher_bytes)/3:
		B += cipher_bytes[i].to_bytes(1, 'big')
	else:
		C += cipher_bytes[i].to_bytes(1, 'big')

print(xor(A, B, C))
