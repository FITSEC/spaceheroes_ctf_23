# Solving apollo-guidance-computer

## An Overview of How To Get to the Solution:

1. Challenge description tells you to take off, if you hit launch the popup will tell you to "See Launch Checklist" which is hyperlinked below. Following this gets you airbourne (PROG = 11). 
2. If you look at the page source and search for 'flag', the 6th occurrence is a comment that tells you it'll update the header to the flag. 
3. Reading the code backwards, you can see the array of the screen is console.log() and then we need to set certain digits of this array to specific values in the following if statements to trigger the flag. 
4. The function for setting all the registers to 88888 comes from the test statement which is the first example code, I had added this as hint in CTFd.
5. Using the console.log(), you can narrow down which index is set by which keypresses and build the correct set of actions
6. "H" in this array corresponds to a space, this is commented in the source as well. It leaves the cell blank when it's "H".
7. The text that used to say "Apollo Guidance Computer Simulator" on the top of the page, will change to "shctf{}" upon a correct solve.

## Actual Solve Scipt

Note: Steps 7-9 should be completed quickly

1. Enable IMU
2. Wait until "NO ATT" light goes off (approximately 85-90 seconds) 
3. Verb Button → 37 → Enter → 01 → Enter
4. Wait for Prog Mode to enter 02
5. Hit Launch
6. Wait 10 seconds to take off
7. Enter Verb → 35
8. Enter Verb → 65
9. Enter Noun → 29
10. Flag is now in the header if you were quick enough

## True Apollo Fashion Documentation

1. Press Enable IMU button.
2. Wait until "NO ATT" light goes off (approximately 85-90 seconds).
3. Enter V37E01E to initiate major mode 01 (Prelaunch or Service Initialization). PROG should read 01, if not try again in few seconds.
4. Wait until IMU is calibrated (pitch 90°).
5. Major mode 02 (Prelaunch or Service Gyrocompassing) will automatically start in few seconds (PROG shows 02).
6. Press Launch button.
7. Wait until DSKY REG #2 has a positive value greater than 10 (approximately 5-10 seconds).
8. Enter V35E.
9. Enter V65EN29E.
10. After a successful launch and code entry, the header of the page will turn into the flag. 
