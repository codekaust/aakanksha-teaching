def push(st, item):
    st.append(item)          # list end == stack top

def pop(st):
    if st == []:
        return "Underflow"
    return st.pop()

def peek(st):
    if st == []:
        return "Underflow"
    return st[-1]

def isEmpty(st):
    return st == []
