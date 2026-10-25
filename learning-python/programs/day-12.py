def binary_search(list, ele):
    n = len(list)
    first = 0
    last = n - 1
    while first <= last:
        mid = (first + last) // 2
        if ele == list[mid]:
            return mid
        elif ele < list[mid]:
            last = mid - 1
        else:
            first = mid + 1
    return None

def input_list():
    list = []
    n = int(input("How many elements? "))
    print("Enter the elements in ascending order:")
    for i in range(n):
        ele = int(input())
        list.append(ele)
    return list
list = input_list()

ele = int(input("Enter the search element: "))
pos = binary_search(list, ele)
if pos is None:
    print(ele, "not found in the list")
else:
    print(ele, "found at index", pos)
