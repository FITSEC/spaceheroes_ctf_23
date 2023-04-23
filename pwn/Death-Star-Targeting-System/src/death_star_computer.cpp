#include <stdio.h>
#include <stdint.h>
#include <stdlib.h>
#include <cstdio>

typedef union target {
	uint64_t coords;
	void (*fire)();
} target;

void print_death_star() {
	printf("------------------------------\n");
	printf("|⠀⠀⠀⠀⠀⠀⠀⣀⣤⣴⣶⣾⣿⣿⣿⣿⣷⡶⠦⠀⠀⠀⠀⠀⠀⠀⠀⠀|\n");
	printf("|⠀⠀⠀⠀⢀⣴⣾⣿⣿⠿⠿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣧⣤⡄⠀⠀⠀⠀⠀|\n");
	printf("|⠀⠀⠀⣰⣿⣿⣿⠋⠀⠀⠀⠀⠈⢻⣿⣿⣿⣿⣿⣿⡟⠛⠛⠃⠀⠀⠀⠀|\n");
	printf("|⠀⠀⣼⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⠀⠀|\n");
	printf("|⠀⢰⣿⣿⣿⣿⣧⡀⠀⠀⠀⠀⠀⣠⣿⣿⣿⣿⣿⣿⠿⠟⠛⠁⠀⠀⠀⠀|\n");
	printf("|⠀⣾⣿⣿⣿⣿⣿⣿⣶⣤⣤⣴⣾⣿⣿⣿⣿⣿⣿⣷⣶⣶⣶⣶⣶⣶⣶⠀|\n");
	printf("|⠀⣉⠉⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠉⣉⠀|\n");
	printf("|⠀⢿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣶⣶⣶⣶⣶⣶⣾⣿⣿⣿⣿⣿⣿⣿⠿⠿⠀|\n");
	printf("|⠀⠸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⠛⠛⠋⠉⠀⠀⠀|\n");
	printf("|⠀⠀⢻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⣤⣤⣤⣤⡄⠀⠀⠀|\n");
	printf("|⠀⠀⠀⠹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠏⠀⠀⠀|\n");
	printf("|⠀⠀⠀⠀⠈⠻⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣤⡄⠀⠀⠀⠀⠀⠀⠀|\n");
	printf("|⠀⠀⠀⠀⠀⠀⠀⠉⠛⠻⠿⢿⣿⣿⣿⣿⠟⠉⠉⠉⠉⠀⠀⠀⠀⠀⠀⠀|\n");
	printf("-------------------------------\n");
}

void print_terminal() {
	print_death_star();
	printf("|DEATH STAR TARGETING COMPUTER|\n");
	printf("-------------------------------\n");
	printf("1: Enter target coordinates\n");
	printf("2: Display current target\n");
	printf("3: Fire\n");
}

void print_choice() {
	printf("-----------------\n");
	printf("|CHOOSE A TARGET|\n");
	printf("-----------------\n");
	printf("1. ALDERAAN\n");
	printf("2. YAVIN 4\n");
	printf("3. DANTOINE\n");
	printf("4. TATOOINE\n");
	printf("5. DAGOBAH\n");
	printf("6. HOTH\n");
	printf("7. BESPIN\n");
}

void alderaan() {
	printf("Target set to ALDERAAN.\nYou may fire when ready.\n");
}

void yavin_4() {
	printf("Target set to YAVIN 4.\nYou may fire when ready.\n");
}

void dantoine() {
	printf("Target set to DANTOINE.\nYou may fire when ready.\n");
}

void tatooine() {
	printf("Target set to TATOOINE.\nYou may fire when ready.\n");
}

void dagobah() {
	printf("Target set to DAGOBAH.\nYou may fire when ready.\n");
}

void hoth() {
	printf("Target set to HOTH.\nYou may fire when ready.\n");
}

void bespin() {
	printf("Target set to BESPIN.\nYou may fire when ready.\n");
}

class FlushStreams {
public:
    FlushStreams() {
        fflush(stdin);
        fflush(stdout);
        fflush(stderr);
    }
};

FlushStreams flushStreams;

int main() {
	target w;
	while (1) {
		print_terminal();
		int res;
		scanf("%d", &res);
		switch (res) {
		case 1: {
			uint64_t choice;
			print_choice();
			scanf("%ld", &choice);
			switch(choice) {
			case 1: w.fire = alderaan; break;
			case 2: w.fire = yavin_4; break;
			case 3: w.fire = dantoine; break;
			case 4: w.fire = tatooine; break;
			case 5: w.fire = dagobah; break;
			case 6: w.fire = hoth; break;
			case 7: w.fire = bespin; break;
			default: w.coords = choice;
			}
			break;
		}
		case 2: {
			printf("Target Coordinates => %ld\n", w.coords);
			break;
		}
		case 3: {
			w.fire();
			break;
		}
		default: break;
		}
	}
}

// gadgets
void ignore_me() {
	asm("mov $75, %r14; ret; mov $86, %r13; ret; mov $309, %r15; ret;");
}

void win() {
	char bsh[] = "/bin/sh";
	asm("cmp $86, %r13; jne main;");
	asm("cmp $75, %r14; jne main;");
	asm("cmp $309, %r15; jne main;");
	system(bsh);
}
