all:
	rustc -o chall -C target-feature=+crt-static chall.rs
	#rustc -o dp2 -O chall.rs
	rustc -o gen   -C target-feature=+crt-static gen.rs

clean:
	rm chall gen
