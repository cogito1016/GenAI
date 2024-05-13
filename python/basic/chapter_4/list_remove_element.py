# 인덱스로 제거하기 del, pop
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

# 값으로 제거하기 remove
num_list_2 = [1,2,1,2,3]
print(num_list_2)
num_list_2.remove(2)
print(num_list_2)
## RESULT
# [1, 2, 1, 2, 3]
# [1, 1, 2, 3]

# 리스트 요소 전부삭제 clear
num_list_2.clear()
print(num_list_2)
## RESULT
# []