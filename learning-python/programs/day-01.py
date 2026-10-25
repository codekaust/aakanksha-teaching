def fibo(n):
    n1 = 0
    n2 = 1
    i = 2
    print("Fibonacci numbers are:")
    print(n1, n2, end=" ")
    while i < n:
        i = i + 1
        n3 = n1 + n2
        print(n3, end=" ")
        n1 = n2
        n2 = n3
n = int(input("Enter the number of terms (at least 2): "))
fibo(n)
