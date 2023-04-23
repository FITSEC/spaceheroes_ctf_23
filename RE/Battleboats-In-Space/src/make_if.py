str = "~~BBBBB~~B~~~~~~B~~BBBBB~~~~~B~~~~B~~~~~~~~~~B~~BBBBB~~BBBBBBB~B~~~~~B~B~~~~B~BBBBBBB~~~~B~~~~B~~~~~~B~~B~~~B~~~~B~~~~BBBBBBB~~BBBBB~~B~~~~~~B~BBBBBBB~B~~~~~~~B~~~~"

list_index = []
for i in range(0,len(str)):
    if str[i] == "B":
        print(i)
        list_index.append(i)

for index in list_index:
    if_print = f"if(master[7][{index}] != 'B') {{\n\tis_flag = 1;\n}}"
    print(if_print)