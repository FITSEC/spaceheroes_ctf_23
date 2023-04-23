#!/usr/bin/env python3

from pwn import *
from functools import reduce
from collections import defaultdict, Counter
import math

import config as c
import emojis

# from sympy.ntheory import factorint, primefactors
# context.log_level="debug"


class Emoji:
    def __init__(self, em, b=5, factors=None, num=999, binary=None):
        if factors is None:
            factors = [1]
        self.emoji = em
        self.factors = factors
        self.prime_factors = None
        self.bits = b
        self.num = num
        self.binary = binary
    
    def __str__(self):
        return self.emoji + ' = ' + str(self.num) + ' and has ' + str(len(self.factors)) + ' factors {' + ', '.join(
            str(f) for f in self.factors) + '}'
    
    def set_factors(self, f):
        self.factors = f
    
    def is_prime(self):
        if len(self.factors) <= 2:
            return True
        else:
            return False
    
    def set_binary(self):
        num_str = bin(self.num)[2:]
        left_padding = len(num_str) + (self.bits - (len(num_str) % self.bits))
        num_str = num_str.zfill(left_padding)
        self.binary = [num_str[i:i + self.bits] for i in range(0, len(num_str), self.bits)]
    
    def __eq__(self, other):
        if isinstance(other, Emoji):
            return self.num == other.num
        return NotImplemented
    
    def __ne__(self, other):
        if isinstance(other, Emoji):
            return self.num != other.num
        return NotImplemented
    
    def __lt__(self, other):
        if isinstance(other, Emoji):
            return self.num < other.num
        return NotImplemented
    
    def __le__(self, other):
        if isinstance(other, Emoji):
            return self.num <= other.num
        return NotImplemented
    
    def __gt__(self, other):
        if isinstance(other, Emoji):
            return self.num > other.num
        return NotImplemented
    
    def __ge__(self, other):
        if isinstance(other, Emoji):
            return self.num >= other.num
        return NotImplemented


p = process(['python', 'main.py'])
# p = process(['python', 'challenge/main.py'])

ans = []
known_emojis = {}
base = 64



