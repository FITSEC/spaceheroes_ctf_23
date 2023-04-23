#!/bin/bash

while [ true ]; do
	su -c "socat -dd TCP4-LISTEN:31337,fork,reuseaddr EXEC:'./DSAlien.py',pty,echo=0,raw,iexten=0"
done;
