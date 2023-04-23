import wavio
import numpy as np


def char_to_binary(char):
    return format(ord(char), "08b")


def char_to_morse_binary(char):
    return char_to_binary(char).replace("0", ".").replace("1", "-")


def generate_morse_dict():
    morse_binary_dict = {}
    for ascii_value in range(32, 127):
        char = chr(ascii_value)
        morse_binary = char_to_morse_binary(char)
        morse_binary_dict[char] = morse_binary
    return morse_binary_dict


def text_to_morse(text):
    
    char_to_dots = generate_morse_dict()
    print(char_to_dots)

    morse = [char_to_dots.get(letter) for letter in text]
    return ' '.join(morse)


def gen_sine_wave(char):

    t = .05 if char == '.' else .15
    f = 200 if char != ' ' else 0

    rate = 44100
    sampling_interval = 1 / rate
    num_samples = rate * t
    t_seq = np.arange(num_samples) * sampling_interval
    omega = 2 * np.pi * f

    return np.concatenate((.02 * np.sin(omega * t_seq), np.zeros(4000)))


def code_to_sound(code):

    wave_group = np.zeros(0)
    for char in code:
        new_wave = gen_sine_wave(char)
        wave_group = np.concatenate((wave_group, new_wave))

    return wave_group


def fftnoise(f):
    f = np.array(f, dtype='complex')
    Np = (len(f) - 1) // 2
    phases = np.random.rand(Np) * 2 * np.pi
    phases = np.cos(phases) + 1j * np.sin(phases)
    f[1:Np + 1] *= phases
    f[-1:-1-Np:-1] = np.conj(f[1:Np + 1])
    return np.fft.ifft(f).real


def band_limited_noise(min_freq, max_freq, samples=1024, samplerate=1):
    freqs = np.abs(np.fft.fftfreq(samples, 1 / samplerate))
    f = np.zeros(samples)
    idx = np.where(np.logical_and(freqs >= min_freq, freqs <= max_freq))[0]
    f[idx] = 1
    return fftnoise(f)


def main():
    flag = "shctf{N0 1 c4n H34r u 833P_800p(In) < /dev/nullspace}"
    morse_flag = text_to_morse(flag)
    
    print(morse_flag)
    print()
    print(morse_flag.replace(".", "0").replace("-", "1").replace(" ", ""))
    
    morse_sound = .5 * code_to_sound(morse_flag)

    noise_under = band_limited_noise(0, 185, morse_sound.size, 44100)
    noise_over = band_limited_noise(250, 10000, morse_sound.size, 44100)

    noise = 25 * np.add(noise_under, noise_over)
    
    noisy_sound = np.add(morse_sound, noise)
    wavio.write("../out/signal.wav", noisy_sound, 44100, sampwidth=2)
    
# "I'm sorry, Dave. I'm afraid I can't decode that"
# My ASCII, it's full of  ... - .- .-. ...!


if __name__ == '__main__':
    main()
