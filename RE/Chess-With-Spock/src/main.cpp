#include <stdio.h>
#include <cctype>
#include <cstdlib>
#include <string>
#include <iostream>
#include <cstring>
#include <time.h>

using namespace std;

/****** STRUCTURES ******/

/* Chess Piece */
typedef struct Piece {
	bool is_alive; // has the piece been captured yet
	bool has_moved; // relevent for pawns and castling
	int row; // 1 - 8
	int col; // 1 - 8
	char type; // P->Pawn, N->Knight, B->Bishop, R->Rook, Q->Queen, K->King
	int color; // 0 = white, 1 = black
	bool en_passant; // true if can be captured en passant
} Piece;

/* Chess Board */
typedef struct Board {
	Piece *pieces;
	double eval;
} Board;

/****** METHODS ******/

/* declare functions */
void init_board(Board b);
void prnt_board(Board b);
double eval_pos(Board b);
int can_move(Board b, int p, int new_r, int new_c);
bool is_clear(Board b, int r1, int c1, int r2, int c2);


/* Setup the board */
void init_board(Board b) {
	for (int i = 0; i < 32; i++) {
		// switch to be exact about which pieces are which
		// 0-15 are black, 16-31 are white
		switch (i) {
			// black pieces
			case 0 ... 7: {// pawns
				Piece temp = {
					true,
					false,
					1,
					i,
					'P',
					1,
					false,
				};
				b.pieces[i] = temp;
				break;
			}
			case 8 ... 9: {// rooks
				Piece temp = {
                    true,
                    false,
                    0,
                    (i - 8) * 7,
                    'R',
                    1,
                    false,
                };
                b.pieces[i] = temp;
                break;
			}
			case 10 ... 11: {// bishops
				Piece temp = {
                    true,
                    false,
                    0,
                    2 + (i - 10) * 3,
                    'B',
                    1,
                    false,
                };
                b.pieces[i] = temp;
                break;
			}
			case 12 ... 13: {// knights
				Piece temp = {
                    true,
                    false,
                    0,
                    1 + (i - 12) * 5,
                    'N',
                    1,
                    false,
                };
                b.pieces[i] = temp;
                break;
			}
			case 14: {// queen
				Piece temp = {
                    true,
                    false,
                    0,
                    3,
                    'Q',
                    1,
                    false,
                };
                b.pieces[i] = temp;
                break;
			}
			case 15: {// king
				Piece temp = {
                    true,
                    false,
                    0,
                    4,
                    'K',
                    1,
                    false,
                };
                b.pieces[i] = temp;
                break;
			}
			// white pieces
			case 16 ... 23: {// pawns
				Piece temp = {
                    true,
                    false,
                    6,
                    i - 16,
                    'P',
                    0,
                    false,
                };
                b.pieces[i] = temp;
                break;
			}
			case 24 ... 25: {// rooks
				Piece temp = {
                    true,
                    false,
                    7,
                    (i - 24) * 7,
                    'R',
                    0,
                    false,
                };
                b.pieces[i] = temp;
                break;
			}
			case 26 ... 27: {// bishops
				Piece temp = {
                    true,
                    false,
                    7,
                    2 + (i - 26) * 3,
                    'B',
                    0,
                    false,
                };
                b.pieces[i] = temp;
                break;
			}
			case 28 ... 29: {// knights
				Piece temp = {
                    true,
                    false,
                    7,
                    1 + (i - 28) * 5,
                    'N',
                    0,
                    false,
                };
                b.pieces[i] = temp;
                break;
			}
			case 30: {// queen
				Piece temp = {
                    true,
                    false,
                    7,
                    3,
                    'Q',
                    0,
                    false,
                };
                b.pieces[i] = temp;
                break;
			}
			case 31: {// king
				Piece temp = {
                    true,
                    false,
                    7,
                    4,
                    'K',
                    0,
                    false,
                };
                b.pieces[i] = temp;
                break;
			}
			default: break;
		}
	}
}


