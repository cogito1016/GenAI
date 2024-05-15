# 키-값 쌍 저장소
movie = {
    "name":"아이언맨",
    "type":"히어로"
}
print(movie)
print(movie['name'])
print(movie['type'])
# {'name': '아이언맨', 'type': '히어로'}
# 아이언맨
# 히어로

movie['name'] = '엔드게임'
print(movie)
# {'name': '아이언맨', 'type': '히어로'}
# 아이언맨
# 히어로
# {'name': '엔드게임', 'type': '히어로'}