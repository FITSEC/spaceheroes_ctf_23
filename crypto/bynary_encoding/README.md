# Wide Open Spaces
**Curtice Gough**

This is based on a challenge I encountered at last semester's Raymond James CTF.  At first glance, the file is filled with random space.  However, looking at a hexdump will reveal three main types of whitespace: Spaces `\x20`, Tabs `\x09`, and Newline characters `\x0a`.  Replacing spaces with 0 and tabs with 1 yields 8-bit ascii (separated by newline characters).
