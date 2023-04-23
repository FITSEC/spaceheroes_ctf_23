# Solving Galactic Government

## Logging in
The first step to solving this is of course, logging in. Now when looking at the binary in a decompiler, you can see it takes your input, runs it through a function
called `obfuscate`, and then compares the username field to `hktpu` and the pwd field to `8fs7}:f~Y;unS:yfqL;uZ`, which are presumably the obfuscated credentials.
By reversing the `obfuscate` function, we can see all it does is add 7 to the ascii value of each character of your input. So by subtracting 7 from the obfuscated
credentials, we see the username is `admin` and the password is `1_l0v3_wR4ngL3r_jE4nS`. Once we enter that, we are taken to the admin console.

## Collapsing the Galactic Government
Now our ultimate goal is of course to get the flag. When looking at the binary, we can see there is also a `print_file` function which gets referenced several times.
However, it is referenced exactly once by a function called `collapse_economy`. When we continue to back track we can see that function gets called by `adjust_economy`
which gets called by `admin_console`. Perfect! So now all we need to do is find input to navigate us to that function and hopefully to win. 

To get to `adjust_economy` is pretty simple, all we have to do is enter that menu option into the admin console to display those options. Now, we can take a look again
at the `adjust_economy` function to see what we will need in order to collapse the economy.

In Binary Ninja, we can see that if we choose the `inflate_currency` option, the program will read in a value and then perform some checking on it. It will do some
strange math on the integer we input, which looks like this:
```
00403157                  currency = (currency + (((((int32_t)((((int64_t)rax_14) * 0x51eb851f) >> 0x20)) >> 5) - (rax_14 >> 0x1f)) * currency));
```
This looks quite scary, but the trained eye might recognize this as a modulus operation. Using a plugin for binja to detect modulus (or by opening the binary in ghidra
, which is better at detecting modulus) we can see it performs a modulus operation. One can use constraint solving with angr to get past this just fine. We would simply
create a factory state starting at the `adjust_economy` function, and our goal would be to reach the string comparison that is also performed in order to get input
that will satisfy the condition `currency == 0`.

Speaking of which, that string comparison is quite the pain in our buts. The string comparison compares the string "usd" to a string variable called `galactic_currency`, which
currently contains the value "blemflarks". Now this adds complication, because we need to find a way to control this variable too. 

Using the cross-references tab in binary ninja, we can see this variable `galactic_currency` is referenced 3 times in this program. Once in the function we just saw, once
for static initialization and destruction, and once more in the function `presidential_decree`. Upon further investigation, we see that this function has a menu option
called `change_galactic_currency`. If triggered, it appears this menu option reads in a string from input and writes that string to the `galactic_currency` variable. Perfect!
So now all we have to do is navigate to that function and set the galactic currency to "usd" before we satisfy the constraint in `adjust_economy`.

## Summary
So to summarize, we first got the login credentials by deobfuscating two strings in the binary. Then, we went to the `presidential_decree` menu and changed the galactic
currency to "usd", and then finally navigated to the `adjust_economy` menu and used the `inflate_currency` menu option to set `currency` equal to zero. As soon as we do,
the program slow-prints some dialogue and then prints out the flag.
