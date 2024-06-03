class MyHashSet(object):

    def __init__(self):
        self.size = 10 ** 6 + 1
        self.set = [0] * self.size

    def add(self, key):
        """
        :type key: int
        :rtype: None
        """
        self.set[key] = 1


    def remove(self, key):
        """
        :type key: int
        :rtype: None
        """
        self.set[key] = 0


    def contains(self, key):
        """
        :type key: int
        :rtype: bool
        """
        return self.set[key]

# Constraints:
# 0 <= key <= 10^6
# At most 104 calls will be made to add, remove, and contains.

# Your MyHashSet object will be instantiated and called as such:
obj = MyHashSet()
obj.add(1)
obj.remove(1)
# param_3 = obj.contains(key)