class Solution(object):
    def isHappy(self, n):
        """
        :type n: int
        :rtype: bool
        """
        s = set()

        while(n not in s):
            if(n == 1):
                return True
            s.add(n)

            nArr = list(str(n))
            n = 0
            for nTemp in nArr:
                n += int(nTemp) ** 2
        return False


# num = 12345
# print(list(str(num)))

s = Solution()
print(s.isHappy(1221))
print(s.isHappy(4))
print(s.isHappy(7))
print(s.isHappy(19))