class Solution(object):
    def containsDuplicate(self, nums):
        """
        :type nums: List[int]
        :rtype: bool
        """
        s = set()
        for n in nums:
            if n in s:
                return True
            s.add(n)
        return False



s = Solution()
print(s.containsDuplicate([1,2,3,1]))