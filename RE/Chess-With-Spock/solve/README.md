# Solving Chess With Spock

## Initial Analysis
Running the binary appears to give very little information at first. First you are given a stardate in the traditional Star Trek
Stardate format, and then the program asks you to make a move. It is also interesting to note that the stardate changes each time
the program is run. From this, it is clear it's time now to do some static analysis to figure out what's going on.
```
Stardate: 26813.3
Make your move >>>
```
Now the first thing I notice when peering at main in a decompiler is the use of rand with regards to that stardate value mentioned
earlier. Interestingly enough, srand appears to be called twice. First it is called using the system time and from this a rand val
is generated. This rand val appears to be used to determine the seed for the second srand call. This seems rather odd, however as
you can see below, the variable containing the seed (`rdx_3`) is then used in the printf that prints Stardate, in particular with
respect to the first 5 digits of the stardate. This means we have a leak of the rand seed, which will become relevent later on.
```
004068a1      srand(time(nullptr));
004068a6      int32_t rax_1 = rand();
004068b2      uint32_t rax_4 = ((rax_1 >> 0x1f) >> 0x10);
004068ba      uint32_t rdx_3 = (((uint32_t)(rax_1 + rax_4)) - rax_4);
004068c4      srand(rdx_3);
004068c9      int32_t rax_6 = rand();
004068ef      int32_t rax_14 = (((((int32_t)((((int64_t)rax_6) * 0x66666667) >> 0x20)) >> 2) - (rax_6 >> 0x1f)) * 5);
004068f3      uint64_t rcx_1 = ((uint64_t)(rax_6 - (rax_14 + rax_14)));
00406906      printf("Stardate: %d.%d\n", ((uint64_t)rdx_3), ((uint64_t)rcx_1), rcx_1);
```
The next important thing we notice is a call to calloc, allocating an array of 32 elements of 24 bytes each. The very next line is
a call to a function called `init_board`, with this newly allocated array as the argument. It can logically be inferred that this
allocated array most likely represents the chess board.
```
00406925      void* rax_17 = calloc(32, 24);
0040693e      init_board(rax_17, 0);
```

## Revealing The Piece Structure
Just to be sure, if we look at the `init_board` function we can see it loops through the array nad initializes each element
somewhat uniquely using a switch statement. The Binary Ninja high level and pseudo c interpretations look pretty disgusting, but
looking at the disassembly things become a little bit clearer. Knowing from the calloc that each element is 24 bytes wide, and
seeing how it seems small parts of each element are being initialized at a time and are all different sizes, we can infer that
this is some sort of struct. Below is a snippet of just one such initialization as disassembled by Binary Ninja.
```
004023ad  660fefc0           pxor    xmm0, xmm0
004023b1  0f2945e0           movaps  xmmword [rbp-0x20 {var_28_1}], xmm0
004023b5  660fd645f0         movq    qword [rbp-0x10 {var_18_1}], xmm0
004023ba  c645e001           mov     byte [rbp-0x20 {var_28_1}], 0x1
004023be  c745e401000000     mov     dword [rbp-0x1c {var_28_1+0x4}], 0x1
004023c5  c645ec50           mov     byte [rbp-0x14 {var_28_1+0xc}], 0x50
004023c9  c745f001000000     mov     dword [rbp-0x10 {var_18_1}], 0x1
004023d0  8b45fc             mov     eax, dword [rbp-0x4 {var_c}]
004023d3  8945e8             mov     dword [rbp-0x18 {var_28_1+0x8}], eax
004023d6  488b8d70feffff     mov     rcx, qword [rbp-0x190 {var_198}]
004023dd  8b45fc             mov     eax, dword [rbp-0x4 {var_c}]
004023e0  4863d0             movsxd  rdx, eax
004023e3  4889d0             mov     rax, rdx
004023e6  4801c0             add     rax, rax
004023e9  4801d0             add     rax, rdx
004023ec  48c1e003           shl     rax, 0x3
004023f0  4801c1             add     rcx, rax
004023f3  488b45e0           mov     rax, qword [rbp-0x20 {var_28_1}]
004023f7  488b55e8           mov     rdx, qword [rbp-0x18 {var_28_1+0x8}]
004023fb  488901             mov     qword [rcx], rax
004023fe  48895108           mov     qword [rcx+0x8], rdx
00402402  488b45f0           mov     rax, qword [rbp-0x10 {var_18_1}]
00402406  48894110           mov     qword [rcx+0x10], rax
0040240a  e91d050000         jmp     0x40292c
```
Note from the above snippet that the element at rbp-0x14 is initialized to the single byte 0x50, which is the character 'P'.
The first eight elements of the array appear to be initialized with this same value, which if we take P to stand for pawn,
means this is the initialization of eight pawns. Performing the same analysis on the rest of the function confirms our
suspicion from earlier that the calloc'd array is an array of chess pieces representing the board.

