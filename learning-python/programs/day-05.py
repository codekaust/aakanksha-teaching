def count_text_file(file_name):
    line_count = 0
    word_count = 0
    character_count = 0
    with open(file_name, "r") as file:
        for line in file:
            line_count += 1
            word_count += len(line.split())
            character_count += len(line)
    print("No. of lines =", line_count)
    print("No. of words =", word_count)
    print("No. of characters =", character_count)
def create_text_file(file_name, content):
    with open(file_name, "w") as file:
        file.write(content)
file_name = "sample.txt"
content = "Hi Ada\nLearn Python"
create_text_file(file_name, content)
print("Entered content into the file:")
print(content)
count_text_file(file_name)
