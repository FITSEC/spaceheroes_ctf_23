open('transmission.txt', 'w').write('\n'.join(format(ord(x), 'b').zfill(8).replace('0', '\x20').replace('1', '\x09') for x in 'shctf{a_bl1nd_m4n_t3aching_an_4ndr0id_h0w_to_pa1nt}') + '\n')
