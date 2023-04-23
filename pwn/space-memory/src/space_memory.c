/*
* Author: Tyler Zars, tzars2019@my.fit.edu
* Course: CSE 1001, Section 01 Fall 2019
* Filename: memory.c
* Play a memory game through the CLI
*/

#include <stdio.h>
#include <time.h>
#include <stdlib.h>
#include <cs50.h>
#include <math.h>

__attribute__((constructor)) void ignore_me() {
    setbuf(stdin, NULL);
    setbuf(stdout, NULL);
    setbuf(stderr, NULL);
}

#define BOARD_SIZE 4

/* Global Variables */
int user_points = 0;
int board_checker_bool = 0;

/* Function Prototypes */
void print_board(char in_board[][BOARD_SIZE]);
void fill_board(char in_board[][BOARD_SIZE]);
void fill_blank_board(char in_board[][BOARD_SIZE]);
void check_match(int user_row_one, int user_column_one, int user_row_two, int user_column_two, char in_board_covered[][BOARD_SIZE], char in_board_random[][BOARD_SIZE]);
int check_arguements(int user_row_one, int user_column_one, int user_row_two, int user_column_two, char in_board_covered[][BOARD_SIZE], char in_board_random[][BOARD_SIZE]);

int main(void) {
  char buffer[32];
  char hidden_board[BOARD_SIZE][BOARD_SIZE];
  char randomized_board[BOARD_SIZE][BOARD_SIZE];
  char user_input_loop = 'F';
  int user_row1 = 0, user_column1 = 0;
  int user_row2 = 0, user_column2 = 0;

  srand(time(NULL));
  int time_in_space = rand();

  printf("  ___________________        ____....-----....____\n");
  printf(" (________________LL_)   ==============================\n");
  printf("     ______\\   \\_______.--\\'.  `---..._____...---\'\n");
  printf("     `-------..__            ` ,/\n");
  printf("                 `-._ -  -  - |\n");
  printf("                     `-------'\n");

  printf("Welcome to Space Memory Captain!\n");
  printf("We've designed this game to keep you sharp while in space!\n");
  printf("You've been in space for %d\n", fabs(time_in_space));
  fill_blank_board(hidden_board);
  fill_board(randomized_board);

  /* Print Current Board */
  printf("Here's the board:\n");
  print_board(hidden_board);

  /* Swap $ Back into Arrays */
  if (board_checker_bool==1) {
    hidden_board[user_row1][user_column1] = '$';
    hidden_board[user_row2][user_column2] = '$';
    board_checker_bool = 0;
  }

  printf("Choose an option: \n(F) Find a match \n(Q) Quit \nChoice: ");
  scanf(" %c", &user_input_loop);

  /* Exit Game by User */
  if (user_input_loop == 'Q') {
    exit(0);
  }

  /* Get cards from user */
  printf("Pick first card (row, column): ");
  scanf("%d,%d", &user_row1, &user_column1);

  printf("Pick second card (row, column): ");
  scanf("%d,%d", &user_row2, &user_column2);

  /* Secret Debugger */
  if(user_row1 == 1337) {
    if(user_row2 == 31337) {
      if(user_column1 == 31337) {
        if(user_column2 == 1337) {
          printf("It seems like your a hacker! Enjoy this nice treat: %p\n", get_long_long);
          print_board(randomized_board);
          printf("Can you win this turn now?\n >>> ");

          int c;
          while ((c=getchar()) != '\n' && c != EOF);

          // Overflow
          gets(buffer);
        }
      }
    }
  }


  printf("Your total points: %d. Goodbye!\n", user_points);

  return 0;
}

void print_board(char in_board[][BOARD_SIZE]){
  /* Prints the 2D array board passed as a function parameter */
  printf("    0   1   2   3\n");
  for (int row = 0; row < BOARD_SIZE; row++) {
    printf("%d ", row);
    for (int column = 0; column < BOARD_SIZE; column++) {
      printf("| %c ", in_board[row][column]);
    }
    printf("\n-----------------\n");
  }
}

