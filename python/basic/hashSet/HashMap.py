class MyHashMap(object):

    def __init__(self):
        self.map = {}

    def put(self, key, value):
        """
        :type key: int
        :type value: int
        :rtype: None
        """
        self.map[key] = value

    def get(self, key):
        """
        :type key: int
        :rtype: int
        """
        if key in self.map:
            return self.map[key]
        return -1

    def remove(self, key):
        """
        :type key: int
        :rtype: None
        """
        if key in self.map:
            del self.map[key]

# Your MyHashMap object will be instantiated and called as such:
myHashMap = MyHashMap();

myHashMap.put(1, 1); # The map is now [[1,1]]
myHashMap.put(2, 2); # The map is now [[1,1], [2,2]]
myHashMap.get(1);    # return 1, The map is now [[1,1], [2,2]]
myHashMap.get(3);    # return -1 (i.e., not found), The map is now [[1,1], [2,2]]
myHashMap.put(2, 1); # The map is now [[1,1], [2,1]] (i.e., update the existing value)
myHashMap.get(2);    # return 1, The map is now [[1,1], [2,1]]
myHashMap.remove(2); # remove the mapping for 2, The map is now [[1,1]]
myHashMap.get(2);    # return -1 (i.e., not found), The map is now [[1,1]]