def get_factors(num):
    step = 2 if num % 2 else 1
    return set(reduce(list.__add__, ([i, num // i] for i in range(1, int(math.sqrt(num)) + 1, step) if num % i == 0)))


def print_ans():
    sorted_ans = sorted(ans, key=lambda num: num.num)
    for number in sorted_ans:
        print(number)


def update_ans_number(em, num):
    for a in ans:
        if a.emoji == em:
            a.num = num
            known_emojis[em] = num

# def decrypt(msg):
#     return pow(msg, e, n)


p.recvuntil('🇵   🟰   '.encode())
pp = p.recvline().decode().strip()
p.recvuntil('🇶   🟰   '.encode())
q = p.recvline().decode().strip()
p.recvuntil('🇪   🟰   '.encode())
e = p.recvline().decode().strip()

p.recvuntil('0⃣   🟰   '.encode())
emoji = p.recvline().decode().strip()

ans.append(Emoji(emoji, num=0, factors=[0]))
known_emojis[emoji] = 0
factor_count = defaultdict(int)

p.recvuntil('🇨   🟰   '.encode())
encoded_flag = p.recvline().decode().strip()

emoji_set = set()

for emoji in encoded_flag:
    emoji_set.add(emoji)
for emoji in e:
    emoji_set.add(emoji)
for emoji in pp:
    emoji_set.add(emoji)
for emoji in q:
    emoji_set.add(emoji)

# print(emoji_set)
# print(len(emoji_set))

p.recvuntil('🇲 🇪 🇳 🇺 '.encode()).decode()


def update_factors():
    for a in ans:
        updated_fact = []
        for f in a.factors:
            if f in known_emojis.keys():
                updated_fact.append(known_emojis.get(f))
            else:
                updated_fact.append(f)
        a.factors = updated_fact


for emoji in emoji_set:
    if emoji not in (ans[0].emoji):
        p.recvuntil('🇪 🇽 🇮 🇹 '.encode())
        p.sendline('1⃣'.encode())
        p.recvuntil('🇫 🇦 🇨 🇹 🇴 🇷 🇸   🇴 🇫 ❓'.encode())
        p.sendline(emoji.encode())
        p.recvline().decode()
        factors = p.recvline().decode().strip().replace('  ', '')
        fact_list = []
        for fact in factors:
            #     if fact in known_emojis.keys():
            #         fact_list.append(known_emojis.get(fact))
            #     else:
            fact_list.append(fact)
        ans.append(Emoji(emoji, factors=fact_list))


def find_unique_factors():
    global factor_count
    emoji_dict = {}
    
    for i in range(1, base):
        factors = get_factors(i)
        for factor in factors:
            factor_count[factor] += 1
    
    for emoji in ans[1:]:
        for factor in emoji.factors:
            if factor not in emoji_dict.keys():
                # if factor not in ans:
                emoji_dict[factor] = 1
            else:
                emoji_dict[factor] += 1
    
    emoji_dict = dict(sorted(emoji_dict.items(), key=lambda item: item[1], reverse=True))
    print(emoji_dict)
    print(dict(sorted(factor_count.items(), key=lambda item: item[1], reverse=True)))
    print()
    
    unique_counter = Counter(factor_count.values())
    unique_keys = {key: value for key, value in factor_count.items() if unique_counter[value] == 1}
    
    for num in unique_keys:
        em = list(emoji_dict.keys())[num - 1]
        update_ans_number(em, num)
    
    update_factors()


def find_unique_unknown_factors():
    global factor_count
    unknown_factor_count = defaultdict(int)
    emoji_dict = {}
    
    for emoji in ans[1:]:
        if emoji.num == 999:
            for factor in emoji.factors:
                unknown_factor_count[factor] += 1

        for factor in emoji.factors:
            if factor not in emoji_dict.keys():
                # if factor not in ans:
                emoji_dict[factor] = 1
            else:
                emoji_dict[factor] += 1
    
    emoji_dict = dict(sorted(emoji_dict.items(), key=lambda item: item[1], reverse=True))
    print(emoji_dict)
    print(dict(sorted(factor_count.items(), key=lambda item: item[1], reverse=True)))
    print()
    
    unique_counter = Counter(factor_count.values())
    unique_keys = {key: value for key, value in factor_count.items() if unique_counter[value] == 1}
    
    for num in unique_keys:
        em = list(emoji_dict.keys())[num - 1]
        update_ans_number(em, num)
    
    update_factors()


find_unique_factors()

# Check for perfect squares
for emoji in ans:
    if len(emoji.factors) == 3 and emoji.num == 999:
        for factor in emoji.factors:
            if factor != 1 and isinstance(factor, int):
                update_ans_number(emoji.emoji, factor * factor)
                
update_factors()
# print_ans()
# print()


def find_one_unknown():
    for emoji in ans:
        if emoji.num == 999:
            unknown = 0
            known_factors = []
            for factor in emoji.factors:
                if isinstance(factor, str):
                    unknown += 1
                else:
                    known_factors.append(factor)
            if len(emoji.factors) > 2 and unknown == 1:
                known_factors.sort()
                update_ans_number(emoji.emoji, known_factors[1] * known_factors[-1])
    update_factors()


find_one_unknown()
find_one_unknown()
find_one_unknown()
find_one_unknown()
print()
print_ans()
print(emojis.select_emojis())

find_unique_unknown_factors()
print()




def get_new_prime(b):
    p.recvuntil('🇪 🇽 🇮 🇹 '.encode())
    p.sendline('3⃣'.encode())
    p.recvuntil('🇭 🇴 🇼   🇲 🇦 🇳 🇾   🇧 🇮 🇹 🇸 ❓ '.encode())
    p.sendline(b.encode())
    p.recvline().decode()
    # factors = p.recvline().decode().strip().replace('  ', '')
    # fact_list = []

# get_new_prime('6⃣')

p.interactive()


# def decode_emoji(emoji_str):
#     bin_str = ''
#     for em in emoji_str:
#         bin_str = bin_str + str(bin(select_emojis().index(em)))[2:].zfill(bits)
#     return int(bin_str, 2)
#
#
# def decrypt_answer(answer):
#     decoded = decode_emoji(answer)
#     decrypted = decrypt(decoded)
#     # Don't need to print flag so decoding answer is unnecessary.
#     # But if it's needed:
#     # decrypted.to_bytes((decrypted.bit_length() + 7) // 8, sys.byteorder).decode('utf-8')
#     return decrypted.to_bytes((decrypted.bit_length() + 7) // 8, sys.byteorder).decode('utf-8')
