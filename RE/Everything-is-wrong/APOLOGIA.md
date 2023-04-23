## Y Haskell tho?

I'm super lazy, so I like to cheat on problems to make my life easier. There are a LOT of CTF challenges out there that
are kinda simple "flag guesser" challenges that you can just bulldoze through with running super simple side-channel
timing
attacks, since they will fail early if part of a flag is wrong. I wanted to make a challenge that *heavily incentivizes*
the use of tools outside a disassembler and gdb. Haskell disassembly is horrendous to look at and it can be hard to
figure
out what is happening while debugging so it seemed to be an easy enough way to get people to do something else. It also
has the upside of just breaking some common tools, forcing people out of their comfort zones. (You used to be able to
crash ida too :()
And I just wanted to see how other people approached a problem like this since I've not seen haskell RE writeups in the
past.
And it's just fun to write haskell.

## Theme sucks tho

¯\_(ツ)_/¯

Once upon a time there was a man named Lagrange. Lagrange made incredible contributions to science and mathematics, one
of which was a solution to the 3 body problem.
![](https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Lagrange_points_simple.svg/1200px-Lagrange_points_simple.svg.png)

Note the points labeled L1-L5 on the chart. These are what are known
as [Lagrange points](https://en.wikipedia.org/wiki/Counter-Earth), which are "positions in space
where the gravitational forces of a two body system like the Sun and the Earth produce enhanced regions of attraction
and
repulsion"(Nasa, OSINT challenge) The one that is neatest from sci-fi's perspective would be the L3 point, a point
*exactly opposite*
of the smaller body in an orbiting system of 2 large masses, i.e. the Earth and the Sun. There has been science fiction
generated for thousands
of years centered on the concept of a [counter-earth](https://en.wikipedia.org/wiki/Counter-Earth) (Antichthon in
greek), and I thought it would be fun (for me) idea to do a mirror-earth themed
challenge that also calls out Lagrange for being an OG. Originally I was working on making a Crypto problem
leveraging [Lagrange Interpolation Polynomials](https://en.wikipedia.org/wiki/Lagrange_polynomial),
but my brain is too small to do math good so I just tossed it into a haskell binary so that I could at least accomplish
that goal. The fact that i felt the need to make this document to justify my challenge is probably an indicator of how
well that went across.

## **"Intended"** Solution

I wouldn't call it intended since I was hoping that people would approach instrumenting the binary in different ways,
but the intel perf tool works for quick and dirty instruction count
based [side-channel attacks](https://en.wikipedia.org/wiki/Side-channel_attack). I used a variation on a python script
stolen from [guyinatuxedo](https://guyinatuxedo.github.io/) that is from an
excellent [writeup](https://guyinatuxedo.github.io/22-movfuscation/recon_movfuscated/index.html) from his (free) pwn/re
course that does a good job of explaining the concepts.











