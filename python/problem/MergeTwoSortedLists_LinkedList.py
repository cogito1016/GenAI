from typing import Optional

class ListNode:
    def __init__(self,val=None,next=None):
        self.val = val
        self.next = next


class Solution(object):
    def mergeTwoLists(self, list1, list2):
        """
        :type list1: Optional[ListNode]
        :type list2: Optional[ListNode]
        :rtype: Optional[ListNode]
        """
        result = ListNode()
        resultInner = result
        while (list1 or list2):
            if (not list2):
                resultInner.next = ListNode(list1.val)
                list1 = list1.next
                resultInner = resultInner.next
                continue
            if (not list1):
                resultInner.next = ListNode(list2.val)
                list2 = list2.next
                resultInner = resultInner.next
                continue

            if (list1.val < list2.val):
                resultInner.next = ListNode(list1.val)
                list1 = list1.next
                resultInner = resultInner.next
                continue
            if (list2.val < list1.val):
                resultInner.next = ListNode(list2.val)
                list2 = list2.next
                resultInner = resultInner.next
                continue
            if (list1.val == list2.val):
                resultInner.next = ListNode(list1.val)
                resultInner.next.next = ListNode(list2.val)
                list1 = list1.next
                list2 = list2.next
                resultInner = resultInner.next.next
                continue

        if result.next:
            result = result.next
        else:
            result = None

        return result

l1 = ListNode(1)
l1.next = ListNode(2)
l1.next.next = ListNode(4)

l2 = ListNode(1)
l2.next = ListNode(3)
l2.next.next = ListNode(4)

s = Solution()
s.mergeTwoLists(l1,l2)