/* Print the chess board */
void prnt_board(Board b) {
	printf("##########\n");
	int bg = 1;
	for (int r = 0; r < 8; r++) {
		printf("%d", 8 - r);
		for (int c = 0; c < 8; c++) {
			char spot = ' ';
			int color = 0;
			for (int i = 0; i < 32; i++) {
				if (b.pieces[i].is_alive && b.pieces[i].row == r && b.pieces[i].col == c) {
					/*switch (b.pieces[i].type) {
						case 'P': spot = "\u265F"; break;
						case 'R': spot = "\u265C"; break;
						case 'B': spot = "\u265D"; break;
						case 'N': spot = "\u265E"; break;
						case 'Q': spot = "\u265B"; break;
						case 'K': spot = "\u265A"; break;
					}*/
					spot = b.pieces[i].type;
					color |= b.pieces[i].color;
				}
			}
			if (color) {
				printf("\x1b[%d1;4%dm%c\033[0m", (3 + (abs(bg - 1) * 6)), (bg * 7), spot);
			}
			else {
				printf("\x1b[%d4;4%dm%c\033[0m", (3 + (abs(bg - 1) * 6)), (bg * 7), spot);
			}
			if (bg) {
				bg--;
			}
			else {
				bg++;
			}
		}
		if (bg) {
            bg--;
        }
        else {
          	bg++;
        }
		printf("#\n");
	}
	printf("#abcdefgh#\nMaterial Imbalance: %lf\n", eval_pos(b));
}

/* Evaluate Position */
double eval_pos(Board b) {
	double eval = 0.0;
	// evaluate material balance
	for (int i = 0; i < 32; i++) {
		if (b.pieces[i].is_alive && !b.pieces[i].color) {
			switch (b.pieces[i].type) {
				case 'P': eval += 1; break;
				case 'N':
				case 'B': eval += 3; break;
				case 'R': eval += 5; break;
				case 'Q': eval += 9; break;
				case 'K': eval += 999; break;
				default: break;
			}
		}
		else if (b.pieces[i].is_alive && b.pieces[i].color) {
			switch (b.pieces[i].type) {
				case 'P': eval -= 1; break;
				case 'N':
				case 'B': eval -= 3; break;
				case 'R': eval -= 5; break;
				case 'Q': eval -= 9; break;
				case 'K': eval -= 999; break;
				default: break;
			}
		}
	}

	// evaluate piece activity
	// todo


	// we done here
	return eval;
}

/* Check if path between two points is clear */
/* Not inclusive of destination square */
bool is_clear(Board b, int r1, int c1, int r2, int c2) {
	if (r2 < 0 || r2 > 7 || c1 < 0 || c2 > 7) {
		return false;
	}
	bool clear = true;
	while ((r1 != r2 || c1 != c2) && clear) {
		//printf("%d %d :: %d %d\n", r1, c1, r2, c2);
		if (r1 != r2) {
			r1 += (r2 - r1) / abs(r2 - r1);
		}
		if (c1 != c2) {
			c1 += (c2 - c1) / abs(c2 - c1);
		}
		for (int i = 0; i < 32; i++) {
			if (b.pieces[i].row == r1 && b.pieces[i].col == c1 && (r1 != r2 || c1 != c2)) {
				clear = false;
			}
		}
	}

	return clear;
}

