import math
import gmpy2, random
from gmpy2 import isqrt, c_div
from Crypto.Util.number import long_to_bytes

flag = "shctf{1_w4n7_thA7_mCnu99E7_5auc3_M0R7Y}"

msg = int.from_bytes(flag.encode("utf-8"), byteorder="big")

urandom = random.SystemRandom()

def get_prime(size):
    while True:
        r = urandom.getrandbits(size)
        if gmpy2.is_prime(r): # Miller-rabin
            return r

def test_key(N, e, d):
    msg = (N - 123) >> 7
    c = pow(msg, e, N)
    return pow(c, d, N) ==  msg

def create_keypair(size):
    while True:
        p = get_prime(size // 2)
        q = get_prime(size // 2)
        if q < p < 2*q:
            break

    N = p * q
    phi_N = (p - 1) * (q - 1)

    # Recall that: d < (N^(0.25))/3
    max_d = c_div(isqrt(isqrt(N)), 3)
    max_d_bits = max_d.bit_length() - 1

    while True:
        d = urandom.getrandbits(max_d_bits)
        try:
            e = int(gmpy2.invert(d, phi_N))
        except ZeroDivisionError:
            continue
        if (e * d) % phi_N == 1:
            break
    assert test_key(N, e, d)

    return  N, e, d, p, q


key = create_keypair(2048)
n = key[0]
e = key[1]
d = key[2]
p = key[3]
q = key[4]

ct = pow(msg, e, n)
pt = pow(ct, d, n)

output = open("output.txt", "w")
#print(long_to_bytes(pt).decode())

string = f"C = {ct}\nn = {n}\ne = {e}\n"

output.write(string)
output.close()
