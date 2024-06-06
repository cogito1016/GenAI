class Solution(object):
    def isHappy(self, n):
        """
        :type n: int
        :rtype: bool
        """
        while(n != 1):
            if(n == 4):
                return False

            strArr = list(str(n))
            n=0
            for s in strArr:
                nTemp = int(s)
                n += nTemp ** 2
            print(n)
        return True


# num = 12345
# print(list(str(num)))

s = Solution()
print(s.isHappy(1221))
print(s.isHappy(4))
print(s.isHappy(7))
print(s.isHappy(19))