/* Determines if a piece can be moved to the given location, if so, move it and return 1, else return -1 */
int can_move(Board b, int p, int new_r, int new_c) {
	if (b.pieces[p].is_alive && new_r < 8 && new_r >= 0 && new_c < 8 && new_c >= 0) {
		// generate all valid moves, then determine if given pos is valid
		switch (b.pieces[p].type) {
			case 'P': { // pawn
				// check if new is possible
				int direction = b.pieces[p].color ? 1 : -1;
				// basic move foreward one
				if (new_r == b.pieces[p].row + direction && new_c == b.pieces[p].col && is_clear(b, b.pieces[p].row, b.pieces[p].col, new_r, new_c)) {
					for (int i = 0; i < 32; i++) {
						if (b.pieces[i].row == new_r && b.pieces[i].col == new_c) {
							return -1;
						}
					}
					b.pieces[p].row = new_r;
					b.pieces[p].col = new_c;
					b.pieces[p].en_passant = false;
					if (b.pieces[p].color && new_r == 7) {
						b.pieces[p].type = 'Q';
					}
					else if (!b.pieces[p].color && new_r == 0) {
						b.pieces[p].type = 'Q';
					}
					return 1;
				}
				// move foreward two
				else if (!b.pieces[p].has_moved && new_r == b.pieces[p].row + (direction * 2) && new_c == b.pieces[p].col && is_clear(b, b.pieces[p].row, b.pieces[p].col, new_r, new_c)) {
					for (int i = 0; i < 32; i++) {
						if (b.pieces[i].row == new_r && b.pieces[i].col == new_c) {
							return -1;
						}
					}
					b.pieces[p].row = new_r;
					b.pieces[p].col = new_c;
					b.pieces[p].en_passant = true;
					return 1;
				}
				// capture right
				else if (new_r == b.pieces[p].row + direction && new_c == b.pieces[p].col + 1 && is_clear(b, b.pieces[p].row, b.pieces[p].col, new_r, new_c)) {
					for (int i = 0; i < 32; i++) {
						// capture piece
						if (b.pieces[i].row == new_r && b.pieces[i].col == new_c && b.pieces[p].color != b.pieces[i].color) {
							b.pieces[i].is_alive = false;
							b.pieces[p].row = new_r;
							b.pieces[p].col = new_c;
							b.pieces[p].en_passant = false;
							if (b.pieces[p].color && new_r == 7) {
								b.pieces[p].type = 'Q';
							}
							else if (!b.pieces[p].color && new_r == 0) {
								b.pieces[p].type = 'Q';
							}
							return 1;
						}
						// en passant
						else if (b.pieces[i].en_passant && b.pieces[i].row == new_r - direction && b.pieces[i].col == new_c) {
							b.pieces[i].is_alive = false;
							b.pieces[p].row = new_r;
							b.pieces[p].col = new_c;
							b.pieces[p].en_passant = false;
							if (b.pieces[p].color && new_r == 7) {
								b.pieces[p].type = 'Q';
							}
							else if (!b.pieces[p].color && new_r == 0) {
								b.pieces[p].type = 'Q';
							}
							return 1;
						}
					}
					return -1;
				}
				// capture left
				else if (new_r == b.pieces[p].row + direction && new_c == b.pieces[p].col - 1 && is_clear(b, b.pieces[p].row, b.pieces[p].col, new_r, new_c)) {
					for (int i = 0; i < 32; i++) {
						// capture piece
						if (b.pieces[i].row == new_r && b.pieces[i].col == new_c && b.pieces[p].color != b.pieces[i].color) {
							b.pieces[i].is_alive = false;
							b.pieces[p].row = new_r;
							b.pieces[p].col = new_c;
							b.pieces[p].en_passant = false;
							if (b.pieces[p].color && new_r == 7) {
								b.pieces[p].type = 'Q';
							}
							else if (!b.pieces[p].color && new_r == 0) {
								b.pieces[p].type = 'Q';
							}
							return 1;
						}
						// en passant
						else if (b.pieces[i].en_passant && b.pieces[i].row == new_r - direction && b.pieces[i].col == new_c) {
							b.pieces[i].is_alive = false;
							b.pieces[p].row = new_r;
							b.pieces[p].col = new_c;
							b.pieces[p].en_passant = false;
							if (b.pieces[p].color && new_r == 7) {
								b.pieces[p].type = 'Q';
							}
							else if (!b.pieces[p].color && new_r == 0) {
								b.pieces[p].type = 'Q';
							}
							return 1;
						}
					}
					return -1;
				}
				else {
					return -1;
				}
				break;
			}
			case 'N': { // knight
				if ((abs(b.pieces[p].row - new_r) == 1 && abs(b.pieces[p].col - new_c) == 2) || (abs(b.pieces[p].row - new_r) == 2 && abs(b.pieces[p].col - new_c) == 1)) {
					for (int i = 0; i < 32; i++) {
						if (b.pieces[i].row == new_r && b.pieces[i].col == new_c && b.pieces[p].color == b.pieces[i].color && p != i && b.pieces[i].is_alive) {
							return -1;
						}
						else if (b.pieces[i].row == new_r && b.pieces[i].col == new_c && b.pieces[p].color != b.pieces[i].color) {
							b.pieces[i].is_alive = false;
							b.pieces[p].row = new_r;
							b.pieces[p].col = new_c;
							return 1;
						}
					}
					b.pieces[p].row = new_r;
					b.pieces[p].col = new_c;
					return 1;
				}
				return -1;
				break;
			}
			case 'B': {
				if (b.pieces[p].row != new_r && b.pieces[p].col != new_c && abs(b.pieces[p].row - new_r) == abs(b.pieces[p].col - new_c) && is_clear(b, b.pieces[p].row, b.pieces[p].col, new_r, new_c)) {
					for (int i = 0; i < 32; i++) {
						if (b.pieces[i].row == new_r && b.pieces[i].col == new_c && b.pieces[p].color == b.pieces[i].color && p != i && b.pieces[i].is_alive) {
							return -1;
						}
						else if (b.pieces[i].row == new_r && b.pieces[i].col == new_c && b.pieces[p].color != b.pieces[i].color) {
							b.pieces[i].is_alive = false;
							b.pieces[p].row = new_r;
							b.pieces[p].col = new_c;
							return 1;
						}
					}
					b.pieces[p].row = new_r;
					b.pieces[p].col = new_c;
					return 1;
				}
				return -1;
				break;
			}
			case 'R': {
				if ((b.pieces[p].row != new_r || b.pieces[p].col != new_c) && is_clear(b, b.pieces[p].row, b.pieces[p].col, new_r, new_c)) {
					for (int i = 0; i < 32; i++) {
						if (b.pieces[i].row == new_r && b.pieces[i].col == new_c && b.pieces[p].color == b.pieces[i].color && p != i && b.pieces[i].is_alive) {
							return -1;
						}
						else if (b.pieces[i].row == new_r && b.pieces[i].col == new_c && b.pieces[p].color != b.pieces[i].color) {
							b.pieces[i].is_alive = false;
							b.pieces[p].row = new_r;
							b.pieces[p].col = new_c;
							return 1;
						}
					}
					b.pieces[p].row = new_r;
					b.pieces[p].col = new_c;
					return 1;
				}
				return -1;
				break;
			}
			case 'Q': {
				if (b.pieces[p].row != new_r && b.pieces[p].col != new_c && abs(b.pieces[p].row - new_r) == abs(b.pieces[p].col - new_c) && is_clear(b, b.pieces[p].row, b.pieces[p].col, new_r, new_c)) {
					for (int i = 0; i < 32; i++) {
						if (b.pieces[i].row == new_r && b.pieces[i].col == new_c && b.pieces[p].color == b.pieces[i].color && p != i && b.pieces[i].is_alive) {
							return -1;
						}
						else if (b.pieces[i].row == new_r && b.pieces[i].col == new_c && b.pieces[p].color != b.pieces[i].color) {
							b.pieces[i].is_alive = false;
							b.pieces[p].row = new_r;
							b.pieces[p].col = new_c;
							return 1;
						}
					}
					b.pieces[p].row = new_r;
					b.pieces[p].col = new_c;
					return 1;
				}
				else if ((b.pieces[p].row != new_r || b.pieces[p].col != new_c) && is_clear(b, b.pieces[p].row, b.pieces[p].col, new_r, new_c)) {
					for (int i = 0; i < 32; i++) {
						if (b.pieces[i].row == new_r && b.pieces[i].col == new_c && b.pieces[p].color == b.pieces[i].color && p != i && b.pieces[i].is_alive) {
							return -1;
						}
						else if (b.pieces[i].row == new_r && b.pieces[i].col == new_c && b.pieces[p].color != b.pieces[i].color) {
							b.pieces[i].is_alive = false;
							b.pieces[p].row = new_r;
							b.pieces[p].col = new_c;
							return 1;
						}
					}
					b.pieces[p].row = new_r;
					b.pieces[p].col = new_c;
					return 1;
				}
				return -1;
				break;
			}
			case 'K': {
				// move in any direction
				if ((b.pieces[p].row != new_r || b.pieces[p].col != new_c) && abs(b.pieces[p].row - new_r) <= 1 && abs(b.pieces[p].col - new_c) <= 1) {
					for (int i = 0; i < 32; i++) {
						// capture piece
						if (b.pieces[i].row == new_r && b.pieces[i].col == new_c && b.pieces[p].color != b.pieces[i].color) {
							b.pieces[i].is_alive = false;
							b.pieces[p].row = new_r;
							b.pieces[p].col = new_c;
							return 1;
						}
						else if (b.pieces[i].row == new_r && b.pieces[i].col == new_c && b.pieces[p].color == b.pieces[i].color && p != i && b.pieces[i].is_alive) {
							return -1;
						}
					}
					b.pieces[p].row = new_r;
					b.pieces[p].col = new_c;
					return 1;
				}
				else {
					return -1;
				}
				break;
			}
		}
	}
	return -1;
}

