class Solution(object):
    def isValid(self, s):
        """
        :type s: str
        :rtype: bool
        """
        result = True
        stack = list(s)
        calcul_stack = []
        while(len(stack)!=0):
            c = stack.pop()
            if len(calcul_stack) ==0:
                calcul_stack.append(c)
                continue

            peek = calcul_stack[len(calcul_stack) - 1]
            if (c == "[" and peek == "]") or (c == "(" and peek == ")") or (c == "{" and peek == "}"):
                calcul_stack.pop()
                continue
            calcul_stack.append(c)

        if len(calcul_stack)!=0:
            result = False

        return result

s = Solution()
print(s.isValid("()[{)]"))