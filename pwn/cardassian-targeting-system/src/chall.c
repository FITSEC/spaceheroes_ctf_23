#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <unistd.h>
#include <sys/mman.h>

void print_art() {
    printf("                                      ..,,;;,,,..\n");
    printf("                                  ,,y@@KMMM**MMK@Wwp.\n");
    printf("                                ;w@@M`           `%%@@wp\n");
    printf("                              :a@@M                 %%@@p>\n");
    printf("                             :#@@M                   \"@@@\n");
    printf("                            .j@@M   y             ,   1@@M\n");
    printf("                         .,:,@@@h   !@@p       ,@@M    @@@,...\n");
    printf("                     ,:,w@@@KMM\"     %%@@@@p ,@@@@K     `%%KK@@Ww,>.\n");
    printf("                   :,@@KM\"`             `1@@@M`             `\"MK@@p>\n");
    printf("                ,{w@KM`                   @@@h                  `*K@W .\n");
    printf("               {a@M\"                      $@@                      `%%@W\n");
    printf("             :,@M\"              ,wM*\"*MWww]@@,wmMM\"*%%W.              `%%@p.\n");
    printf("            {#@M               JK        ,]@@,        %%@               \"@N\n");
    printf("           ,@@`                $H     wM*,@@@p*%%@     ]@                `%%@\n");
    printf("          ,@@                  @b    jM j@@@@@N 1N     @p                 %%@\n");
    printf("         ,@@                  j@    ,@  @@@@@@@  @p    @@                  @@\n");
    printf("        :#@M                  @K    @M  @@@@@@@H 1@    $@                  `@N\n");
    printf("       ,j@@                   @@    %%@, `%%@@@M` ,@M    &@H               ,m\"1@b\n");
    printf("        @@D         a@@@@@    @@@    \"@p        @D    j@@H            ,M\"    @@\n");
    printf("        %%@@@@w.     @@@@@@K   @@@     $N       j@     @@@H         ,M\"   ,@@@KM\n");
    printf("         ``*%%@@@@p  \"%%K@KM    @@@N    ]@       @M    j@@@b,,,,wwW^\"  ,w@@@M*``\n");
    printf("            ``\"%%@@@@.         %%@@@     @b     ,@     @@@@          a@@KM\"`\n");
    printf("                `\"%%@@@p       `@@@N    1@     $K    ]@@@H       ,@@@M\"'\n");
    printf("                  ``\"%%@@p      1@@@p   J@     @H    @@@M      ,@@M\"`\n");
    printf("                     \"`%%@@W     %%@@N    @@   j@    $@@@     ,@@M``\n");
    printf("                       ``%%@@p   `@@@p   ]@   $M   ,@@@h   ,@@M `\n");
    printf("                         \"`%%@@p  1@@@    @p  @F   @@@M  ,@@M \"\n");
    printf("                           T\"@@@  %%@@b   $@w@K   j@@@  #@@\"\n");
    printf("                            ` %%@@N @@@   J@@@N   &@@ a@@M '\n");
    printf("                               1@@@@@@@   @@@   j@@@@@@M\n");
    printf("                               T\"@@@@@@W  1MM  a@@@@@@F\n");
    printf("                                T\"@@@ *%%@    ,@KM @@@H\n");
    printf("                                 !1@@h  \"%%@w@M\"   @@M\n");
    printf("                                   $@@           j@@\n");
    printf("                                  `J@N   ,www.   #@N\n");
    printf("                                    @@  j@   %%p  &@\n");
    printf("                                    $@ #M     %%N @@\n");
    printf("                                    @@@M       %%@@@\n");
    printf("                                    @@M    ,    1@@\n");
    printf("                                  :#@@h   ,@p    @@N\n");
    printf("                                 :]@@@    @M@    @@@N\n");
    printf("                               :,@@@@@   @@ @@   $@@@@p>\n");
    printf("                             !j@@@@@@N a@@\" `%%@p j@@@@@@N\n");
    printf("                               @@@@@@@@MF     *%%@@@@@@@@\n");
    printf("                               \"@@@D`      @     ``T@@@N\n");
    printf("                               `1@@N      &@@      $@@M\n");
    printf("                                 @@@p    j@@@N    ,@@@\n");
    printf("                                 \"@@@    j@@@N    @@@N\n");
    printf("                                 `%%@@N   $@K@@   j@@M\n");
    printf("                                   @@@   @N j@   @@@\n");
    printf("                                  `\"@@@  @H j@p #@@N\n");
    printf("                                   `%%@@pj@H ]@D,@@M\n");
    printf("                                     @@@j@h `@N&@@\n");
    printf("                                    `\"****   ****\"\n");
}

void print_menu() {
    printf("Please choose one of the following actions:\n\n");

    printf("[1] Enter all coordinates\n");
    printf("[2] List all coordinates\n");
    printf("[3] Modify specific set of coordinates\n");
    printf("[4] List specific set of coordinates\n\n");

    printf(">>> ");
}

void performAction(int option, long *array) {
    int index;
    printf("\n");
    switch (option) {
        case 1:
            for (int i = 0; i < 10; i++) {
                printf("Target %2d >>> ", i + 1);
                scanf("%ld", &array[i]);
            }
            break;
        case 2:
            for (int i = 0; i < 10; i++) {
                printf("Target %2d: %ld\n", i + 1, array[i]);
            }
            break;
        case 3:
            printf("Which target will you modify? >>> ");
            scanf("%d", &index);
            printf("New coordinates for Target %d >>> ");
            scanf("%ld", &array[index]);
            break;
        case 4:
            printf("Which target will you list? >>> ");
            scanf("%d", &index);
            printf("Target %d is at these coordinates: %ld\n", index, array[index]);
            break;
        default:
            printf("Invalid choice\n");
            break;
    }
    printf("\n");
}

int main() {
    print_art();
    printf("\n");
   
    char *name = malloc(64);
    long array[10];
    int selectedOption;

    int pageSize = getpagesize();
    posix_memalign(&name, pageSize, pageSize);
    mprotect(name, pageSize, PROT_READ | PROT_WRITE | PROT_EXEC);

    printf("Please enter your name and rank >>> ");
    fgets(name, 64, stdin);

    printf("\nWelcome back, %s\n", name);

    while (true) {
        print_menu();
        scanf("%d", &selectedOption);
        getchar();
        performAction(selectedOption, array);
    }

    return 0;
}
