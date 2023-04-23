#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

void rip(){
	printf("You never found your ship, and wandered the planet aimlessly for the rest of your life.\n");
	exit(0);
}

void success() {
	printf("You made it back to your ship successfully, you feel a weird sensation in your chest however... \n");
	system("cat flag.txt");
}

int main() {


 	printf("                .                                            .\n");
    printf("     *   .                  .              .        .   *          .\n");
    printf("  .         .                     .       .           .      .        .\n");
    printf("        o                             .                   .\n");
    printf("         .              .                  .           .\n");
    printf("          0     .\n");
    printf("                 .          .                 ,                ,    ,\n");
    printf(" .          \\          .                         .\n");
    printf("      .      \\   ,\n");
    printf("   .          o     .                 .                   .            .\n");
    printf("     .         \\                 ,             .                .\n");
    printf("               #\\##\\#      .                              .        .\n");
    printf("             #  #O##\\###                .                        .\n");
    printf("   .        #*#  #\\##\\###                       .                     ,\n");
    printf("        .   ##*#  #\\##\\##               .                     .\n");
    printf("      .      ##*#  #o##\\#         .                             ,       .\n");
    printf("          .     *#  #\\#     .                    .             .          ,\n");
    printf("                      \\          .                         .\n");
    printf("____^/\\___^--____/\\____O______________/\\/\\---/\\___________---______________\n");
    printf("   /\\^   ^  ^    ^                  ^^ ^  '\\ ^          ^       ---\n");
    printf("         --           -            --  -      -         ---  __       ^\n");
    printf("   --  __                      ___--  ^  ^                         --  __\n");
    printf("\n\n\n");

	printf("You are lost on a hostile alien planet. You gotta navigate your way back to your ship! (Acceptable input is N, S, E, W):\n");
	
	char buff[26];
	fgets(buff, 26, stdin);
	
	if (buff[0] != ('\'' ^ 0x69)) { 
		rip();
	} else if (buff[1] != ('q' ^ 0x34)) { 
		rip();
	} else if (buff[2] != 78) { 
		rip();
	} else if (buff[3] != 87) { 
		rip();
	} else if (buff[4] != 83) { 
		rip();
	} else if (buff[5] != ('\x11' ^ 0x42)) { 
		rip();
	} else if (buff[6] != ('V' ^ 0x13)) { 
		rip();
	} else if (buff[7] != 'W') { 
		rip();
	} else if (buff[8] != ('5' ^ 'f')) { 
		rip(); 
	} else if (buff[9] != ('N' ^ '\x00')) { 
		rip();
	} else if (buff[10] != (13*5) + 4) { 
		rip();
	} else if (buff[11] != ((70 + 8) % 3209)) { 
		rip();
	} else if (buff[12] != (83 % 84)) { 
		rip();
	} else if (buff[13] != 83) { 
		rip();
	} else if (buff[14] != (783/9) ) { 
		rip();
	} else if (buff[15] != 'E') { 
		rip();
	} else if (buff[16] != ('.' ^ 'k') ) { 
		rip();
	} else if (buff[17] != ('\x06' ^ 'H') ) { 
		rip();
	} else if (buff[18] != ('>' ^ 0x69)) { 
		rip();
	} else if (buff[19] != ('9' ^ 'j')) { 
		rip();
	} else if (buff[20] != ('!' ^ 'o')) { 
		rip();
	} else if (buff[21] != ('7' ^ 'y')) { 
		rip();
	} else if (buff[22] != (224 - 155)) { 
		rip();
	} else if (buff[23] != 83) { 
		rip();
	} else if (buff[24] == 'S') { 
	
	success();
}
	return 0;
}
