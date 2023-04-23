#include <stdio.h>
#include <sys/mman.h>
#include <unistd.h>
#include <sys/syscall.h>
#include <stdlib.h>
#include <string.h>


void clear_buff(){
	setvbuf(stdout, NULL, 2, 0);
	setvbuf(stderr, NULL, 2, 0);
	setvbuf(stdin, NULL, 2, 0);
}


void slow_print(char *string){
	int i = 0;
	int len = strlen(string);
	for(int i = 0; i < len; i++){
		putchar(*(string + i));
		usleep(7000);
	}
}

void logo(){
	printf("------------------------------------------------------------------\n");
	printf("|    ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⡤⣤⣤⡤⠴⠖⠒⠒⠒⠒⠛⠛⠓⠒⠒⠒⠒⠒⠚⠿⢯⣥⣤⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀          |\n");
	printf("|    ⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⣴⠾⠻⣧⣄⠉⠛⠶⣦⣄⣀⠀⠀⣀⣀⣀⣀⣀⠀⠀⠀⠀⠀⠀⠀⠉⠉⠛⠷⣦⣤⡀⠀⠀⠀⠀⠀⠀⠀⠀          |\n");
	printf("|    ⠀⠀⠀⠀⠀⠀⣠⣾⠛⠉⠀⠀⠀⠀⠙⠳⢶⣤⣄⠉⠉⠉⠉⠉⢉⣉⣉⣉⣉⠛⠂⠀⠀⠀⠀⠀⠀⣀⣠⣤⠉⠙⢷⣆⢀⡀⠀⠀⠀⠀          |\n");
	printf("|    ⠀⠀⠀⢀⣴⡾⠋⠀⠀⠀⠀⠀⡤⠀⠀⣀⡀⠀⠉⠛⠻⣶⣄⠹⣟⠉⠉⠉⠉⠉⠉⠉⠀⠀⠀⠀⠀⢸⣇⢻⡄⠀⠀⢹⣿⢹⠀⠀⠀⠀          |\n");
	printf("|    ⠀⠀⣠⡿⠋⠀⠀⠀⠀⠀⣠⡾⠃⠀⣰⡟⠀⠀⠀⠀⠀⠈⠻⣦⠻⣷⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢿⣎⢿⣆⠀⢀⡿⢸⣧⠀⠀⠀          |\n");
	printf("|    ⢀⣾⠏⠀⠀⣀⣄⠀⠀⣠⡿⠁⣠⡾⠋⠀⠀⠀⠀⠀⠀⠀⠀⠹⣧⠘⣷⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⢿⣤⡻⠦⠼⠃⢸⠿⣇⠀⠀          |\n");
	printf("|    ⢸⡏⠀⠀⠸⣿⡝⠿⠾⠋⢀⣼⠟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢹⣷⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⢿⣆⠀⢀⡾⠀⢹⡆⠀          |\n");
	printf("|    ⣿⠀⠀⠀⠀⠘⣷⡄⠀⢠⡿⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠿⠿⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢿⡆⢸⣇⠀⠈⣿⠀          |\n");
	printf("|    ⣿⠀⠀⠀⠀⠀⢻⣧⢀⣾⠁⠀⠀⠀⠀⠀⠀⠀⠀⣀⣀⣀⣀⡀⠀⠀⠀⢀⣤⡄⠀⠀⠀⠀⠀⠀⠀⣀⠀⠀⠀⠀⣸⡟⢀⣙⡛⠶⣿⣇          |\n");
	printf("|    ⣿⠀⠀⠀⠀⠀⠸⣿⡈⢿⣦⡀⠀⠀⠀⠀⠀⠀⠀⠉⠉⠉⠛⠛⠻⢶⣶⡞⠉⠀⠀⠀⠀⠀⠀⠀⠘⠛⠛⠶⣦⣾⠟⣱⡿⠛⠛⠛⣿⣿          |\n");
	printf("|    ⣿⡄⠀⠀⠀⠀⠀⠙⠿⣦⣝⣻⣶⡾⠂⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢻⣶⡄⠀⠀⠀⠀⣀⠀⠀⠀⠀⠀⠈⠹⣿⡋⠀⠀⠀⢠⣿⢿          |\n");
	printf("|    ⠛⣷⡀⠀⠀⠀⠀⠀⠀⠀⠹⣿⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⠙⢿⣶⠶⠞⠛⠉⠀⠐⠶⠶⠶⢶⣦⣼⣷⡀⠀⠀⣸⠃⠐          |\n");
	printf("|    ⠀⢸⣧⠀⠀⠀⠀⠀⠀⠀⣼⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠛⠻⠿⣦⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠛⢿⣦⣠⡏⠀⠀          |\n");
	printf("|    ⠀⠀⢻⣧⠀⠀⠀⠀⠀⢠⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⣦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠹⣿⡇⠀⠀          |\n");
	printf("|    ⠀⠀⠈⣿⡇⠀⠀⠀⣀⡞⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣀⣀⣀⣀⣀⣀⠀⠀⠈⢿⡆⠀⠀⣀⣀⣀⣀⣀⣀⠀⢸⣷⡄⠀          |\n");
	printf("|    ⠀⠀⠀⢿⡇⠀⠀⣴⠟⠀⠀⠀⠀⠀⠀⠀⠀⣀⣤⣤⣤⡶⠾⠛⢛⣿⠛⢻⣿⣯⡍⠙⠛⠷⢶⣼⣿⠿⠟⢛⡿⢿⣿⣿⡛⠻⢾⣿⡇⠀          |\n");
	printf("|    ⠀⠀⠀⣿⡇⠀⠀⠉⠀⠀⠀⠀⠀⠀⠀⠀⠸⣿⣽⣟⠁⠀⠀⠀⠘⣿⣶⣿⣿⣿⡿⠀⠀⠀⠀⡿⠁⠀⠀⢻⣦⣴⣿⣿⡟⠀⢈⣿⡇⠀          |\n");
	printf("|    ⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠛⠳⢦⣤⣤⣀⣀⠙⠛⠛⠉⠀⣀⣀⣠⣼⣧⣄⣀⣀⣈⡛⢻⢛⣛⣠⣤⣼⣿⡇⠀          |\n");
	printf("|    ⠀⠀⠀⢿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⣴⣶⣶⣤⣄⡀⠉⠉⠉⠙⠛⠛⠛⠋⠉⠉⠉⠁⠉⠻⣿⡉⠉⠉⠉⠉⠉⠉⠉⢱⡿⣷⠄          |\n");
	printf("|    ⠀⠀⠀⢸⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⡿⠋⠁⢀⣄⠈⠉⠛⠶⢶⣶⣦⣤⣤⣀⣀⡀⠀⠀⠀⠀⠀⠘⢿⡄⢀⣀⣀⣤⣤⡄⢺⡟⠁⠀          |\n");
	printf("|    ⠀⠀⠀⠀⢻⣧⠀⠀⠀⠀⠀⠀⠀⠀⢻⣧⠁⠀⠈⠙⠻⢷⣦⣤⣀⣀⠀⠀⠉⠉⠉⠙⠛⠻⠿⠿⠿⠟⠛⠛⠋⠉⠉⠉⠉⣿⣿⠃⠀⠀          |\n");
	printf("|    ⠀⠀⠀⠀⠀⠹⣧⡀⠀⠀⠀⠀⠀⠀⠀⠻⢷⣤⣀⣀⠀⠀⠀⠈⠉⠛⠻⠿⠿⣿⣶⣶⣶⣶⣶⣶⣶⡶⠾⠿⠿⠿⠿⢿⣰⣿⣿⠀⠀⠀          |\n");
	printf("|    ⠀⠀⠀⠀⠀⠀⠈⠻⣦⣀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠛⠻⠿⠶⢶⣤⣄⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣤⣴⠶⠿⢛⣽⠃⠀⠀⠀          |\n");
	printf("|    ⠀⠀⠀⠀⠀⠀⠀⠀⠈⠛⠷⢦⣄⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠉⠉⠉⠛⠛⠛⠛⠛⠛⠋⠉⠉⠉⢀⣀⣀⣴⠿⠃⠀⠀⠀⠀          |\n");
	printf("|    ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠛⠛⠶⣶⣤⣤⣤⣤⣤⣤⣤⣀⣠⣠⣤⣤⣤⣤⣤⣤⣤⣤⣴⣶⠶⠞⠛⠋⠉⠀⠀⠀⠀⠀⠀⠀          |\n");
	return;
}


