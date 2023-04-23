#include <bits/stdc++.h>
using namespace std;


/** ChatGPT Code **/
class FlushStreams {
public:
    FlushStreams() {
        fflush(stdin);
        fflush(stdout);
        fflush(stderr);
    }
};
FlushStreams flushStreams;

void print_file(const string& filename) {
	ifstream inputFile(filename);
    if (!inputFile.is_open()) {
        cerr << "Failed to open file: " << filename << endl;
        return;
    }
    string line;
    while (getline(inputFile, line)) {
        cout << line << endl;
    }
    inputFile.close();
}

void slow_print(string str) {
    for (char c : str) {
        std::cout << c << std::flush;
        if (c == '\n') {
            std::this_thread::sleep_for(std::chrono::milliseconds(1000));
        } else {
            std::this_thread::sleep_for(std::chrono::milliseconds(50));
        }
    }
}

void clear_terminal() {
    std::cout << "\033[2J\033[H";
}

int count_revolutionaries() {
    std::random_device rd;
    std::mt19937 gen(rd());
    std::uniform_int_distribution<> dist(2, 8675309);
    int random_number = dist(gen);
    return random_number;
}


/** Challenge Specific Fucntions **/

string galactic_currency = "blemflarks";

void collapse_economy() {
	clear_terminal();
	slow_print("Meanwhile, somewhere on the Level 9 control room...\n");
	slow_print("Morty: So w-what are you doing with Level 9 access anyways?\n");
	slow_print("Rick: Destroying the guu-*belch*-Galactic Government.\n");
	slow_print("Summer: Are you going to set all their nukes to target each other?\n");
	slow_print("Morty: O-Or reprogram their military portals to disintegrate their entire spacefleet?\n");
	slow_print("Rick: Good pitches kids, I'm almost proud. But watch closely as Grandpa topples an empire by changing a one...\n");
	slow_print("*click*\n...to a zero.\n");
	print_file("flag.txt");
	exit(0);
}

void presidential_decree() {
	while (true) {
		clear_terminal();
		print_file("federation_logo.txt");
		cout << "--------------------" << endl;
		cout << "Presidential Decrees" << endl;
		cout << "--------------------" << endl;
		cout << "extend_emergency_powers" << endl;
		cout << "change_galactic_currency" << endl;
		cout << "veto_random_bill" << endl;
		cout << "go_back" << endl;

		string input;
		cout << ">> ";
		cin >> input;
		if (input == "extend_emergency_powers") {
			cout << "How many months do you wish to extend your emergency powers?" << endl << ">> ";
			int months;
			cin >> months;
			cout << "Emergency powers now extended by " << months << " months!" << endl;
		}
		else if (input == "change_galactic_currency") {
			cout << "What will the galaxy's new form of currency be called?" << endl;
			string temp;
			cin >> temp;
			cout << "The new galactic currency " << temp << " has replaced " << galactic_currency << "!" << endl;
			galactic_currency = temp;
		}
		else if (input == "veto_random_bill") {
			int bill = count_revolutionaries();
			cout << "Galactic Federation Bill #" << bill << " vetoed!" << endl;
		}
		else if (input == "go_back") {
			return;
		}
		else {
			cout << "Invalid Option!" << endl;
		}
		std::this_thread::sleep_for(std::chrono::milliseconds(2000));
	}
}


int currency = 1;
void adjust_economy() {
	while (true) {
		clear_terminal();
		print_file("federation_logo.txt");
		cout << "-------------------" << endl;
		cout << "Economic Adjustment" << endl;
		cout << "-------------------" << endl;
		cout << "OPTIONS:" << endl;
		cout << "tax_working_class" << endl;
		cout << "inflate_currency" << endl;
		cout << "fund_military" << endl;
		cout << "go_back" << endl;

		string input;
		cout << ">> ";
		cin >> input;
		if (input == "tax_working_class") {
			cout << "How much do you wish to raise taxes by? (enter percentage)" << endl << ">> ";
			int taxes;
			cin >> taxes; 
		}
		else if (input == "inflate_currency") {
			cout << "How much would you wish to inflate the economy by? (enter percentage)" << endl;
			int inflate;
			cin >> inflate;
			currency = currency + ((inflate/100) * currency);
			if (currency == 0) {
				collapse_economy();
			}
		}
		else if (input == "fund_military") {
			cout << "How much money would you like to spend on our military? (enter amount in " << galactic_currency << ")" << endl << ">> ";
			int budget;
			cin >> budget;
		}
		else if (input == "go_back") {
			return;
		}
		else {
			cout << "Invalid Option!" << endl;
		}
		std::this_thread::sleep_for(std::chrono::milliseconds(2000));
	}
}

