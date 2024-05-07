# 형변환
str1 = "1"
print(str1)
print(type(str1))

# 문자열을 숫자로
num = int(str1)
print(num)
print(type(num))

# 문자열을 실수로
flo = float(str1)
print(flo)
print(type(flo))

# 숫자를 문자열로
str2 = str(num)
print(str2)
print(type(str2))

# 실수를 문자열로
str3 = str(flo)
print(str3)
print(type(str3))

# RESULT
# 1
# <class 'str'>
# 1
# <class 'int'>
# 1.0
# <class 'float'>
# 1
# <class 'str'>
# 1.0
# <class 'str'>