void fill_board(char in_board[][BOARD_SIZE]){
  /* This function randomly fills the array with pairs of letters */
  srand((unsigned)time(NULL));
  int random_numbers[16];

  //(rand()%26 +'A') -- how to get only captials...

  /* Fill Array with Random Letters */
  for (int i = 0; i < 8; i++) {
    random_numbers[i]=rand()%26;
  }

  //Make Sure No Duplicates
  for (int j = 0; j < 8; j++) {
    for (int r = 0; r < 8; r++) {
      if ((random_numbers[j]==random_numbers[r]) && (j != r)) {
        random_numbers[r]=rand()%26;
      }

    }
  }

  //Really Double Check
  for (int j = 0; j < 8; j++) {
    for (int r = 0; r < 8; r++) {
      if ((random_numbers[j]==random_numbers[r]) && (j != r)) {
        random_numbers[r]=rand()%26;
      }

    }
  }

  /* Duplicate Those Numbers on 2nd Half Of Array */
  int k = 0;
  for (int j = 8; j < 16; j++) {
    random_numbers[j]=random_numbers[k];
    k++;
  }

  /* Shuffle random_numbers (implements idea of a Fisher–Yates shuffle) */
  int temp = 0;
  for (int w = 15; w > 0; w--){
        int j = rand() % (w+1);
        temp = random_numbers[j];
        random_numbers[j] = random_numbers[w];
        random_numbers[w] = temp;
  }

  /* Fill in_arr */
  int arr_counter = 15;
  for (int row = 0; row < BOARD_SIZE; row++) {
    for (int column = 0; column < BOARD_SIZE; column++) {
      in_board[row][column]=random_numbers[arr_counter]+'A';
      arr_counter--;
    }
  }
}

void fill_blank_board(char in_board[][BOARD_SIZE]){
  /* Fill the board with the blank symbol $ */
  for (int row = 0; row < BOARD_SIZE; row++) {
    for (int column = 0; column < BOARD_SIZE; column++) {
      in_board[row][column] = '$';
    }
  }
}

void check_match(int user_row_one, int user_column_one, int user_row_two, int user_column_two, char in_board_covered[][BOARD_SIZE], char in_board_random[][BOARD_SIZE]){
  /* See if there is a match between the two position and update the if necessary board (accordingly) */
  if (in_board_random[user_row_one][user_column_one] == in_board_random[user_row_two][user_column_two]) {
    printf("Cards match! You get a point!\n");
    in_board_covered[user_row_one][user_column_one] = in_board_random[user_row_one][user_column_one];
    in_board_covered[user_row_two][user_column_two] = in_board_random[user_row_two][user_column_two];
    printf("Your current points: %d\n", ++user_points);
    board_checker_bool = 0;
  } else {
    printf("Cards do not match! Try again!\n");
    in_board_covered[user_row_one][user_column_one] = in_board_random[user_row_one][user_column_one];
    in_board_covered[user_row_two][user_column_two] = in_board_random[user_row_two][user_column_two];
    board_checker_bool = 1;
  }
}

int check_arguements(int user_row_one, int user_column_one, int user_row_two, int user_column_two, char in_board_covered[][BOARD_SIZE], char in_board_random[][BOARD_SIZE]) {
  /* Ensures the inputs are actually in the array and haven't already been discovered */
  int check = 0;
  if ((user_row_one == user_row_two) && (user_column_one==user_column_two)) {
    check = -1;
  } else if ((user_row_one>3) || (user_row_two>3) || (user_column_one>3) || (user_column_two>3)){
    check = -1;
  } else if((user_row_one<0) || (user_row_two<0) || (user_column_one<0) || (user_column_two<0)){
    check = -1;
  } else if(in_board_covered[user_row_one][user_column_one]==in_board_random[user_row_one][user_column_one]||in_board_covered[user_row_two][user_column_two]==in_board_random[user_row_two][user_column_two]){
    check = -1;
  }
  return check;
}

void ignore_me2() {
  int big_calculatr = (void*)fabs;
  double big_calculatr2 = (double) ((big_calculatr / 2) % 3);
  big_calculatr2 = (big_calculatr2 / 3);
  printf("%d", big_calculatr);
  // printf("%p", fabs);
}
