def push(stack, ele):
    stack.append(ele)
    print(ele, "pushed into the stack")
stack = []
print("Initially stack is empty:", stack)
push(stack, 12)
push(stack, 24)
push(stack, 14)
print("Elements in the stack now:", stack)
print("Elements removed from the stack:")
print(stack.pop())
print(stack.pop())
print(stack.pop())
print("Contents of stack now:", stack)
