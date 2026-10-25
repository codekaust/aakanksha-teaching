import pickle
while True:
    print("1. Create a binary file")
    print("2. Display the contents")
    print("3. Exit")
    a = int(input("Enter the option from 1 to 3: "))
    if a == 1:
        f = open("student.dat", "wb")
        x = int(input("How many students? "))
        for i in range(x):
            name = input("Enter the name: ")
            eng = int(input("English marks: "))
            lang = int(input("Language marks: "))
            eco = int(input("Economics marks: "))
            bs = int(input("Business Studies marks: "))
            acc = int(input("Accountancy marks: "))
            cs = int(input("Computer Science marks: "))
            t = [name, eng, lang, eco, bs, acc, cs]
            pickle.dump(t, f)
        f.close()
    elif a == 2:
        f = open("student.dat", "rb")
        try:
            while True:
                p = pickle.load(f)
                print(p)
        except EOFError:
            f.close()
    else:
        break
