#!/bin/sh
when="moon_landing"
vm="win7"
prof="Win7SP1x64"
sudo virsh dump $vm $when.dump --memory-only
sudo chown condor0010:condor0010 $when.dump
