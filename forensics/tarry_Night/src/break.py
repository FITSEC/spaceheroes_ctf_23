with open("new_tarry_night.tar.gz","rb") as fixed:
	fixed.read(3)
	broke = fixed.read()

open("tarry_night.tar.gz","wb").write(broke)
