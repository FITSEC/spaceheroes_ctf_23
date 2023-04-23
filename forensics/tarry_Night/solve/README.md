This was intended to be an easy challenge... didn't seem to pan out that way, sorry.
<br>
So, we start off with a tar.gz file that we cannot decompress. Running `tar -xzf tarry_night.tar.gz` complains that it's not in gzip format too.
```gzip: stdin: not in gzip format```
Running file on it too you only see that it's considered `data`, so it's corrupted. Specifically, file cannot seem to find the gunzip's magic bytes.
You can verify that by running `xxd tarry_night.tar.gz | head`. You could try overwriting the first few bytes with magic numbers, but then gz will complain that it cannot be decompressed. A closer look
at the gz's structure would show that the magic bytes were simply removed from the front of the file, so you can just append the magic bytes to the front (see fix_gzip.py). Now that the gunzip is fixed, we can try
`tar -xzf tarry_night.tar.gz` again, but we get a different error:
```tar: This does not look like a tar archive```
So, looks like the gzip is recognized now, but the tar within the gzip is not. So, let's just decompress the gzip with `gzip -dk new_tarry_night.tar.gz`. Now we have the tar file. Since it's not recognized, we'll do
`xxd new_tarry_night.tar | head` just like last time. We see that the magix bytes aren't there again, but to do the same thing as last time would lead to nothing. Something that's really interesting tho is the fact that the byte "0c"
repeats quite a few times. If you ever get an invalid file, it's always good practice to compare it to a valid counter-part. xxd on a valid tar and compare it to the xxd for this tar file. You'll notice that instead of vast stretches
of null bytes, our invalid tar has vast strectches of 0x0c, a dead giveaway that the file was xored with 0c. So, now you just have to xor it again with 0x0c to get the valid tar file out (see dec_tar.py), untar that, and you've got the
flag!
