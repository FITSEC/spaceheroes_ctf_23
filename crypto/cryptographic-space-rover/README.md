# cryptographic-space-rover

Author: **Tyler Zars**

## Description

NASA has sent this custom program off to a remote space rover, luckily it already had Python and all the dependencies installed so we don't have to worry about transferring those. It will print the CPU usage and some fun other facts about the system when it's run. It seems to run an equal number of time to the number of characters entered. For some reason, certain characters at certain indexes cause new processes to spawn... can you help us find what characters to avoid at certain indexes?

## Solve

This challenge is based off of a proccess monitoring attack. If you input the correct character, it'll spawn a new process that the user can pick up and read to see that the input is correct.

Due to the nature of having multiple machines connect at the same time, a unique UUID is generated at each runtime of the Python program. This UUID is to be caputed and then used to check if that process (the process will be named the UUID) is running.

We can then build the flag out slowly.