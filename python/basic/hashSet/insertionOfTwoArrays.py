class Solution(object):
    def intersection(self, nums1, nums2):
        """
        :type nums1: List[int]
        :type nums2: List[int]
        :rtype: List[int]
        """
        s = {*nums1}
        result = set()

        for n in nums2:
            if n in s:
                result.add(n)

        return [*result]


s = Solution()
print(s.intersection([1,2,2,1],[2,2]))