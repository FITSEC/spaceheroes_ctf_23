#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

__attribute__((constructor)) void ignore_me() {
    setbuf(stdin, NULL);
    setbuf(stdout, NULL);
    setbuf(stderr, NULL);
}

void logo() {
	printf("--------------------------------------------------------------------------------\n");
	printf("MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM\n");
	printf("MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM\n");
	printf("MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM\n");
	printf("MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM\n");
	printf("MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMNX0kxddddkOKNWMMMMMMMMMMMMMMMMMMMMM\n");
	printf("MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMWKxc,.         .':d0NMMMMMMMMMMMMMMMMMM\n");
	printf("MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMNko:.                 .,dKWMMWXKOk0WMMMMMM\n");
	printf("MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMWO;             .;;,.      .cl:,...:0WMMMMMM\n");
	printf("MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMNd.            ;kXWWNXx,           cXMMMMMMMM\n");
	printf("MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMNo.            ,00dc;;:lc.        .oNMMMMMMMMM\n");
	printf("MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMWk.             ':.                lNMMMMMMMMMM\n");
	printf("MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMN:                                 .;oONWMMMMMM\n");
	printf("MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMK,                                     .cxKWMMM\n");
	printf("MMMMMWWWWMMMMMMMMMMMMMMMMMMMMMMMMK,                                   ..,:lONMMM\n");
	printf("MMMMWd,;;;:cclllooddxkkOO00KKKXXNK:                                 .o0XWWMMMMMM\n");
	printf("MMMMNc                    .......'.                                 .OMMMMMMMMMM\n");
	printf("MMMMWd.                                                             '0MMMMMMMMMM\n");
	printf("MMMMMK;                                                             ;XMMMMMMMMMM\n");
	printf("MMMMMMO'                                                            oWMMMMMMMMMM\n");
	printf("MMMMMMWO'                                                          ,KMMMMMMMMMMM\n");
	printf("MMMMMMMMK:                                                        .xWMMMMMMMMMMM\n");
	printf("MMMMMMMMMNx,                                                      lNMMMMMMMMMMMM\n");
	printf("MMMMMMMMMMMXx,.                                                 .lNMMMMMMMMMMMMM\n");
	printf("MMMMMMMMMMMMMNOl'                                              .oNMMMMMMMMMMMMMM\n");
	printf("MMMMMMMMMMMMMMMMXkl,.                                         'kWMMMMMMMMMMMMMMM\n");
	printf("MMMMMMMMMMMMMMMMMMMWKkl'                                    .oKMMMMMMMMMMMMMMMMM\n");
	printf("MMMMMMMMMMMMMMMMMMWXOo;.                                  .l0WMMMMMMMMMMMMMMMMMM\n");
	printf("MMMMMMMMMMMMMMMNOd:.                                    ,oKWMMMMMMMMMMMMMMMMMMMM\n");
	printf("MMMMMMMMMMMN0dc'                                    .,lONMMMMMMMMMMMMMMMMMMMMMMM\n");
	printf("MMMMMMMWKxc,.                                   .,cd0NMMMMMMMMMMMMMMMMMMMMMMMMMM\n");
	printf("MMMWXkl,.                              ...';.   :XMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM\n");
	printf("MMMNOo:;,'.....         .....',;:clodkOKKXNNl   cNMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM\n");
	printf("MMMMMMMWWNXXK000OOOOOO000KKXXNWWMMMMMMMMMMMWo   cNMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM\n");
	printf("MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMN0;   'ok0XWWMMMMMMMMMMMMMMMMMMMMMMMMM\n");
	printf("MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMWWO;.       ..,:lOWMMMMMMMMMMMMMMMMMMMMMM\n");
	printf("MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMWWk'..;loc;'.    :XMMMMMMMMMMMMMMMMMMMMMM\n");
	printf("MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMWXKXWMMMWNKOxddKWMMMMMMMMMMMMMMMMMMMMMM\n");
	printf("MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM\n");
	printf("MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM\n");
	printf("MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM\n");
	printf("--------------------------------------------------------------------------------\n");
}

void vuln() {
	char buf[100];
	printf("Space Birds Arent Real\n");
	printf("Serial Code: %p\n",rand);
	printf("--------------------------------------------------------------------------------\n");
	printf("Report updated drone sightings in your area >>> ");
	read(0,&buf,108);
    	printf(buf);
}

int main() {
	logo();
	vuln();
}
