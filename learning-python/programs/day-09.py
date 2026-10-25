def selection_sort(list2):
    n = len(list2)
    for i in range(n):
        min = i
        for j in range(i + 1, n):
            if list2[j] < list2[min]:
                min = j
        list2[i], list2[min] = list2[min], list2[i]

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
selection_sort(list)
print("Sorted list:", list)