## Back to Analyzing Main
Now heading back to where we left off in main, we can see the program enters a while loop, which appears to be the game loop.
The loop has two main sets of conditionals. The first set of conditionals appear to alternate between calling the function
`computer move` (which probably evaluates the computer making its move) and taking in input from the user. `computer move`
is a pretty large function, so we will come back to that one later. For now we can finish looking at main.

In the section that grabs uer input, it first checks if we inputted "print", and then if not evaluates the move. If the
`parse_move` function fails, the game prints out "Invalid Move". Also interesting to note, there is a variable that appears to
increment and decrement, which is swapping between the computer moving and the player moving. Also, whenever the user tries
to print or enters an invalid move, the `var_20` is incremented 5 times, which would equate to giving the computer 5 turns
in a row.
```
00406957          if (var_20 != 0)
00406953          {
0040696e              computer_move(rax_17, var_20);
00406973              var_20 = (var_20 - 1);
00406973          }
00406983          else
00406983          {
00406983              void var_49;
00406983              std::allocator<char>::allocator(&var_49);
0040699b              void var_98;
0040699b              std::string::string<std::allocator<char> >(&var_98, &data_4073b1);
004069a7              std::allocator<char>::~allocator(&var_49);
004069b6              printf("Make your move >>> ");
004069ca              std::operator>><char, st..._traits<char>, std::allocator<char> >(&std::cin, &var_98);
004069e5              if (std::operator==<char, st..._traits<char>, std::allocator<char> >(&var_98, "print") != 0)
004069e3              {
004069f7                  prnt_board(rax_17);
004069fc                  var_20 = (var_20 + 4);
004069fc              }
00406a13              else
00406a13              {
00406a13                  void var_48;
00406a13                  std::string::string(&var_48);
00406a2f                  int32_t rax_20;
00406a2f                  int128_t zmm0_1;
00406a2f                  rax_20 = parse_move(rax_17, &var_48, var_20);
00406a40                  std::string::~string(&var_48);
00406a47                  if (((int8_t)(rax_20 >> 0x1f)) != 0)
00406a45                  {
00406a75                      std::operator<<<std::char_traits<char> >(std::operator<<<char, st..._traits<char>, std::allocator<char> >(std::operator<<<std::char_traits<char> >(&std::cout, "Invalid move ")), ". Please try again.\n");
00406a7a                      var_20 = (var_20 + 4);
00406a7a                  }
00406a45              }
00406a7e              var_20 = (var_20 + 1);
00406a8c              std::string::~string(&var_98);
00406a89          }
```

