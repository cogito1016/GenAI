import datetime

now = datetime.datetime.now();
month = now.month

print(f"{now.year}년 {month}월 {now.day}일 {now.hour}시 {now.minute}분 {now.second}초")

if(3<=month<6):
    print("봄입니다!")

if(6<=month<9):
    print("여름입니다!")

if(9<=month<12):
    print("가을입니다!")

if(11<=month or month<3):
    print("겨울입니다!")
