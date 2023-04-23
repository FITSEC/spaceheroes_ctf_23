# Run this file from inside the folder containing all the X-Aurbersh font files

from fontTools import ttLib
from fontTools.ttLib import TTFont, TTLibError
from fontTools.misc.macCreatorType import getMacCreatorAndType
from fontTools.unicode import setUnicodeData
from fontTools.misc.textTools import Tag, tostr
from fontTools.misc.timeTools import timestampSinceEpoch
from fontTools.misc.loggingTools import Timer
from fontTools.misc.cliTools import makeOutputFileName
import os
import sys
import getopt
import re
import logging
import glob

# Read in all .otf font files
globs = glob.glob('*.otf')

# Keep track of the flag
flag = ""

for glob1 in globs:
    #shctf{th3r3_1s_always_s0me_h0p3_4r0und}
    # Read in the individual font
    tt = ttLib.TTFont(glob1)

    #https://fontdrop.info

    # Build the flag
    flag += chr(tt['head'].magicNumber)
    flag += tt['OS/2'].achVendID

    # Debug prints
    #print(tt['head'].magicNumber)
    #print(tt['OS/2'].achVendID)

print(flag)