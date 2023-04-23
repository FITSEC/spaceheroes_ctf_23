CFLAGS = -Wl,-z,norelro -fstack-protector -O2 -std=c11 -no-pie
CHAL   = jedi
SRC    = $(CHAL).c
BIN    = $(CHAL).bin

$(BIN):
	gcc -o $(BIN) $(SRC) $(CFLAGS)

clean:
	rm -rf $(BIN)
