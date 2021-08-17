var json = [
  {
      "id": "0",
      "name": "动物分类",
      "pid": "-1",
      "children": [
          {
              "id": "1",
              "name": "哺乳动物",
              "pid": "0",
              "children": [
                  {
                      "id": "3",
                      "name": "狗",
                      "pid": "1",
                      "children": []
                  },
                  {
                      "id": "4",
                      "name": "猫",
                      "pid": "1",
                      "children": []
                  },
                  {
                      "id": "5",
                      "name": "大象",
                      "pid": "1",
                      "children": []
                  }
              ]
          },
          {
              "id": "2",
              "name": "鸟类",
              "pid": "0",
              "children": [
                  {
                      "id": "6",
                      "name": "喜鹊",
                      "pid": "2",
                      "children": []
                  },
                  {
                      "id": "7",
                      "name": "麻雀",
                      "pid": "2",
                      "children": []
                  },
                  {
                      "id": "8",
                      "name": "乌鸦",
                      "pid": "2",
                      "children": []
                  }
              ]
          }
      ]
  }
]

module.exports ={
  testJson : json,
}