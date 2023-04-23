with open("tarry_night.tar.gz","rb") as corrupted:
	body = corrupted.read()

with open("new_tarry_night.tar.gz","wb") as fixed:
	fixed.write(b'\x1f\x8b\x08')
	fixed.write(body)
