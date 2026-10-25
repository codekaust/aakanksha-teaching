def enqueue(queue, ele):
    queue.append(ele)
    print(ele, "pushed into the queue")
queue = []
print("Initially queue is empty:", queue)
enqueue(queue, 100)
enqueue(queue, 200)
enqueue(queue, 300)
print("Elements in the queue now:", queue)
print("Elements removed from the queue:")
print(queue.pop(0))
print(queue.pop(0))
print(queue.pop(0))
print("Contents of queue now:", queue)
