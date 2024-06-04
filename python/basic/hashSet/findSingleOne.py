class Solution(object):
    def singleNumber(self, nums):
        """
        :type nums: List[int]
        :rtype: int
        """
        s = set()
        for n in nums:
            if n in s:
                s.remove(n)
                continue
            s.add(n)

        return s.pop()

s = Solution()
print(s.singleNumber([2,2,1]))
