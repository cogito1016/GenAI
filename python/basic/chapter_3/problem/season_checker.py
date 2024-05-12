import datetime

now = datetime.datetime.now().month

print(f"현재 {now}월 입니다")
if(2<=now<5):
    print("봄입니다.")
elif(5<=now<8):
    print("여름입니다")
elif(8<=now<11):
    print("가을입니다")
elif(11<=now or 1==now):
    print("겨울입니다")