void military_conquest() {
	while (true) {
		clear_terminal();
		print_file("federation_logo.txt");
		cout << "-----------------" << endl;
		cout << "Military Conquest" << endl;
		cout << "-----------------" << endl;
		cout << "liberate_world" << endl;
		cout << "capture_prisoners_of_war" << endl;
		cout << "construct_additional_pylons" << endl;
		cout << "go_back" << endl;

		string input;
		cout << ">> ";
		cin >> input;
		if (input == "liberate_world") {
			cout << "What is the name of the world you wish to liberate?" << endl << ">> ";
			string world;
			cin >> world;
			cout << "Liberated " << world << "!" << endl;
		}
		else if (input == "capture_prisoners_of_war") {
			int prisoners = count_revolutionaries();
			cout << prisoners << " prisoners have been sent to Guantanamo Nebula!" << endl;
		}
		else if (input == "construct_additional_pylons") {
			int pylons = count_revolutionaries();
			cout << pylons << " pylons constructed!" << endl;
		}
		else if (input == "go_back") {
			return;
		}
		else {
			cout << "Invalid Option!" << endl;
		}
		std::this_thread::sleep_for(std::chrono::milliseconds(2000));
	}
}

void law_enforcement() {
	while (true) {
		clear_terminal();
		print_file("federation_logo.txt");
		cout << "---------------" << endl;
		cout << "Law Enforcement" << endl;
		cout << "---------------" << endl;
		cout << "declare_martial_law" << endl;
		cout << "brainwash_voters" << endl;
		cout << "rig_election" << endl;
		cout << "go_back" << endl;

		string input;
		cout << ">> ";
		cin >> input;
		if (input == "declare_martial_law") {
			cout << "Martial Law Declared!" << endl;
		}
		else if (input == "brainwash_voters") {
			int voters = count_revolutionaries();
			cout << voters << " voters successfully brainwashed!" << endl;
		}
		else if (input == "rig_election") {
			cout << "Election successfully rigged!" << endl << "Welcome aboard, Mr. President!" << endl;
		}
		else if (input == "go_back") {
			return;
		}
		else {
			cout << "Invalid Option!" << endl;
		}
		std::this_thread::sleep_for(std::chrono::milliseconds(2000));
	}
}

void admin_console() {
	while (true) {
		clear_terminal();
		print_file("federation_logo.txt");
		cout << "--------------" << endl;
		cout << "Admin Terminal" << endl;
		cout << "--------------" << endl;
		cout << "OPTIONS:" << endl;
		cout << "presidential_decree" << endl;
		cout << "adjust_economy" << endl;
		cout << "military_conquest" << endl;
		cout << "law_enforcement" << endl;
		cout << "logout" << endl;

		string input;
		cout << ">> ";
		cin >> input;
		if (input == "presidential_decree") {
			presidential_decree();
		}
		else if (input == "adjust_economy") {
			adjust_economy();
		}
		else if (input == "military_conquest") {
			military_conquest();
		}
		else if (input == "law_enforcement") {
			law_enforcement();
		}
		else if (input == "logout") {
			return;
		}
		else {
			cout << "Invalid Option!" << endl;
			std::this_thread::sleep_for(std::chrono::milliseconds(2000));
		}
	}
}

string obfuscate(string &str) {
	for (int i = 0; i < str.length(); i++) {
		str[i] += 7;
	}
	return str;
}

void login_page() {
	while (true) {
		string username;
		string password;
		clear_terminal();
		print_file("federation_logo.txt");
		cout << "------------------------------" << endl;
		cout << "Galactic Federation Login Page" << endl;
		cout << "------------------------------" << endl;
		cout << "USERNAME: ";
		cin >> username;
		cout << "PASSWORD: ";
		cin >> password;
		
		if (obfuscate(username) == "hktpu" && obfuscate(password) == "8fs7}:f~Y;unS:yfqL;uZ") {
			admin_console();
		}
		else {
			cout << "Incorrect Username or Password!" << endl << endl;
			std::this_thread::sleep_for(std::chrono::milliseconds(2000));
		}
	}
}

int main() {
	//string admin = "admin";
	//string pass = "1_l0v3_wR4ngL3r_jE4nS";
	//obfuscate(admin);
	//obfuscate(pass);
	login_page();
}