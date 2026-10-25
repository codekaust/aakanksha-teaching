def fact(n):
    if n == 0 or n == 1:
        return 1
    else:
        return n * fact(n - 1)
def sum(n):
    if n == 0:
        return 0
    else:
        return n + sum(n - 1)
num = int(input("Enter a non-negative number: "))
print("1. Factorial of a number")
print("2. Sum of natural numbers")
print("3. Exit")
opt = int(input("Enter the option from 1 to 3: "))
if opt == 1:
    print("Factorial of", num, "=", fact(num))
elif opt == 2:
    print("Sum of", num, "natural numbers =", sum(num))
elif opt == 3:
    print("Exit")
else:
    print("Invalid choice")
