#include <stdio.h>
#include <stdlib.h>

#define MAX_TAPE_SIZE 30000

void interpret(char* code);

int main(int argc, char** argv) {
  logo();
    if (argc != 1) {
        printf("Usage: %s < input\n", argv[0]);
        return 1;
    }
    
    char code[MAX_TAPE_SIZE];
    if (fgets(code, MAX_TAPE_SIZE, stdin) == NULL) {
        printf("Error: failed to read input\n");
        return 1;
    }

    interpret(code);
    return 0;
}


void interpret(char* code) {
    char tape[MAX_TAPE_SIZE] = {0};
    char* ptr = tape;
    char c;
    while ((c = *code)) {
        switch (c) {
            case '>':
                ptr++;
                break;
            case '<':
                ptr--;
                break;
            case '+':
                (*ptr)++;
                break;
            case '-':
                (*ptr)--;
                break;
            case '.':
                putchar(*ptr);
                break;
            case ',':
                *ptr = getchar();
                break;
            case '[':
                if (*ptr == 0) {
                    int loop_count = 1;
                    while (loop_count > 0) {
                        code++;
                        if (*code == '[') {
                            loop_count++;
                        } else if (*code == ']') {
                            loop_count--;
                        }
                    }
                }
                break;
            case ']':
                if (*ptr != 0) {
                    int loop_count = 1;
                    while (loop_count > 0) {
                        code--;
                        if (*code == '[') {
                            loop_count--;
                        } else if (*code == ']') {
                            loop_count++;
                        }
                    }
                }
                break;
            default:
                // ignore any characters that are not brainfuck commands
                break;
        }
        code++;
    }
		int fin = 0;
    for (int i = 0; i < MAX_TAPE_SIZE; i++){
      char c0 = tape[i];
		  fin -= *((long*)&c0);
    }
    if (fin == 1932222150){
      win();
    }
}
void logo() {
  printf("The brains from Futurama are power-hungry and ruthless, seeking to dominate and control all other life forms in the universe. We here at FIT think this is a F***y thing to do.\n>>> ");
}
void win() {
    FILE* fp = fopen("flag.txt", "r");
    if (fp == NULL) {
        perror("Error opening file");
        return;
    }

    int c;
    while ((c = fgetc(fp)) != EOF) {
        putchar(c);
    }

    fclose(fp);
}
