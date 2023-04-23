from pwn import *

plaintext = b'shctf{on3_e1GHt_hUnDR3d_D-R-U-I-D-I-A__}'
key1 = b'8cb2237d0679ca88db6464eac60da96345513964'
key2 = b'348162101fc6f7e624681b7400b085eeac6df7bd'

def shield_combination(p, k1, k2):
	A = xor(p, k1, k2)
	B = xor(p, k1)
	C = xor(p, k2)
	return A + B + C

print(shield_combination(plaintext, key1, key2).hex())
