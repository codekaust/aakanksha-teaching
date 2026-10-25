def linear_search(list, ele):
    n = len(list)
    for i in range(n):
        if list[i] == ele:
            return i
    return None

def input_list():
    list = []
    n = int(input("How many elements? "))
    print("Enter the elements:")
    for i in range(n):
        ele = int(input())
        list.append(ele)
    return list
list = input_list()

ele = int(input("Enter the search element: "))
pos = linear_search(list, ele)
if pos is None:
    print(ele, "not found in the list")
else:
    print(ele, "found at index", pos)