/* attempts to castle */
// color -> 0 is white, 1 is black
// direction -> -1 for queenside, +1 for kingside
int castle(Board b, int color, int direction) {
	if (b.pieces[31 - (color * 16)].row == 7 - (color * 7) && b.pieces[31 - (color * 16)].col == 4) {
		if (is_clear(b, 7 - (color * 7), 4, 7 - (color * 7), 0) && !b.pieces[31 - (color * 16)].has_moved && !b.pieces[24 - (color * 16)].has_moved) {
			b.pieces[31 - (color * 16)].col -= 2;
			b.pieces[24 - (color * 16)].col = b.pieces[31 - (color * 16)].col + 1;
			return 1;
		}
		else if (is_clear(b, 7 - (color * 7), 4, 7 - (color * 7), 7) && !b.pieces[31 - (color * 16)].has_moved && !b.pieces[25 - (color * 16)].has_moved) {
			b.pieces[31 - (color * 16)].col += 2;
			b.pieces[25 - (color * 16)].col = b.pieces[31 - (color * 16)].col - 1;
			return 1;
		}
		return -1;
	}
	return -1;
}

/* Parse chess notation to grid moves */
int parse_move(Board b, string notation, int turn) {
	// castling kingside
	if (notation == "0-0") {
		return castle(b, turn, 1);
	}
	// castling queenside
	else if (notation == "0-0-0") {
		return castle(b, turn, -1);
	}
	// pawn moves foreward
	else if (notation.length() == 2) {
		int r = 7 - (int)(notation.at(1) - '1');
		int c = (int)(notation.at(0) - 'a');
		for (int i = 0; i < 32; i++) {
			if (b.pieces[i].is_alive && b.pieces[i].type == 'P' && b.pieces[i].col == c && b.pieces[i].color == turn) {
				return can_move(b, i, r, c);
			}
		}
		return -1;
	}
	// other piece moves
	else if (notation.length() == 3) {
		int r = 7 - (int)(notation.at(2) - '1');
		int c = (int)(notation.at(1) - 'a');
		char type = notation.at(0);
		for (int i = 0; i < 32; i++) {
			int res = 0;
			if (b.pieces[i].is_alive && b.pieces[i].type == type && b.pieces[i].color == turn) {
				res = can_move(b, i, r, c);
				if (res > 0) {
					return 1;
				}
			}
		}
		return -1;
	}
	// capture time
	else if (notation.length() == 4 && notation.at(1) == 'x') {
		// pawns
		if (notation.at(0) >= 'a') {
			int from = (int)(notation.at(0) - 'a');
			int r = 7 - (int)(notation.at(3) - '1');
			int c = (int)(notation.at(2) - 'a');
			int res = -1;
			for (int i = 0; i < 32; i++) {
				if (b.pieces[i].is_alive && b.pieces[i].type == 'P' && b.pieces[i].col == from && b.pieces[i].color == turn) {
					res = can_move(b, i, r, c);
					if (res > 0) {
						return res;
					}
				}
			}
			return -1;
		}
		// all other pieces
		else {
			int r = 7 - (int)(notation.at(3) - '1');
			int c = (int)(notation.at(2) - 'a');
			int res = -1;
			for (int i = 0; i < 32; i++) {
				if (b.pieces[i].is_alive && b.pieces[i].type == notation.at(0) && b.pieces[i].color == turn) {
					res = can_move(b, i, r, c);
					if (res > 0) {
						return res;
					}
				}
			}
			return -1;
		}
	}
	// non-pawn specify move
	else if (notation.length() == 4 && notation.at(1) != 'x') {

	}
	// non-pawn specify capture

	return -1;
}

