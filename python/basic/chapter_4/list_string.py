# 문자열과 리스트에서 동일하게 사용할 수 있는 연산자
array_1 = [1,2,3]
array_2 = [4,5,6]
print(f"array_1+array_2 = {array_1+array_2}")
print(f"array_1*2 = {array_1*2}")
print(f"len(array_1) = {len(array_1)}")
## RESULT
# array_1+array_2 = [1, 2, 3, 4, 5, 6]
# array_1*2 = [1, 2, 3, 1, 2, 3]
# len(array_1) = 3

# 리스트합침방법(원본유지, 원본변화)
## 원본유지
print(array_1, array_2)
print(array_1 + array_2)
print(array_1)
print(array_2)
## 원본파괴
print(array_1.extend(array_2))
print(array_1)
print(array_2)
## RESULT
# [1, 2, 3] [4, 5, 6]
# [1, 2, 3, 4, 5, 6]
# [1, 2, 3]
# [4, 5, 6]
# None
# [1, 2, 3, 4, 5, 6]
# [4, 5, 6]