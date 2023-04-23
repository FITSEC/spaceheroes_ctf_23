#include <stdio.h>
#include <strings.h>
#include <stdlib.h>

__attribute__((constructor)) void ignore_me() {
    setbuf(stdin, NULL);
    setbuf(stdout, NULL);
    setbuf(stderr, NULL);
}


extern void blast_off(int a, int b, int c);

int main(void){

    print_logo();
    blast_off(1, 2, 3);

    printf("The Falcon 9 Heavy is one of the most powerful operational rockets to date and its reusable\n");
    printf("---------------------------------------------------\n");
    printf("| PUTS_PLT %p      | BROP_GADGET %p   |\n| BLAST_OFF GOT %p | MAIN %p          |\n", 0x400690,0x400b4a, 0x602038, 0x400991);
    printf("---------------------------------------------------\n");


    vuln();

    printf("The falcon 9 is ready for launch at the time: ");
    system("date");

    return 0;
}


void print_quote(){
    char *arr = "Keep looking, space is vast and I might not be in this binary\n";
    char *arr2 = "This is not the shell string you're looking for\n";
    char *arr3 = "This is not the shell string you're looking for\n";
    char *arr4 = "This is not the shell string you're looking for\n";
    char *arr5 = "This is not the shell string you're looking for\n";
    char *arr6 = "This is not the shell string you're looking for\n";
    char *arr7 = "I'm telling you it's not in the binary, we're getting ready to BLAST OFF\n";
    arr[0] = 'k';
    arr2[0] = 't';
    printf(arr);
    printf(arr2);
    printf(arr3);
    printf(arr4);
    printf(arr5);
    printf(arr6);
    printf(arr7);
}


void vuln(){
    char buf[24];


    puts("Please enter the launch codes to start: ");

    gets(buf);

    return 0;
}



void print_logo(){


    printf("                                       _,'/\n");
    printf("                                  _.-''._:\n");
    printf("                          ,-:`-.-'    .:.|\n");
    printf("                         ;-.''       .::.|\n");
    printf("          _..------.._  / (:.       .:::.|\n");
    printf("       ,'.   .. . .  .`/  : :.     .::::.|\n");
    printf("     ,'. .    .  .   ./    \\ ::. .::::::.|\n");
    printf("   ,'. .  .    .   . /      `.,,::::::::.;\\\n");
    printf("  /  .            . /       ,',';_::::::,:_:\n");
    printf(" / . .  .   .      /      ,',','::`--'':;._;\n");
    printf(": .             . /     ,',',':::::::_:'_,'\n");
    printf("|..  .   .   .   /    ,',','::::::_:'_,'\n");
    printf("|.              /,-. /,',':::::_:'_,'\n");
    printf("| ..    .    . /) /-:/,'::::_:',-'\n");
    printf(": . .     .   // / ,'):::_:',' ;\n");
    printf(" \\ .   .     // /,' /,-.','  ./\n");
    printf("  \\ . .  `::./,// ,'' ,'   . /\n");
    printf("   `. .   . `;;;,/_.'' . . ,'\n");
    printf("    ,`. .   :;;' `:.  .  ,'\n");
    printf("   /   `-._,'  ..  ` _.-'\n");
    printf("  (     _,'``------''\n");
    printf("   `--''\n");


    return;
}

void lose(){
    blast_off(1,2,3);
}