/* Have the Computer make a move */
void computer_move(Board b, int color) {
	int piece = rand() % 18;
	while (true) {
		switch (b.pieces[piece].type) {
			case 'P': {
				int move = rand() % 4;
				if (move == 0 && can_move(b, piece, b.pieces[piece].row + 1, b.pieces[piece].col) > 0) {
					return;
				}
				else if (move == 1 && can_move(b, piece, b.pieces[piece].row + 2, b.pieces[piece].col) > 0) {
					return;
				}
				else if (move == 2 && can_move(b, piece, b.pieces[piece].row + 1, b.pieces[piece].col - 1) > 0) {
					return;
				}
				else if (move == 3 && can_move(b, piece, b.pieces[piece].row + 1, b.pieces[piece].col + 1) > 0) {
					return;
				}
				break;
			}
			case 'N': {
				int move = rand() % 8;
				if (move == 0 && can_move(b, piece, b.pieces[piece].row + 1, b.pieces[piece].col + 2) > 0) {
					return;
				}
				else if (move == 1 && can_move(b, piece, b.pieces[piece].row + 2, b.pieces[piece].col + 1) > 0) {
					return;
				}
				else if (move == 2 && can_move(b, piece, b.pieces[piece].row - 1, b.pieces[piece].col + 2) > 0) {
					return;
				}
				else if (move == 3 && can_move(b, piece, b.pieces[piece].row - 2, b.pieces[piece].col + 1) > 0) {
					return;
				}
				else if (move == 4 && can_move(b, piece, b.pieces[piece].row + 1, b.pieces[piece].col - 2) > 0) {
					return;
				}
				else if (move == 5 && can_move(b, piece, b.pieces[piece].row + 2, b.pieces[piece].col - 1) > 0) {
					return;
				}
				else if (move == 6 && can_move(b, piece, b.pieces[piece].row - 1, b.pieces[piece].col - 2) > 0) {
					return;
				}
				else if (move == 7 && can_move(b, piece, b.pieces[piece].row - 2, b.pieces[piece].col - 1) > 0) {
					return;
				}
			}
			case 'B': {
				int move = rand() % 4;
				int rdir = rand() % 7;
				int cdir = rand() % 7;
				if (rdir == 0 && cdir == 0) {
					break;
				}
				else if (move == 0 && can_move(b, piece, b.pieces[piece].row + rdir, b.pieces[piece].col + cdir) > 0) {
					return;
				}
				else if (move == 1 && can_move(b, piece, b.pieces[piece].row - rdir, b.pieces[piece].col + cdir) > 0) {
					return;
				}
				else if (move == 2 && can_move(b, piece, b.pieces[piece].row + rdir, b.pieces[piece].col - cdir) > 0) {
					return;
				}
				else if (move == 3 && can_move(b, piece, b.pieces[piece].row - rdir, b.pieces[piece].col - cdir) > 0) {
					return;
				}
			}
			case 'R': {
				int move = rand() % 2;
				int dist = 7 - (rand() % 15);
				if (move && can_move(b, piece, b.pieces[piece].row + dist, b.pieces[piece].col) > 0) {
					return;
				}
				else if (!move && can_move(b, piece, b.pieces[piece].row, b.pieces[piece].col + dist) > 0) {
					return;
				}
			}
			case 'Q': {
				int dir = rand() % 2;
				if (dir) {
					int move = rand() % 4;
					int rdir = rand() % 7;
					int cdir = rand() % 7;
					if (rdir == 0 && cdir == 0) {
						break;
					}
					else if (move == 0 && can_move(b, piece, b.pieces[piece].row + rdir, b.pieces[piece].col + cdir) > 0) {
						return;
					}
					else if (move == 1 && can_move(b, piece, b.pieces[piece].row - rdir, b.pieces[piece].col + cdir) > 0) {
						return;
					}
					else if (move == 2 && can_move(b, piece, b.pieces[piece].row + rdir, b.pieces[piece].col - cdir) > 0) {
						return;
					}
					else if (move == 3 && can_move(b, piece, b.pieces[piece].row - rdir, b.pieces[piece].col - cdir) > 0) {
						return;
					}
				}
				else {
					int move = rand() % 2;
					int dist = 7 - (rand() % 15);
					if (move && can_move(b, piece, b.pieces[piece].row + dist, b.pieces[piece].col) > 0) {
						return;
					}
					else if (!move && can_move(b, piece, b.pieces[piece].row, b.pieces[piece].col + dist) > 0) {
						return;
					}
				}
			}
			case 'K': {
				int rdir = 1 - (rand() % 3);
				int cdir = 1 - (rand() % 3);
				if (rdir == 0 && cdir == 0) {
					break;
				}
				else if (can_move(b, piece, b.pieces[piece].row + rdir, b.pieces[piece].col + cdir) > 0) {
					return;
				}
			}
			default: break;
		}

		if (piece == 16 && parse_move(b, "0-0", color) > 0) {
			return;
		}
		else if (piece == 17 && parse_move(b, "0-0-0", color) > 0) {
			return;
		}
		piece = rand() % 16;
	}
}

