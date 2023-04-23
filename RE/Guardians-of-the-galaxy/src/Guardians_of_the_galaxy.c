#include <string.h>
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

__attribute__((constructor)) void ignore_me() {
    setbuf(stdin, NULL);
    setbuf(stdout, NULL);
    setbuf(stderr, NULL);
}

void slow_print(char *message) {
    int len = strlen(message);
    for (int i = 0; i < len; i++) {
        putchar(message[i]);
        fflush(stdout);
        usleep(50000);  // sleep for 50ms
    }
}

char* r(char s[]) {


    
    char *tmp;
    tmp=malloc(sizeof(char)*strlen(s));
    
    
    int i=0;

    for (i=0; i<9; i++) {
        tmp[i]=s[i]-4;
        
    }
    
    return tmp;
   
}


void atox(char *givenStr, char *hexStr)
{
    
    int i, j = 0;
   
    for (i = 0; i < 9; i++)
    {
        sprintf(hexStr + j, "%02X", givenStr[i]);
        j += 2;
        
    }
     hexStr[j] = '\0';
     
}



int logo(){

                                                                                                    
printf("                                                 ...                         \n");               
printf("                                               .!???~:                       \n");               
printf("                                              ^7JJYYJ?7.                     \n");               
printf("                                      .^~^:::!??J?YJJJJ!   .^^:              \n");               
printf("                           :.       ^!????JJYJ???J????J7  :??777.            \n");               
printf("                      .^^~7J?^.    ~?7?????J5J??JJ7J7J?7 :?YJ??J!:           \n");               
printf("                    :!7????JYYJ7!^~YJ?JJ??7JP777J????J??JJJ???J??J^          \n");               
printf("                    !YJ7JYJYYJ?JYJJYJ??JJ??Y577?Y??JJJJ5P???J?JJ?J!          \n");               
printf("                    ?YYJJYYYJJJJYYYJJ?JJ??JY?7?JJJ?JYJYPY??JJJJYYY~          \n");               
printf("                   .JYJY555JJYYYYJYJJ?Y??JYJ???Y??JJJ555JJYYYJYYY?.          \n");               
printf("                   :JYYYY55YJYJYJJJJJ??J?55???JJ???JY5JYJJJJJJYYJ7           \n");               
printf("                   ^YJJYY5YYJYJJJYJJJJJJ55J?J?JJ?JJJYYYJJJJJJYJJJ!           \n");               
printf("                   :JYYY5PYYJJ?JJ?J??JJJPYJ?JJYJJJ?YJJJJJYYJJJYY?~           \n");               
printf("                   .7JYJPYYYJ?????YJJYJYPJYJJJYJJ?J?JYJJJJJJJJJJ?:           \n");               
printf("                    :J5Y5YYY??7777?YJYJYYYYYJJJJYYY?YYJ?J?JJJYJ?7            \n");               
printf("                     ~YYYYYJJ?7?77?JJJJJJJJYJ55JYJJ?J?????J?JYJ?^            \n");               
printf("                     .?YYYJJJJ?J???JJJJJ?JJJJ5YJJJJ???7J?J???JJ7             \n");               
printf("                      7YYJJYJJYYYJJJYJJJJJJJJY?JJJJ?JJJJ?JJ??JJ:             \n");               
printf("                      !YJJJYY555P55Y5JYYJJYJJYJJJJJJYJJJJJ???J~              \n");               
printf("                      ~YY?JYPPGGPBPP5YY5YJYJYYJJYYY55YYY5J??J7.              \n");               
printf("                      ^JJJYB#B##B&&PPYYYJYYYYYYY5B#P5BPYYJ???:               \n");               
printf("                      .JJJJPB####&BGP5YYYYJJYY5G&&&#B##GYJ??~                \n");               
printf("                       7JJ?J55PP55JYYJYY5YJYJYY5#####BBPJ?J?.                \n");               
printf("                       ^JJJJJ?????7?JYYY5YYYJJJJJ5PGP5YJ?Y5Y!                \n");               
printf("                        !JJJJJYYYJ?YYYYYYYYYJY?7?7?Y???J5YJ?7                \n");               
printf("                        .7YYYY5YYYYJYYJYYYYJYJJJYYYJJJYYJ?JY!                \n");               
printf("                         :?YYY5YY5YJ5YYJYJJY5YYYY5YY5P5J?5YJ:                \n");               
printf("                           !Y5YYPPYYYJYYYYJYY5YY555PP5Y?Y5Y7.                \n");               
printf("                            ^JY5555P5YP55YY55555GBB5JYJ5P57                  \n");               
printf("                             .!5P5555YYYY5Y5555GBGY?YY5PJ^                   \n");               
printf("                           ^7J5Y5PP5555Y55P5PGB#GYJJJ5PY7                    \n");               
printf("                    .^~77!?55Y5GBPGGGGGGGGBBB#&#PJYPY555J~                   \n");               
printf("                  ~JYGGP5YGG55PPP5GG#GB##&###&&#B5JYYJJY5J~:.                \n");               
printf("                 75GP555YP&GP555PGBBBPB#BBB#####BGYJJJY?YJJJYJ?^             \n");               
printf("                ^Y5GPPPGB#P5YYY55GGGGGBP5PGBB##BBBG5JJYYJJ?JJY55?.           \n");               
printf("              ^?PP5PGGB##BP5YYYP555PPGPP5PGGGBBBBBGG55JJJJJJJ?JY57           \n");               
printf("         .:^7J5YY5PPGPG##GPP5PP55555YPGP5PPPGGBBBBGGGP55JJY5?JJYY?:.         \n");               
printf("     :!77?JY55JJJYPGBBB&BGGGPBGGPP5YYP55PPPP5GGG##BBB#B55YJJYYJ5YJY?!.       \n");               
printf("    ^JY5YYJ???JYJYY5GBBYJPBBGGPPPP5YYP55PPP55PGBBBBBB#&GYYYYJJ5J?JJYY?.      \n");               
printf("   :JP55YJYJJJYJJJYJJY5J??YYYYJYYYYYYP5PP555PGGBBB###&#J.75YJYY5JYYYYJ7^     \n");               
printf("    :?5PP55YJJYYYYJJYY5YY55555Y55YYJYJY555PGBBBBB####BBY!~JYYJJ5YJ?JYJJ!     \n");               
printf("     .^~!JPP555YYYYJY55JJYYY555555YJYY5YYYY7?777!!!77777~~!?YY555YJJYY?^     \n");               
printf("          .::~!777??JJYYY55YYJJY555YYYYYY7:         ..::::^~7J555555Y!.      \n");               
printf("                    ....:^~~!??JJ??????~:                  ..:~7???!:        \n");           
printf("-----------------------------------------------------------------------------\n");                       
                                                                                                    



}


