from scapy.all import *
import sys

# Function to read file byte by byte and send over ICMP
def send_file_over_icmp(filename, dst, output_file):
    packets = []
    with open(filename, "rb") as f:
        # Read file byte by byte
        while True:
            byte = f.read(1)
            if not byte:
                break
            # Create ICMP packet with byte as data and append to list of packets
            packet = IP(dst=dst)/ICMP()/byte
            packets.append(packet)
    # Save packets to output file
    wrpcap(output_file, packets)

# Example usage
inp = str(sys.argv[1])
filename = inp
dst = "192.168.1.100"
output_file = inp+".pcap"
send_file_over_icmp(filename, dst, output_file)

