CFLAGS = -no-pie -fstack-protector-all
CHAL   = chal
SRC    = $(CHAL).c
BIN    = $(CHAL).bin

example:
	gcc -o $(BIN) $(SRC) $(CFLAGS)

clean:
	rm -rf $(BIN)
