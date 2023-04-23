#include <unistd.h>
#include <string.h>
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>

#include "/opt/tigress/3.1/jitter-amd64.c"

int print_art() {
    printf("                                                    ,,wm@@@@@@@@@@@@@@Www,\n");
    printf("                                          ,wm@@BBBBBBBBBBBBBBBBBBBBBBBBB@Ww\n");
    printf("                             ,awww,  ,a#@BBBBBBBBBBBBBBBBBBBBBBBBBB\"%%BBBB@@@N\n");
    printf("                           #@BBBBBBBBBBBBBBBBBBBBBBBBBBBBBB@@@@@@@@@@BBBBB@B@b\n");
    printf("                            ]BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB@@@@@@@@@@Bh\n");
    printf("                            ]BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB@@@@@@@@@@BBM@@@@@w\n");
    printf("                           ]BBBBBBBBBBBBBBBBBBBBBBBBBBBBBB@@@@@@@@@@@@@BBBBBBBB@\n");
    printf("                         ,@BBBB@@@@BBBBBBBBBBBBB@@@@BBBBBB@@@@@@@@@@@@MMMMMMM**`\n");
    printf("                        #BBBBB@@@BBBBBBBBBBBB@@@@@@@B@@@BBBBBB@@@@M\"\n");
    printf("                      ,@BBBBBBBBBBBBBBBBBB@@@@@@@@@@@@@@@@BBBB@@@@N\n");
    printf("                     ]BBBBBBBBBBBBBBBBBB@@@@@@@@@@@@@@@@@M\"&@@@@@@@\n");
    printf("                    &BBBBBBBBBBBBBBBB@@@@@@@@@@@@@@@@@M\"  %%@@@@@@@@b\n");
    printf("                   @BBBBBBBBBBBBBBB@@@@@@@@@@@@@@@M\"`      `@@@@@@@\n");
    printf("                  @BBBBBBBBBBBBBBBR@@@@@@@@@@KM\"            `@@@@@M\n");
    printf("                 &BBBBBBBBBBBBBBB@@@@@@@@MM\"    #@Ww,        BBBBF\n");
    printf("                ]BBBBBBBBBBBBBBBBBB@@M*`         `@@B@W      BM*\n");
    printf("               ]BBBBBBBBBBBBBBBBBM*`             ,@@@@@@@@@mw,,\n");
    printf("               @BBBBBB@BBBBBBMM`               ,@@@@@@@@@@@@@@@@@@Wp\n");
    printf("              ]BBBBBB@@@BBM\"                 ,@@@@BBBBBBBBBBBBBBBBB@@@Wp\n");
    printf("              BBBBBB@@@@M`                  &@@BBBBBBBBBBBBB@@BBB@@BBB@@@W\n");
    printf("             ]BBBBBB@@M`                  z@@BBBBBBBBB%%M@@@@@@@@BBBB@@@BB@@W\n");
    printf("             @BBBBB@@M                   &BBBBBBBB@@@@@@@@@@@@@@@BBBBB@R@@@@@\n");
    printf("             BBBBBB@F                  ,@BBBBBBBBB@MMM**\"`````@@@@MM%%BBBR@@@@N\n");
    printf("            jBBBBBBF                  ,@BBBBBM*\"`           z@@@@F    `\"%%M@@@@\n");
    printf("            ]BBBBBF                  ,@BBM*`               `*M*\"           \"%%@@p\n");
    printf("            ]BBBBM                  ,BBM`\n");
    printf("            ]BBBB                  ,BB`\n");
    printf("         ,w@@BBBB@w               ,@M\n");
    printf("      a@@BBBBBBBBBBB@W,      ,wm@@@@\n");
    printf("   ,4@@@@@@@@@@@@@@@@@@@w ,@BB@@@@@@@p\n");
    printf("  4B@@@@@@@@@@@@@@@@@@@@@@Q```\"\"*MK@@@N\n");
    printf(" @B@@@@@MM*\"\"`````\"\"*M%%@@@@W        `*0@\n");
    printf("]BBBM\"`                 `*%%@\n");
    printf("%%\"`\n\n\n");
}

int ZG9uJ3QgZXZlbiBib3RoZXI() {
    char _f[] = "shctf{0k_but_h4v3_y0u_s33n_th3_m1c3}";
    pid_t parentPID = getppid();
    char filename[20];
    char comm[32];

    snprintf(filename, 20, "/proc/%d/comm", parentPID);
    FILE *procName = fopen(filename, "r");
    fgets(comm, 32, procName);
    for (int i = 0; i < 32; i++) {
        if (comm[i] == '\n') {
            comm[i] = 0x00;
            break;
        }
    }

    if (strncmp("tidbits", comm, 7) != 0) {
        printf("\nWas that some kind of patch?  The dolphins don't like to be touched, and ran away from you.\n");
        return 1;
    }
    printf("\n%s\n", _f);
}

int tricks() {
    FILE *grep = popen("/bin/grep tidbits /proc/*/comm", "r");
    if (grep == NULL) {
        printf("ERROR: This challenge depends on grep.\n");
        exit(1);
    }

    char result[1024];

    printf("\n");
    int count = 0;
    for (; fgets(result, 1024, grep) != NULL; count++) {
        if (count > 5) {
            break;
        }
        printf("Performed trick %c...\n", 'A' + count);
    }
    if (count > 5) {
        printf("\nYou overfed the dolphins and they decided to take a nap.\n");
    }
    else if (count < 5) {
        printf("\nYou ran out of treats.  The dolphins are no longer following your lead.\n");
    }
    else {
        return 0;
    }
    return 1;
}

int main() {
    print_art();

    printf("Welcome, human, to the 42nd centennial dolphin acrobatics show!  Better get to it.\nThese dolphins aren't going to train themselves...\n");

    pid_t parentPID = getppid();
    char filename[20];
    char comm[32];
    int status = 0;

    // Get parent process name
    snprintf(filename, 20, "/proc/%d/comm", parentPID);
    FILE *procName = fopen(filename, "r");
    fgets(comm, 32, procName);
    for (int i = 0; i < 32; i++) {
        if (comm[i] == '\n') {
            comm[i] = 0x00;
            break;
        }
    }


    // Is the binary running under fish?
    if (strncmp("fish", comm, 4) == 0) {
        printf("\nThe dolphins aren't in the mood for fish right now.\n");
        return 0;
    }

    // How about bash?
    if (strncmp("bash", comm, 4) == 0) {
        printf("\nThe dolphins don't appreciate your threats of violence.\n");
        return 0;
    }

    // Tidbits perhaps?
    if (strncmp("tidbits", comm, 7) == 0) {
        printf("\nUpon seeing the tidbits, the dolphins begin their performance.\n");
        printf("\nAs you give them the signal, you are amazed by the dolphins' uncanny ability to\nperform a double-backwards-somersault through a hoop whilst whistling \"The Star\nSpangled Banner.\"  You can't help but wonder if there's some hidden meaning behind\ntheir actions.\n");
        
        if (tricks() == 0) {
            ZG9uJ3QgZXZlbiBib3RoZXI();
        }

        return 0;
    }

    printf("\nThe dolphins are hungry...\n");
    return 0;
}
