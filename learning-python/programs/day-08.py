def bubble_sort(list1):
    n = len(list1)
    for i in range(n):
        for j in range(0, n - i - 1):
            if list1[j] > list1[j + 1]:
                list1[j], list1[j + 1] = list1[j + 1], list1[j]

def input_list():
    list = []
    n = int(input("How many elements? "))
    print("Enter the elements:")
    for i in range(n):
        ele = int(input())
        list.append(ele)
    return list
list = input_list()

print("Original list:", list)
bubble_sort(list)
print("Sorted list:", list)
