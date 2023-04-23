#!/bin/sh
tar -xvf conspiracy_nut.tar.gz
volatility -f conspiracy_nut.dump --profile=Win7SP1x64 raw2dmp -O vol_conspiracy_nut.dump
mkdir files
volatility -f vol_conspiracy_nut.dump --profile=Win7SP1x64 vaddump --dump-dir=./files
file files/* | awk -F ':' '/PC bitmap/ {print "cp "$1" ./flag.bmp"}' | sh -
rm -rf vol_conspiracy_nut.dump files conspiracy_nut.dump
