# 문자열 양옆의 공백 제거하기 strip()
## 여타 다른 언어의 trim()과 비슷할 것 같다.
## 왼쪽공백만 제거하는 lstrip() 오른쪽공백만 제거하는 rstrip()도 있다.
var_str = "      안 녕 하 세 요 ??        "
print(var_str)
print(var_str.strip())
## RESULT
#       안 녕 하 세 요 ??        
# 안 녕 하 세 요 ??
