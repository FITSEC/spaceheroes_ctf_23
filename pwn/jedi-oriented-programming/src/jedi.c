// gcc -fPIE -Wl,-z,norelro -fstack-protector problem.c -o chal.bin

#include <stdio.h>
#include <stdint.h>
#include <string.h>
#include <stdlib.h>

char review[1000];
char *review_names[5];

void quote1() {
    printf("\"Do or do not. There is no try.\"\n");
    // Move %rdi to %rsi
    __asm__("mov %rdi, %rsi;"
            "jmp %r8");
}

void quote2() {
    printf("\"The Force is not a power you have. It's not about lifting rocks.\"\n");
    // Dispatch
    __asm__("add $8, %r9;"
            "jmp (%r9)");
}

void quote3() {
    printf("\"Your focus determines your reality..\"\n");
    // Bit shift %rdi to left
    __asm__("shl $1, %rdi;"
            "jmp %r8");
}

void quote4() {
    printf("\"In my experience, there's no such thing as luck.\"\n");
    // Set %rdi to zero
    __asm__("xor %rdi, %rdi;"
            "jmp %r8");
}

void quote5() {
    printf("\"A Jedi uses the Force for knowledge and defense, never for attack...\"\n");
    // Jump to dispatch
    __asm__("mov %0, %%r8;"
            "mov %1, %%r9;"
            "add $16, %%r8;"
            "jmp %%r8"
            :
            : "g" (quote2), "g" (review));
}

void quote6() {
    printf("\"I find your lack of faith disturbing.\"\n");
    // Add one to %rdi
    __asm__("add $1, %rdi;"
            "jmp %r8");
}

void win(uint64_t arg1, uint64_t arg2) {
    int flag = fopen("flag.txt", "r");
    if (arg1 == 0x6461726b && arg2 == 0x73696465) {
        char buff[256];
        fgets(buff, 255, flag);

        printf("--------------------------------------------------------------------------------\n\n");
        printf("\"...Power is an illusion of perception. It is what we believe is possible, or \n");
        printf("what we hope might occur. It is a tool, like a lightsaber, but merely having it \n");
        printf("does not make one great. Power is something to be wielded and harnessed, a means\n");
        printf("to an end. And that end is the only thing that matters. For those with the vision\n");
        printf("to see, there is only the Force, and what is required to bend it to one's will.\"\n");
        printf("--------------------------------------------------------------------------------\n\n");

        printf("%s\n", buff);
        return;
    }
    printf("\t \"No one's ever really gone. I have a feeling that this \n");
    printf("\t is the beginning of something truly special\"\n");
}

void fill_reviews() {
    review_names[0] = malloc(16);
    strcpy(review_names[0], "Yoda");
    review_names[1] = malloc(16);
    strcpy(review_names[1], "Luke");
    review_names[2] = malloc(16);
    strcpy(review_names[2], "Qui-Gon Jinn");
    review_names[3] = malloc(16);
    strcpy(review_names[3], "Obi-Wan Kenobi");
    review_names[4] = malloc(16);
    strcpy(review_names[4], "Darth Vader");
}

