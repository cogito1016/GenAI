# Definition for singly-linked list.
# class ListNode(object):
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution(object):
    def mergeTwoLists(self, list1, list2):
        """
        :type list1: Optional[ListNode]
        :type list2: Optional[ListNode]
        :rtype: Optional[ListNode]
        """
        aPointer = 0
        bPointer = 0
        aLen = len(list1)
        bLen = len(list2)
        result = []

        while (aPointer < aLen or bPointer < bLen):
            if (list1[aPointer] == list2[bPointer]):
                result.append(list1[aPointer])
                result.append(list1[aPointer])
                aPointer+=1
                bPointer+=1
            elif (list1[aPointer] < list2[bPointer]):
                result.append(list1[aPointer])
                aPointer += 1
            else:
                result.append(list2[bPointer])
                bPointer += 1

            if aPointer == aLen:
                list1[aPointer - 1] = 51
                continue

            if bPointer == bLen:
                list2[bPointer - 1] = 51
                continue

        return result

s = Solution()
s.mergeTwoLists([1,2,4],[1,3,4])




