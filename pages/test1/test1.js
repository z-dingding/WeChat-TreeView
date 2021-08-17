// pages/test1/test1.js

var jsondata = require("../data/json")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    defaultExpandLevel: 0,
    originalAllNodes: [],
    isHideTreeView: true,

    strleafNodes:'',
    strParentNodes:'',
    stringparentNode:'',
    isSave:false,
    isSaveNodes:["狗","猫","喜鹊","大象"],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let data = jsondata.testJson;
    this.setData({
      originalAllNodes: data,
      defaultExpandLevel: this.data.defaultExpandLevel
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 按钮点击
   */
  showTreeView() {
    let state = !this.data.isHideTreeView;
    this.setData({
      isHideTreeView: state,
    })
  },
  /**
   * 点击选则框的确定按钮回调函数
   */
  selectListener(e) {
    //关闭弹窗
    this.setData({
      isHideTreeView: true,
    })

    //获取数据源
    var allData = e.detail;
    //获取所有子节点的选项内容(不包括父节点)
    let leafNodes = this.allSelectleafNode(allData);
    //获取所有子节点的的lable数组
    let leafNodesLable = leafNodes.map(this.mpaLable)
    //过滤掉相同的元素
    let filterLeafNode = leafNodesLable.filter(function (item,index,self) {
      return self.indexOf(item) == index;
    })
    //所有子节点包括(不包括父节点)的字符串
    let strleafNodes = filterLeafNode.join(",");
    //所有有选中子节点的父节点数组(包括全选和部分选中),(不包含子节点数组)
    let parentNode = this.allSelectParentNode2(allData);
    let stringparentNode = parentNode.map(this.mpaLable).join(",");
    //所有有选中子节点的父节点数组(包括全选和部分选中),(包含子节点数组)
    let parentNodes = this.allSelectParentNode(allData);
    let strParentNodes = this.parentNodesLable(allData,parentNodes);

    this.setData({
      strleafNodes:strleafNodes,
      stringparentNode:stringparentNode,
      strParentNodes:strParentNodes,
    })
  },

  allSelectParentNoses(){

  },
  parentNodesLable(alldatas,parentNodes){
    let allString = '';
    for(let i = 0;i<parentNodes.length;i++){
      let parentArray = parentNodes[i];
      let node = parentArray[0];
      let parentNode = alldatas[node.parentNode];
      let childrenNodes = parentArray.map(this.mpaLable);
      let string =  `${parentNode.lable}(${childrenNodes.join(",")});`
      allString+=string;
    }
     return allString;
  },

    /**
   * 获取所有选中的父节点,不包括根节点
   */
  allSelectParentNode2(allData) {
    let parentNodes = [];
    let result = [];
    allData.forEach(function (ele) {
      //有子节点且不是根节点的父节点
      if (ele.childrenNode.length > 0 && ele.parentNode != null) {
        parentNodes.push(ele);
      }
    });

    for (let i = 0; i < parentNodes.length; i++) {
      let parent = parentNodes[i];
      for (let j = 0; j < parent.childrenNode.length; j++) {
        //获取子节点索引
        let index = parent.childrenNode[j]
        //获取子节点点
        let node = allData[index];
        //如果有选中的子节点
        if (node.checkbox) {
          result.push(parent);
           break;
        }
      }
    }
    return result;
  },

  /**
   * 获取所有选中的父节点,不包括根节点
   */
  allSelectParentNode(allData) {
    let parentNodes = [];
    let result = [];
    allData.forEach(function (ele) {
      //有子节点且不是根节点的父节点
      if (ele.childrenNode.length > 0 && ele.parentNode != null) {
        parentNodes.push(ele);
      }
    });

    for (let i = 0; i < parentNodes.length; i++) {
      let parentArray = new Array();
      let parent = parentNodes[i];
      for (let j = 0; j < parent.childrenNode.length; j++) {
        //获取子节点索引
        let index = parent.childrenNode[j]
        //获取子节点点
        let node = allData[index];
        //如果有选中的子节点
        if (node.checkbox) {
           parentArray.push(node);
        }
      }
      if(parentArray.length > 0){
        result.push(parentArray);
      }
    }
    return result;
  },

  mpaLable(node) {
    let n = node.lable;
    return n;
  },

  /**
   * 获取所有选中的子节点
   */
  allSelectleafNode(allData) {
    let result = [];
    allData.forEach(function (ele) {
      //没有子节点且选中
      if (ele.childrenNode.length == 0 && ele.checkbox) {
        result.push(ele);
      }
    })
    return result;
  }












})