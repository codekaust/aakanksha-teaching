def insertion_sort(list):
    n = len(list)
    for i in range(1, n):
        j = i - 1
        while j >= 0:
            if list[j + 1] < list[j]:
                list[j + 1], list[j] = list[j], list[j + 1]
            j = j - 1

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
insertion_sort(list)
print("Sorted list:", list)
