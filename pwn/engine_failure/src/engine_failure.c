#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <unistd.h>



__attribute__((constructor)) void ignore_me() {
    setbuf(stdin, NULL);
    setbuf(stdout, NULL);
    setbuf(stderr, NULL);
}

void logo(){

    printf("                     `. ___\n");
    printf("                    __,' __`.                _..----....____\n");
    printf("        __...--.'``;.   ,.   ;``--..__     .'    ,-._    _.-'\n");
    printf("  _..-''-------'   `'   `'   `'     O ``-''._   (,;') _,'\n");
    printf(",'________________                          \`-._`-','\n");
    printf(" `._              ```````````------...___   '-.._'-:\n");
    printf("    ```--.._      ,.                     ````--...__\\-.\n");
    printf("            `.--. `-`                       ____    |  |`\n");
    printf("              `. `.                       ,'`````.  ;  ;`\n");
    printf("                `._`.        __________   `.      \\'__/'\n");
    printf("                   `-:._____/______/___/____`.     \\  `\n");
    printf("                               |       `._    `.    \\\n");
    printf("                               `._________`-.   `.   `.___\n");
    printf("                                             SH   `------'`\n");

}

void vuln(char* msg) {
    char buf[32];
    puts(msg);
    gets(buf);
    gets(buf);
}

void menu() {
    int choice;

    while(1){
        printf("\n\nChoose an option:\n");
        printf("1) Connect\n");
        printf("2) What's in the database\n");
        printf("3) Shell\n");
        printf("4) Exit\n");
        scanf("%d", &choice);
        switch (choice) {
            case 1:
                printf("\n\nChoose an option:\n");
                printf("1) Back to Earth\n");
                printf("2) Satellite\n");
                int connect_choice;
                scanf("%d", &connect_choice);
                if (connect_choice == 1) {
                    
                    vuln("write a msg you want to send >>> ");
                    
                    
                } else if (connect_choice == 2) {
                    // Code for satellite
                    printf("Connecting to satellite......\n");
                    sleep(3);
                    printf("connection failed......");
                    sleep(1);
                    break;
                } else {
                    printf("Invalid option.\n");
                    break;
                }
                break;
            case 2:
                // Code for database
                printf("Coordinates: %p\n", puts);
                break;
            case 3:
                // Code for shell
                printf("/bin/sh not found. System crashed.\n");
                break;
            case 4:
                printf("Exiting program...\n");
                return;
            default:
                printf("Invalid option.\n");
        }
    
    }
}

int main() {
    logo();
    printf("You have to stop this crash.\n");
    menu();
    return 0;
}

