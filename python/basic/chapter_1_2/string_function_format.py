# 다양한 문자열 함수
## format를 사용한 숫자를 문자열로 변환
var_int = 10
print(var_int)
print(type(var_int))

var_str = "{}".format(var_int)
print(var_str)
print(type(var_str))

## format은 중괄호로 포맷을 정하여 데이터를 할당시킨다. 
## 따라서, 중괄호의 개수와 파라미터의 개수가 같아야한다
var_str_2 = "{} {} {}".format(var_int, 152, var_int)
print(var_str_2)
print(type(var_str_2))

## RESULT
# 10
# <class 'int'>
# 10
# <class 'str'>
# 10 152 10
# <class 'str'>

## format을 사용하여 다양한 문자열을 첨가할 수 있다.
## javacsript의 백틱``과 ${}구문이 생각난다.
var_str_3 = "{}이 숫자를 보시면 참 재밌죠?".format(var_int)
print(var_str_3)
## RESULT 
# <class 'str'>
# 10이 숫자를 보시면 참 재밌죠?

# 뿐만아니라 다양한 포맷을 지정할 수 있다.
# ex) +기호 붙이기, 출력 시 공백 5개를 추가하기, 추가된 공백을 0으로 대체시키기 등...