/****** Flush Buffers ******/
class FlushStreams {
public:
    FlushStreams() {
        fflush(stdin);
        fflush(stdout);
        fflush(stderr);
    }
};

FlushStreams flushStreams;

/****** MAIN ******/
int main() {
	srand(time(0));
	int random_set = rand() % 65536;
	srand(random_set);
	printf("Stardate: %d.%d\n", random_set, rand() % 10);
	Board board {
		(Piece*)calloc(32, sizeof(Piece)),
		0.0,
	};
	init_board(board);
	bool running = true;
	int turn = 0; // 0 is white, 1 is black
	while (running) {
		// AI moves
		if (turn) {
			computer_move(board, turn);
			turn--;
		}
		// player moves
		else {
			string buff = "";
			printf("Make your move >>> ");
			cin >> buff;
			if (buff == "print") {
				prnt_board(board);
				turn += 4;
			}
			else if (parse_move(board, buff, turn) < 0) {
				cout << "Invalid move " << buff << ". Please try again.\n";
				turn += 4;
			}
			turn++;
		}

		// checks for end of game state
		// black king -> 15
		if (!board.pieces[15].is_alive) {
			printf("Game Over! White wins!\n");
			running = false;
			system("cat flag.txt");
		}
		// white king -> 31
		else if (!board.pieces[31].is_alive) {
			printf("Game Over! You Lose!\n");
			char temp;
			bool flag = false;
			do {
				printf("Play Again? (y/n) >>> ");
				scanf(" %c", &temp);
				if (tolower(temp) == 'n') {
					running = false;
					flag = false;
				}
				else if (tolower(temp) == 'y') {
					init_board(board);
					prnt_board(board);
					turn = 0;
					flag = false;
				}
				else {
					flag = true;
				}
			} while (flag);
		}
	}
}