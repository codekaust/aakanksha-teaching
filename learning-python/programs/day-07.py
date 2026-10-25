import pickle
while True:
    print("1. Create binary files")
    print("2. Display all records")
    print("3. Display records with percentage >= 90")
    print("4. Exit")
    a = int(input("Enter the option from 1 to 4: "))
    if a == 1:
        f = open("student.dat", "wb")
        o = open("selected.dat", "wb")
        x = int(input("How many students? "))
        for i in range(x):
            name = input("Enter a name: ")
            eng = int(input("English marks: "))
            lang = int(input("Language marks: "))
            eco = int(input("Economics marks: "))
            bs = int(input("Business Studies marks: "))
            acc = int(input("Accountancy marks: "))
            cs = int(input("Computer Science marks: "))
            tot = eng + lang + eco + bs + acc + cs
            per = (tot / 600) * 100
            t = [name, eng, lang, eco, bs, acc, cs, tot, per]
            pickle.dump(t, f)
            if per >= 90:
                pickle.dump(t, o)
        f.close()
        o.close()
    elif a == 2:
        f = open("student.dat", "rb")
        try:
            while True:
                p = pickle.load(f)
                print(p)
        except EOFError:
            f.close()
    elif a == 3:
        print("Students with percentage >= 90:")
        o = open("selected.dat", "rb")
        try:
            while True:
                s = pickle.load(o)
                print(s)
        except EOFError:
            o.close()
    else:
        break
