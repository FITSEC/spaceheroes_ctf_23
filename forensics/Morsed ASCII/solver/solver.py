import os
import sys
import wavio
import numpy as np
from scipy.signal import butter, sosfiltfilt, hilbert

relative_path = '../generator'
sys.path.insert(0, os.path.abspath(os.path.join(os.getcwd(), relative_path)))

from morsegen import generate_morse_dict

morse_dict = generate_morse_dict()


def butter_bandpass(low_freq, high_freq, fs, order=5):
    nyq = 0.5 * fs
    low = low_freq / nyq
    high = high_freq / nyq
    sos = butter(order, [low, high], btype='band', output='sos')
    return sos


def bandpass_filter(d, low, high, fs, order=5):
    sos = butter_bandpass(low, high, fs, order=order)
    y = sosfiltfilt(sos, d)
    return y


def sliding_window(d, window_size):
    return np.convolve(d, np.ones(window_size), 'valid')


def morse_to_ascii(morse):
    reversed_morse_dict = {v: k for k, v in morse_dict.items()}
    return ''.join([reversed_morse_dict[s] for s in morse.split(' ') if s in reversed_morse_dict])


def decode_morse_signal(signal, dot, dash, space, threshold):
    morse = ""
    i = 0
    while i < len(signal):
        if signal[i] > threshold:
            count = 0
            while i < len(signal) and signal[i] > threshold:
                count += 1
                i += 1

            if count < (dot + dash) / 2:
                morse += '.'
            else:
                morse += '-'
        else:
            count = 0
            while i < len(signal) and signal[i] <= threshold:
                count += 1
                i += 1

            if count >= space:
                morse += ' '

    return morse


wav_data = wavio.read("../out/signal.wav")
rate = wav_data.rate
data = wav_data.data[:, 0]

filtered_data = bandpass_filter(data, 190, 210, rate)

# Create an envelope of the filtered data using the Hilbert transform
envelope = np.abs(hilbert(filtered_data))
binary_signal = np.where(envelope > np.mean(envelope), 1, 0)

dot_duration = int(rate * 0.05)
dash_duration = int(rate * 0.10)
space_duration = int(rate * 0.15)

morse_code = decode_morse_signal(binary_signal, dot_duration, dash_duration, space_duration, 0.5)

print(morse_to_ascii(morse_code))
