#!/bin/python3
from emojis import *
from primes import *
import config as c
import math
import sys
import os
from functools import reduce
import time

# def get_private_key():
#     return get_p(), get_q(), get_d()
#
#
# public_key = (n, c.e)

bits = (c.emoji_base - 1).bit_count()

loop = True


def encrypt(msg):
    m = int.from_bytes(msg.encode('utf-8'), sys.byteorder)
    return pow(m, d, n)


def decrypt(msg):
    return pow(msg, c.e, n)


def slice_numbers(num):
    num_str = bin(num)[2:]
    if (len(num_str) % bits) != 0:
        left_padding = len(num_str) + (bits - (len(num_str) % bits))
        num_str = num_str.zfill(left_padding)
    return [num_str[i:i + bits] for i in range(0, len(num_str), bits)]


def get_factor(emoji):
    if emoji in select_emojis() and len(emoji) == 1 and emoji != select_emojis()[0]:
        result = set()
        num = decode_emoji(emoji)
        num_factors = factors(num)
        for factor in num_factors:
            result.add(select_emojis()[factor])
        return result
    else:
        return None


def factors(num):
    step = 2 if num % 2 else 1
    return set(reduce(list.__add__, ([i, num // i] for i in range(1, int(math.sqrt(num)) + 1, step) if num % i == 0)))


def menu():
    global loop
    time.sleep(1)
    
    print(f"{printer('Menu')}")
    print(f"{printer('Press 1 to get the factors of an emoji')}")
    print(f"{printer('Press 2 to get a random prime by bits')}")
    print(f"{printer('Press 3 to get the factors of a random number that is at over ' + str(bits) + ' bits in size')}")
    print(f"{printer('Press anything else to exit')}")
    
    resp = input()
    if resp == '1⃣':
        print(f"{printer('What emoji would you like the factors of?')}")
        em = input()
        if len(em) > 1:
            loop = False
        elif em not in select_emojis():
            print(f"{printer('Emoji ')}{em}{printer(' is not valid. Please try again.')}")
        else:
            print(f"{printer(get_factor(em))}")
    
    elif resp == '2⃣':
        print(f"{printer('How many bits?')}")
        num_bits = input()
        if num_bits in digs:
            num = digs.index(num_bits)
            print(f"{printer('Random ' + str(num) + ' -bit prime = ')}"
                  f"{printer(select_emojis()[get_prime_n_bits(num)])}\n")
        else:
            print(f"{printer('Please enter a number between 0 - 9')}")
    elif resp == "3⃣":
        print(f"{printer('How many bits?')}")
        num_bits = input()
        if num_bits in digs:
            num = digs.index(num_bits)
            if num > bits:
                result = set()
                rand = get_rand_n_bit_num(num)
                num_factors = factors(rand)
                for factor in num_factors:
                    encode = encode_number(factor)
                    result.add(encode)
                print(f"{printer(result)}")
            else:
                print(f"{printer('Please enter a number between 0 - 9 that is greater than ' + str(bits) + ' bits')}")
        else:
            allowable = ' '.join(str(f) for f in range(bits + 1, 9))
            print(f"{printer('Please enter either a ' + allowable + ' or 9')}\n")
    else:
        loop = False


def encode_number(num):
    s = ''
    sliced = slice_numbers(num)
    for i in sliced:
        s = s + select_emojis()[int(i, 2)]
    return s


def decode_emoji(emoji_str):
    bin_str = ''
    for em in emoji_str:
        bin_str = bin_str + str(bin(select_emojis().index(em)))[2:].zfill(bits)
    return int(bin_str, 2)


def decrypt_answer(answer):
    decoded = decode_emoji(answer)
    decrypted = decrypt(decoded)
    return decrypted.to_bytes((decrypted.bit_length() + 7) // 8, sys.byteorder).decode('utf-8')


def encode_flag():
    return encode_number(encrypt(c.flag))


# def decrypt_answer(answer):
#     decoded = decode_emoji(answer)
#     decrypted = decrypt(decoded)
#     return decrypted.to_bytes((decrypted.bit_length() + 7) // 8, sys.byteorder).decode('utf-8')
#
#
# def decrypt(msg):
#     return pow(msg, c.e, n)


print(f'🚨 🚨 🚨{printer(" This is an emojenncy! ")}🚨 🚨 🚨')
print(f"{printer('We are using base-')}{printer(str(c.emoji_base))}{printer(' emoji encoding')}")
print(f"{printer('That means each emoji represents ' + str(bits) + ' bits')}")
print(printer("Here are the pieces used to encrypt the flag \n"))

p = get_p()
q = get_q()
n = p * q
lcm = math.lcm(p - 1, q - 1)
d = pow(c.e, -1, lcm)

print(f"{printer('P = ')}{encode_number(p)}")
print(f"{printer('Q = ')}{encode_number(q)}")
print(f"{printer('E = ')}{encode_number(c.e)}\n")
print(f"{printer('Here is a ')}🆓 🐝{printer(' to get you started')}")
print(f"{printer('0 = ')}{encode_number(0)}\n")
print(f"{printer('To get the ')}🏴‍☠️{printer(' you must decrypt the ')}🏴‍☠️")
print(f"🔐 🇺🇸 👇\n")

print(f"{printer('C = ')}{encode_flag()}\n")

# print(f"{printer('Flag = ')}{decrypt_answer(encode_flag())}\n")

while loop:
    menu()
    os.system('clear')
