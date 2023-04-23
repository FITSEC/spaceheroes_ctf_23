CFLAGS = -fno-stack-protector -z noexecstack -z relro -no-pie
CHAL   = engine_failure
SRC    = $(CHAL).c
BIN    = $(CHAL).bin

example:
	gcc -o $(BIN) $(SRC) $(CFLAGS)

clean:
	rm -rf $(BIN)

