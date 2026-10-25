def count_characters(file_name):
    vowel = "aeiouAEIOU"
    vowel_count = 0
    consonant_count = 0
    uppercase_count = 0
    lowercase_count = 0
    with open(file_name, "r") as file:
        text = file.read()
    for char in text:
        if char.isalpha():
            if char in vowel:
                vowel_count += 1
            else:
                consonant_count += 1
            if char.isupper():
                uppercase_count += 1
            elif char.islower():
                lowercase_count += 1
    print("No. of vowels =", vowel_count)
    print("No. of consonants =", consonant_count)
    print("No. of uppercase =", uppercase_count)
    print("No. of lowercase =", lowercase_count)
def create_text_file(file_name, content):
    with open(file_name, "w") as file:
        file.write(content)
file_name = "letters.txt"
content = input("Enter a sentence: ")
create_text_file(file_name, content)
count_characters(file_name)