int main() {
   
    logo();
    char s[27];
    char* message = "\nIf you are a true Guardian you know the password!!\npassword >>> ";
    slow_print(message);
    char* flag = "Welcome aboard Guardian, here is your reward for saving our galaxy flag :  ";
    char* wrong_input = "Well!!! you are not a True Guardian.\nAs I said earlier only a true Guardian knows the password!!!\n \nStar Lord will lead you to the exit!!!!!!!!";
    scanf("%s", s);
    char t[9];
    int j=0,i=0,k=9,v=18;
    int p1=0;
    int p2=0;
    int p3=0;
   
   
    if( strlen(s)==27){
   
   
 
    for(i=0; i<9;i++)
    {  
       t[j]=s[i];
       j++;
    }
   
    int a=0,hi=0;
    char x[9];
    char h[18]={},fh[18]={};
    
    
    for(k=9; k<18 ; k++)
    {
       x[a]=s[k];
       a++;
    }

 
 atox(x,h);
 for(hi=0;hi<9;hi++){
       fh[hi]=h[hi];
    }   
    int b=0,ii=0;
    char z[50];
    
    for(v=18; v<27;v++)
    {  
       z[b]=s[v];
       b++;
    }
  
   r(t); 
   r(z);
    
    if(strncmp(r(t),"od_pbw1gu",9) == 0){
       p1=1;
       
       
     }
    if( (strncmp(fh, "5F31735F6E30745F74",18) == 0) ||(strncmp(h, "5F31735F6E30745F74",18) == 0) ){
       p2=1;
       
    }
    if(strncmp(r(z), "d/[h-i-py",9) == 0){
       p3=1;
     
    }
    
    if(p1==1 && p2==1 && p3==1)
    {
       //printf("Welcome abord Guardian here is your reward for saving our galaxy flag: %s",s);
      slow_print(flag);
       printf("%s", s);
       
    }
    else
    {
     slow_print(wrong_input);
    }
   
   }
 else{ slow_print(wrong_input);}
}    

//shctf{5ky_1s_n0t_th3_l1m1t}