void logo() {
    puts("MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM");
    puts("MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM");
    puts("MMMMMMMMMMMMMWNWMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMWWWMMMMMMMMMMMMM");
    puts("MMMMMMMMMMMWXkkXMMMMMMMMMMMMMMMMMMMMMMWWWWMMMMMMMMMMMMMMMMMMMMMMXkOXWMMMMMMMMMMM");
    puts("MMMMMMMMMWXkcc0WMMMMMMMMMMMMMMMMMMMMMMWXXWMMMMMMMMMMMMMMMMMMMMMMWOcckXWMMMMMMMMM");
    puts("MMMMMMMWNOl;;xNMMMMMMMMMMMMMMMMMMMMMMMNKKNMMMMMMMMMMMMMMMMMMMMMMMNx;;lONMMMMMMMM");
    puts("MMMMMMWKd;,,lKWMMMMMMMMMMMMMMMMMMMMMMMXOOXMMMMMMMMMMMMMMMMMMMMMMMW0c,,:dKWMMMMMM");
    puts("MMMMMW0l,,,;xNMMMMMMMMMMMMMMMMMMMMMMMWKkkKWMMMMMMMMMMMMMMMMMMMMMMMNd;,,,l0WMMMMM");
    puts("MMMMWOc,,,,:OWMMMMMMMMMMMMMMMMMMMMMMMWKxxKWMMMMMMMMMMMMMMMMMMMMMMMWO:,,,,cOWMMMM");
    puts("MMMWOc,,,,,lKWMMMMMMMMMMMMMMMMMMMMMMMW0dd0WMMMMMMMMMMMMMMMMMMMMMMMW0c,,,,,cOWMMM");
    puts("MMW0c,,,,,,lKWMMMMMMMMMMMMMMMMMMMMMMMWOooOWMMMMMMMMMMMMMMMMMMMMMMMWKc,,,,,,c0WMM");
    puts("MWXo,,,,,,,c0WMMMMMMMMMMMMMMMMMMMMMMMWkcckWMMMMMMMMMMMMMMMMMMMMMMMW0c,,,,,,,oXWM");
    puts("MNx;,,,,,,,:kWMMMMMMMMMMMMMMMMMMMMMMMWk::kWMMMMMMMMMMMMMMMMMMMMMMMWk;,,,,,,,;xNM");
    puts("MKl,,,,,,,,,oXWMMMMMMMMMMMMMMMMMMMMMMNx::xNMMMMMMMMMMMMMMMMMMMMMMWXo,,,,,,,,,lKM");
    puts("MXd;,,,,,,,,:kNMMMMMMMMMMMMMMMMMMMMMMNd;;dNMMMMMMMMMMMMMMMMMMMMMMNx;,,,,,,,,;oXM");
    puts("MMNOl;,,,,,,,:kNMMMMMMMMMMMMMMMMMMMMMNd;;dNMMMMMMMMMMMMMMMMMMMMMNk:,,,,,,,,ckXWM");
    puts("WWWWXkc;,,,,,,:xXWMMMMMMMMMMMMMMMMMMMXo,,oXMMMMMMMMMMMMMMMMMMMWXx:,,,,,,,cxKWWWM");
    puts("Xxx0NNXkl;,,,,,,lkXWMMMMMMMMMMMMMMMMMXl,,lXMMMMMMMMMMMMMMMMMWNOl;,,,,,;cxKNN0xkN");
    puts("Xl,;cdOKXOdc;,,,,;cdOXWMMMMMMMMMMMMMMKl,,lKMMMMMMMMMMMMMMWX0xl;,,,,,:okKKOxl;,oX");
    puts("Xo,,,,,:ldkkdl:;,,,,,oKWMMMMMMNNWMMMMKc,,cKMMMMWNNMMMMMMWKo;,,,,,:ldkkxo:;,,,,dN");
    puts("Wx;,,,,,,,,;:llc;,,,,c0WMMMMMMWKkOXWW0c,,c0WWXOkKWMMMMMMW0c,,,,;cllc:,,,,,,,,;xW");
    puts("W0c,,,,,,,,,,,,,,,,,,c0WMMMMMMMWKxox0k:,,:k0xoxKWMMMMMMMW0c,,,,,,,,,,,,,,,,,,c0W");
    puts("MNOl;,,,,,,,,,,,,,,,,:OWMMMMMMMMWNOl:cllllc:lONWMMMMMMMMWk:,,,,,,,,,,,,,,,,,cONW");
    puts("MMWXkc;,,,,,,,,,,,,,,;xNMMWNXK0OOkxlckXNNXkclxkO0KKXNWMMNd;,,,,,,,,,,,,,,,cxXWMM");
    puts("MMMMWXkl;,,,,,,,,,,,,,lKWMWNX0OkxxdlckNWWNkccodxkO0KNWMWKl,,,,,,,,,,,,,;cxKWMMMM");
    puts("MMMMN0KKOd:,,,,,,,,,,,:kWMMMMMMMWN0l::lool:;o0NWWWMMMMMWk;,,,,,,,,,,,:oOKKKNMMMM");
    puts("MMMMNkcldxxdl:;,,,,,,,,lKWMMMMMWXkodkl,,,,lxolkNWMMMMMW0l,,,,,,,,,:ldkkxllkNMMMM");
    puts("MMMMWNk:,,;cllc;,,,,,,,;oKWMMMWKkkKNXo,,,,oXN0kkXWMMMWKo,,,,,,,,;cllc:,,:kNWMMMM");
    puts("MMMMMMWOc,,,,,,,,,,,,,,,;oKWMWNXNWMWXo,,,,oXMMWNXNMMWKo;,,,,,,,,;,,,,,,lONMMMMMM");
    puts("MMMMMMMWKd:,,,,,,,,,,,,,,,lONWMMMMMWKl,,,,lKWMMMMMMNOl,,,,,,,,,,,,,,,:dKWMMMMMMM");
    puts("MMMMMMMMMN0o;,,,,,,,,,,,,,,:o0NWMMMWKl,,,,lKWMMMMNKd:,,,,,,,,,,,,,,;o0NMMMMMMMMM");
    puts("MMMMMMMMMMMNOoc:;,,,,,,,,,,,,;okXWWW0c,,,,c0WWWXOo:,,,,,,,,,,,,;:coONMMMMMMMMMMM");
    puts("MMMMMMMMMMMMWWNK0Okxdolc:;,,,,,,:oxOx:,,,,:k0kdc;,,,,,;:clodxkO0KNWWMMMMMMMMMMMM");
    puts("MMMMMMMMMMMMMMMMMN0dlc:;;,,,,,,,,,,;;,,,,,,;;,,,,,,,,,,;;:cld0NMMMMMMMMMMMMMMMMM");
    puts("MMMMMMMMMMMMMMMMMMWXOdl:,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,;:ldOXWMMMMMMMMMMMMMMMMMM");
    puts("MMMMMMMMMMMMMMMMMMMMMWNKOxol:;,,,,,,,,,,,,,,,,,,,;;cldxOKNWMMMMMMMMMMMMMMMMMMMMM");
    puts("MMMMMMMMMMMMMMMMMMMMMMMMMMWNXKOkxxdooollllooodxxkOKXNWMMMMMMMMMMMMMMMMMMMMMMMMMM");
    puts("MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMWWWWWWWWWWWWMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM");
    puts("MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM");
    puts("MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM");
}

int main() {
    fill_reviews();
    printf("--------------------------------------------------------------------------------\n\n");
    logo();
    printf("--------------------------------------------------------------------------------\n\n");
    printf("\"Who's more foolish, the fool or the fool who follows him? Remember, a Jedi's \n");
    printf("strength flows from the Force. But beware. Anger, fear, aggression. The dark \n");
    printf("side are they. Once you start down the dark path, forever will it dominate your \n");
    printf("destiny.\"\n");
    printf("--------------------------------------------------------------------------------\n\n");

    printf("Please enter your favorite jedi quote: \n");
    printf(">>> ");
    fflush(stdout);
    fgets(review, 1000, stdin);

    char num_str[10];
    printf("Which quote number do you want to be? \n");
    printf(">>> ");
    fflush(stdout);
    fgets(num_str, 10, stdin);
    int num = atoi(num_str);
    if (num >= 5)
        exit(0);

    char name[9];
    printf("Which jedi said that? \n");
    printf(">>> ");
    fflush(stdout);
    fgets(name, 9, stdin);
    memcpy(review_names[num], name, 8);

    exit(0);
}
