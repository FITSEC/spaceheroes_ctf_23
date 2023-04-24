# DSAlien
Author: **Pwnut**
<br><br>
We've made contact with an alien! For as snarky as he is though, he doesn't seem to be using a very advanced communication system... see if you can teach him a lesson.

```python
from pwn import * 
p=remote("spaceheroes-dsalien.chals.io", 443, ssl=True, sni="spaceheroes-dsalien.chals.io")
p.interactive()
```
