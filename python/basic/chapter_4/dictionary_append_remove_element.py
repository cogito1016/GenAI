## 딕셔너리 키 추가
movie = {
    "name":"엔드게임",
    "type":"히어로"
}
movie["가격"]=19400
print(movie)
## RESULT
# {'name': '엔드게임', 'type': '히어로', '가격': 19400}

## 딕셔너리 키 삭제
del movie["type"]
print(movie)
## RESULT
# {'name': '엔드게임', '가격': 19400}

## 딕셔너리 키 확인
print("type" in movie) # FALSE
print("name" in movie) # TRUE

name_value = movie.get("name")
print (name_value)
type_value = movie.get("type")
print (type_value)
## RESULT
# 엔드게임
# None