The next set of conditionals, appear to check for game-over states, as each of them prints out "Game Over! _____ wins!" for
white and for black respectively. Also interesting to note, if white wins, the program calls `system("cat flag.txt")`, which
means we have found our goal.
```
00406aa3          if ((*(int8_t*)((char*)rax_17 + 0x168) ^ 1) != 0)
00406aa1          {
00406aaa              puts("Game Over! White wins!");
00406aaf              var_19 = 0;
00406ab8              system("cat flag.txt");
00406ab3          }
00406ad4          else if ((*(int8_t*)((char*)rax_17 + 0x2e8) ^ 1) != 0)
00406ad2          {
00406adf              puts("Game Over! You Lose!");
00406ae4              char var_21_1 = 0;
00406b7c              char var_21_2;
00406b7c              do
00406b7c              {
00406af2                  printf("Play Again? (y/n) >>> ");
00406b08                  char var_69;
00406b08                  __isoc99_scanf(&data_40743f, &var_69);
00406b1e                  if (tolower(((int32_t)var_69)) == 0x6e)
00406b1b                  {
00406b20                      var_19 = 0;
00406b24                      var_21_2 = 0;
00406b24                  }
00406b3b                  else if (tolower(((int32_t)var_69)) != 0x79)
00406b38                  {
00406b74                      var_21_2 = 1;
00406b74                  }
00406b4d                  else
00406b4d                  {
00406b4d                      init_board(rax_17, 0);
00406b5d                      int512_t zmm0_2;
00406b5d                      zmm0_2 = 0;
00406b62                      prnt_board(rax_17);
00406b67                      var_20 = 0;
00406b6e                      var_21_2 = 0;
00406b6e                  }
00406b6e              } while (var_21_2 != 0);
00406b78          }
```

## Approach
Now, in order to win the game, we need to know how the computer moves. So now we can start reversing the `computer_move` function.
As we do, you might notice calls to `rand` littered all throughout the function. Actually, anytime a change is made to some piece
in the piece array, `rand` is called first, and is used as part of the values being reassigned. From this we can determine that 
the computer uses random values to determine which move to make.

This seems incredibly unfortunate, as now we need to defeat an opponent without being able to know what moves they make even during
the game. However, if you remember we leaked the seed for `srand` at the beginning of main. This means, in theory, we can calculate
exactly which moves the computer will make just from the seed at runtime, so that we can come up with a series of countermoves which
will end in checkmate.

If you read that just now and thought to yourself "please don't tell me that was the solution", you'll be relieved to know that there
is a far easier way to do this, and that solution involves patching. Now, if we can find a way to patch the binary such that `srand`
will be called with a value of our choice, allowing us to print the board and see which moves the computer will make given the known
seed. Then and only then can we come up with a move sequence to capture the king and win the game.

## Patching srand()
In order to make the `srand` call with our chosen value, we need to ensure `edi` contains the seed value just before the call. So,
lets connect to the remote server and see what the seed value is. Here, we are given a seed of `64199`.
```
Stardate: 64199.3
Make your move >>>
```
So we will patch the instructions prior to the `srand` call to be `mov edi, 64199`. However we must be a little careful, as the
original `mov edi, eax` instruction is two bytes long in machine code, whereas what we want is actually five bytes in machine code.
Thankfully, the instruction just before is three bytes long, so we can overrite these two instructions to be the mov instruction
we need.
```
004068bf  8b45e0             mov     eax, dword [rbp-0x20 {var_28}]
004068c2  89c7               mov     edi, eax
004068c4  e867b8ffff         call    srand
```
becomes...
```
004068bf  bff04f0000         mov     edi, 64199
004068c4  e867b8ffff         call    srand
```
Next, we save this patched binary, run it, and print a few times to see what moves the computer makes.
```
Make your move >>> print
##########
8RNBQK  R#
7 PP BPPP#
6   P   N#
5P   P   #
4        #
3        #
2PPPPPPPP#
1RNBQKBNR#
#abcdefgh#
Material Imbalance: 0.000000
Make your move >>>
```
The actual binary uses some ascii escape sequences to color the board and make it easier to visualize, but you can still see here
about what the first five moves are (since we saw that print will unfortunately give the computer 5 moves). From here we can easily
open up our queen, and move it to capture the enemy king in just a few moves. If we play pawn to e4, then Queen to f3, then Queen
takes on f7, then Queen takes King on e8, we can win in less than five moves without interfering with what moves the computer will
make. The algebraic notation for this is `e4, Qf3, Qxf7, Qxe8`. As you can see, if we input that sequence into the remote server
we can win and get the flag.
```
Stardate: 64199.3
Make your move >>> e4          
Make your move >>> Qf3
Make your move >>> Qxf7
Make your move >>> Qxe8
Game Over! White wins!
shctf{3n_p4SsAnT_1s_f0RceD}
```
Of course, any move sequence that ends with the King's capture will get you the flag, and if five moves isn't enough you can
always call print multiple times on your patched binary to plan for the first ten moves. 
