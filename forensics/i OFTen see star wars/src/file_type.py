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

# Read in all fonts
globs = glob.glob('*.otf')

counter = 1

for glob1 in globs:
    # Read in font
    tt = ttLib.TTFont(glob1)

    #shctf{th3r3_1s_always_s0me_h0p3_4r0und}
    match counter:      # Build font family
        case 1:
            tt['head'].magicNumber = ord("s")
            tt['OS/2'].achVendID = "hctf"
            tt.save("../distrib/1-"+glob1)
        case 2:
            tt['head'].magicNumber = ord("{")
            tt['OS/2'].achVendID = "th3r"
            tt.save("../distrib/2-"+glob1)
        case 3:
            tt['head'].magicNumber = ord("3")
            tt['OS/2'].achVendID = "_1s_"
            tt.save("../distrib/3-"+glob1)
        case 4:
            tt['head'].magicNumber = ord("a")
            tt['OS/2'].achVendID = "lway"
            tt.save("../distrib/4-"+glob1)
        case 5:
            tt['head'].magicNumber = ord("s")
            tt['OS/2'].achVendID = "_s0m"
            tt.save("../distrib/5-"+glob1)
        case 6:
            tt['head'].magicNumber = ord("e")
            tt['OS/2'].achVendID = "_h0p"
            tt.save("../distrib/6-"+glob1)
        case 7:
            tt['head'].magicNumber = ord("3")
            tt['OS/2'].achVendID = "_4r0"
            tt.save("../distrib/7-"+glob1)
        case 8:
            tt['head'].magicNumber = ord("u")
            tt['OS/2'].achVendID = "nd}"
            tt.save("../distrib/8-"+glob1)
    
    counter += 1

# With Reasearch From:
# ttFont documenetation: https://fonttools.readthedocs.io/en/latest/ttLib/ttFont.html
# ttx documentation: https://fonttools.readthedocs.io/en/latest/_modules/fontTools/ttx.html
# Offical OTF documentation: https://learn.microsoft.com/en-us/typography/opentype/spec/otff
# Extra OTF breakdown: https://docs.fileformat.com/font/otf/
