class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

    def __str__(self):#객체를 직접 출력 시 호출되는 함수 오버라이딩
        next_val = self.next.val if self.next else "None"
        return f"NODE_VAL : {self.val} NEXT_VAL : {next_val}"


a = ListNode(1)
b = ListNode(2)

print(a)
print(b)

a.next = b
print(a)
print(b)