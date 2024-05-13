#인덱스로 제거하기
num_list = [1,2,3,4,5]
print(num_list)
del num_list[2]
print(num_list)

num_list.pop()
print(num_list)
## RESULT
# [1, 2, 3, 4, 5]
# [1, 2, 4, 5]
# [1, 2, 4]