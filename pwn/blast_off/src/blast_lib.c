#include <stdio.h>
#include <stdlib.h>



void blast_off(int three, int two, int one){
    char command[30] = "/bin/cat /flag.txt\x00";
    char arg[10] = "/flag.txt\x00";

    if (three == 3){
        sleep(1);
        printf("3...");
        if (two == 2){
            sleep(1);
            printf("2...");
            if (one == 1){
                sleep(1);
                printf("1...\nBLAST_OFF\n");
                system(command);
                
            }
            else {
                printf("That's not how you count down\nIt's 3 2 1 BLAST OFF()\n");
            }
        }
        else {
            printf("That's not how you count down\nIt's 3 2 1 BLAST_OFF()\n");
        }
    }
    else {
        printf("That's not how you count down\nIt's 3 2 1 BLAST_OFF()\n");
    }
}
