def simint(p, t, r):
    si = float(p * t * r / 100)
    return si
def comint(p, t, r):
    amt = float(p * (1 + r / 100) ** t)
    ci = amt - p
    return ci
p = float(input("Enter the principal amount: "))
t = float(input("Enter the time: "))
r = float(input("Enter the rate of interest: "))
si = simint(p, t, r)
ci = comint(p, t, r)
diff = ci - si
print("Simple interest is Rs. %.2f" % si)
print("Compound interest is Rs. %.2f" % ci)
print("Difference amount is Rs. %.2f" % diff)
