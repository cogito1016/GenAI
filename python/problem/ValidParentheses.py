class Solution(object):
    def isValid(self, s):
        """
        :type s: str
        :rtype: bool
        """
        result = True
        target = ""
        for c in s:
            if target == c:
                target = ""
                continue
            elif target != "":
                result = False
                break

            if c == "{":
                target = "}"
            elif c == "[":
                target = "]"
            elif c =="(":
                target = ")"
        return result

s = Solution()
print(s.isValid("()[}"))