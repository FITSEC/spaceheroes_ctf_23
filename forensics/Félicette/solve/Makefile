INPUT_IMAGE := not_felicette.webp
OUTPUT_IMAGE := chall.jpg
FLAG := shctf{tmp_flag}

default:
	convert $(INPUT_IMAGE) -resize 200% tmp.jpg
	convert tmp.jpg -pointsize 36 -gravity south -fill red -annotate +0+10 "$(FLAG)" $(OUTPUT_IMAGE)
	rm tmp.jpg
	python icmp_gen.py $(OUTPUT_IMAGE)

solve: generate_pcap
	tshark -r $(OUTPUT_IMAGE).pcap -T fields -e data | tr -d '\n' | xxd -r -p > out.jpg

clean:
	rm -f *.pcap $(OUTPUT_IMAGE) out.jpg
