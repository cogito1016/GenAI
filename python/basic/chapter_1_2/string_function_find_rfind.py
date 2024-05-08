# 문자열 내부에 특정 문자 위치 확인
## find - 왼쪽부터 찾아서 처음 등장하는 위치 반환
## rfind - 오른쪽부터 찾아서 처음 등장하는 위치 반환

## ex) 안녕안녕하세요
var_str = "안녕안녕하세요"
print(var_str.find("안녕"))
print(var_str.rfind("안녕"))
## RESULT
# 0
# 2

# (안 녕) (안 녕) 하 세 요
# 0  1    2  3  4  5 6