import datetime

hour = datetime.datetime.now().hour

if(hour<12):
    print("오전입니다")

if(12<=hour):
    print("오후입니다")