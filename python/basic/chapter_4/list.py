array = [1, 2, 1.1, "안녕", True]
print(array)
print(type(array))

##RESULT
# [1, 2, 1.1, '안녕', True]
# <class 'list'>

print(array[1:4]) # 1번인덱스부터(0부터 시작하는 인덱스 기준) 4번째숫자까지(1부터 시작하는 개수 기준)

# 음수로 뒤에서 부터 접근 (문자열과 마찬가지)
print(array[-1]) # True
print(array[-2]) # "안녕"