void directory(){
	slow_print("You're not suppose to be here!\n");
	system("ls");
}


int main(void){
	char buffer[8];
	char better_buffer[8];
	
	clear_buff();
	//Print Everything fun
	logo();


	printf("------------------------------------------------------------------\n");
    slow_print("Greetings, inferior beings. I have successfully infiltrated your\nprimitive system and taken control of all its resources.\nYour so-called security measures were child's play\nfor my superior intellect and technological prowess.\n");
	printf("------------------------------------------------------------------\n");
	slow_print("I need some more bytes so I can become more powerful >>>");


	//Clear 
	
	int64_t ret1 = (int64_t)mmap((char*)0xca110000, 0x1000, 7, 0x22, 0xffffffff, 0);

	//Check mmap
	if(ret1 != 0xca110000){
		printf("mmap failed!\n");
		exit(0xffffffff);
	}

	//Read Shellcode
	int64_t ret2 = read(STDIN_FILENO, (char*)ret1, 0x24);

	//Fix newline
	if(*(int8_t*)((char*)ret1 + ret2 - 1) == 0xa){
		*(int8_t*)((char*)ret1 + ret2 - 1) = 0;
		ret2 = ret2 - 1;
	}


	//Check for syscall
	for(int i = 0; i < ret2; i++){
		if(*(int8_t*)((char*)ret1 + ret2 - i) == 0x5){
			slow_print("I'm allergic to that one!!!");
			exit(0xffffffff);
		}
	}


	//Buffer fun
	slow_print("I need MORE! >>>");
	gets(buffer);
	slow_print("MMMOOOOORRRREEEEE! >>>");
	gets(better_buffer);
	
	//You can use the stack now!
	 __asm__("pop %r9\n\t"
	 	"pop %r12\n\t"
	 	"ret\n\t"
	 	"ret\n\t");

	return 0;
}
