var _this = null;
Component({

  /**
   * 自定义组件的属性列表
   */
  properties: {
    /**
     * 原始的数据源
     */
    originalAllNodes: {
      type: Array,
      value: []
    },
    /**
     * 默认展开的层级(从0开始,也就是不展开其它层级,只显示第一层)
     */
    defaultExpandLevel: {
      type: Number,
      value: 0
    },
    /**
     * 是否展示该组件
     */
    isHiddenTreeview: {
      type: Boolean,
      value: false
    },
    /**
     * 是否是用户重新进入页面,但是之前的子节点还被暂存(根据自己项目需求选择)
     */
    isSave: {
      type: Boolean,
      value: false
    },
      /**
     * 之前暂存的子节点数据源
     */
    isSaveNodes: {
      type: Array,
      value: []
    },

  },
  /**
   * 组件的初始数据
   */
  data: {
    /**
     * 转化后的全部的数据源
     */
    convertAllNodes: [],
    /**
     * 展示的数据源
     */
    visibleNodes: []
  },
  /**
   * 数据监听器可以用于监听和响应任何属性和数据字段的变化
   */
  observers: {
    'originalAllNodes': function (params) {
      if (params.length > 0) {
        //originalAllNodes数据源为原始数据
          //将数据转化为通用Node数组，并排序
          let convertAllNodes = _this.getSortedNodes(_this.properties.originalAllNodes);
          //设置node层级(levle)
          convertAllNodes.forEach(function (node) {
            let level = _this.getLevle(convertAllNodes, node);
            node.level = level;
          });
          //从转化后的node数组中，过滤出可见的node，进行展示(默认为第一级先展示)
          let visibleNodes = _this.filterVisibleNode(convertAllNodes);

          _this.setData({
            convertAllNodes: convertAllNodes,
            visibleNodes: visibleNodes
          })
     


      }
    },
  },
  lifetimes: {
    attached: function () {
      _this = this;
    },

  },


  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 将数据转化为通用Node数组，并排序
     */
    getSortedNodes(array) {
      let result = [];
      //将用户数据转化为通用Array[Node],并确立父子关系
      let allNodes = _this.convertData2Node(array);
      //拿到根节点
      let rootNodes = _this.getRootNodes(allNodes);
      //根据默认展开层级,设置isExpand值
      for (let i = 0; i < rootNodes.length; i++) {
        let node = rootNodes[i];
        _this.addNode(allNodes, result, node, _this.properties.defaultExpandLevel, 1);
      }
      return result
    },

    /**
     * 递归调用排序,从根节点开始,每次把每个分支上的节点的内容都依次填充上去
     */
    addNode(allNodes, result, node, defaultExpandLevel, currentLevel) {
      //先将节点填充上去
      result.push(node)
      //根节点是否展开
      if (defaultExpandLevel >= currentLevel) {
        node.isExpand = true;
      }
      //是否有子节点(是否childNode的length == 0)
      if (_this.isLeaf(node)) {
        return;
      }
      for (let i = 0; i < node.childrenNode.length; i++) {
        //注意这里的currentLevel + 1 ;
        _this.addNode(allNodes, result, allNodes[node.childrenNode[i]], _this.properties.defaultExpandLevel, currentLevel + 1);
      }
    },

    /**
     * 是否是子节点(childrenNiodo的长度)
     */
    isLeaf(node) {
      return node.childrenNode.length == 0;
    },

    /**
     * 拿到根节点(可能是一个，也可能是多个)
     */
    getRootNodes(allNodes) {
      let result = [];
      for (let i = 0; i < allNodes.length; i++) {
        let node = allNodes[i];
        if (_this.isRoot(node)) {
          result.push(node);
        }
      }
      return result;
    },

    /**
     * 过滤出可见的node
     */
    filterVisibleNode(nodes) {
      let result = [];
  
      //如果有之前选中的节点的状态
      if (_this.properties.isSave) {
        for(let j = 0;j< _this.properties.isSaveNodes.length;j++){
          //只能获取到节点的名称
           let leafNodeLable = _this.properties.isSaveNodes[j];
           for (let i = 0; i < nodes.length; i++) {
            let node = nodes[i];
            //根据名称
            if ( leafNodeLable === node.lable) {
             //更改checkbox的选中值
           node.checkbox = true;
           _this.setChangeCheckBox(nodes,node);
            }
          }
        }
          //只初始化一次
          _this.properties.isSave = false;
      }

      for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i];
        //根节点或父节点展开的子节点(相对)都属于可见node
        if (_this.isRoot(node) || _this.isParentExpand(nodes, node)) {
          //设置左侧的图标为可展开
          _this.setParentNodeIcon(node)
          result.push(node);
        }
      }
      return result;
    },
    /**
     * 判断父节点是否展开
     */
    isParentExpand(nodes, node) {
      //如果是根节点
      if (node.parentNode == null) {
        return false;
      }
      //获取父节点的索引,判断父节点是否打开
      return nodes[node.parentNode].isExpand;
    },

    /**
     * 是否为根节点
     */
    isRoot(node) {
      //根据是否有父节点判断是否是根节点
      return node.parentNode == null
    },

    /**
     * 将数据转化为通用Node数组，并确立父子关系
     */
    convertData2Node(array) {
      let convertedNodes = [];
      _this.getAllNodes(convertedNodes, array);
      //将转化后的结果确立父子关系
      for (let i = 0; i < convertedNodes.length; i++) {
        //当前节点
        let node = convertedNodes[i];
        node.index = i;
        for (let j = i + 1; j < convertedNodes.length; j++) {
          //下一个节点
          let nextNode = convertedNodes[j];
          if (nextNode.pid == node.id) {
            //将子节点的索引添加到自己的childrenNode数组中
            node.childrenNode.push(j)
            //给子节点添加父节点的索引
            nextNode.parentNode = i;
          } else if (nextNode.id == node.pid) {
            nextNode.childrenNode.push(i);
            node.parentNode = j;
          }
        }
      }
      //设置父节点的图片
      for (let i = 0; i < convertedNodes.length; i++) {
        _this.setParentNodeIcon(convertedNodes[i]);
      }
      return convertedNodes;
    },

    /**
     * 遍历获取每个节点
     */
    getAllNodes(convertedNodesArray, array) {
      array.forEach(function (ele) {
        let nodedata = _this.createNode(ele.id, ele.pid, ele.name);
        convertedNodesArray.push(nodedata)
        if (ele.children.length > 0) {
          _this.getAllNodes(convertedNodesArray, ele.children);
        }
      })
    },

    /**
     * 设置父节点的图片(0表示+，1标识-，-1表示没有)
     */
    setParentNodeIcon(node) {
      if (node.childrenNode.length > 0 && node.isExpand) {
        node.icon = 1;
      } else if (node.childrenNode.length > 0 && !node.isExpand) {
        node.icon = 0;
      } else {
        node.icon = -1;
      }
    },
    /**
     * 创建Node对象
     */
    createNode(id, pid, lable) {
      let node = new Object();
      //节点id
      node.id = id;
      //父节点id
      node.pid = pid;
      //文字
      node.lable = lable;
      //上一级Node(实际是记录父节点的索引的值)
      node.parentNode = null;
      //下一级子node的数据数组(实际是记录子节点的索引的值)
      node.childrenNode = [];
      //是否展开
      node.isExpand = false;
      //icon图标(+,-)
      node.icon = -1;
      //当前的级别(层级)
      node.level = 0
      //checkbox是否选中
      node.checkbox = false;
      //自己的索引值
      node.index = -1;
      return node;
    },
    /**
     * 获取node节点的levle值
     */
    getLevle(allNodes, node) {
      return node.parentNode == null ? 0 : _this.getLevle(allNodes, allNodes[node.parentNode]) + 1;
    },

    /**
     * 点击展开或者合并文件夹
     */
    expandorcollapseFun(e) {
      let index = e.currentTarget.dataset.index;
      let currentNode = _this.data.visibleNodes[index];
      if (currentNode != null) {
        //有子节点
        if (!_this.isLeaf(currentNode)) {
          _this.isExpand(_this.data.convertAllNodes, currentNode);
          let visibleNodes = _this.filterVisibleNode(_this.data.convertAllNodes)
          //刷新
          _this.setData({
            visibleNodes: visibleNodes,
          });
        }
      }
    },

    /**
     *  点击展开或者合并文件夹向下递归同步子节点的展开状态
     */
    isExpand(allNodes, clickNode) {
      //刷新visible数组的状态(因为是地址引用,所以convertAllNodes中的也会变动)
      let state = !clickNode.isExpand;
      clickNode.isExpand = state;
      if (!_this.isLeaf(clickNode)) {
        for (let i = 0; i < clickNode.childrenNode.length; i++) {
          let node = allNodes[clickNode.childrenNode[i]];
          //如果子节点(相对)的状态和父节点不一致
          //父节点的的状态为关闭
          if (node.isExpand != state && state == false) {
            _this.isExpand(allNodes, node);
          }

        }
      }
    },
    /**
     * 单个CheckBox的点击事件
     */
    changeCheckBox(e) {
      let index = e.currentTarget.dataset.index;
      let checkNode = _this.data.visibleNodes[index];
      //更改checkbox的选中值
      checkNode.checkbox = !checkNode.checkbox;
      _this.setChangeCheckBox(_this.data.convertAllNodes,checkNode);
      let visibleNodes = _this.filterVisibleNode(_this.data.convertAllNodes);
      _this.setData({
        visibleNodes: visibleNodes,
        convertAllNodes: _this.data.convertAllNodes,
      });
    },
    /**
     * 递归将相关节点的checkebox状态变更
     */
    setChangeCheckBox(nodes,checkNode) {
      if (checkNode.checkbox && !_this.isLeaf(checkNode)) {
        //变更自己的选中状态
        let nodeIndex = checkNode.index;
        nodes[nodeIndex].checkbox = checkNode.checkbox
        //如果是选中的父节点,更改子节点选中状态
        for (let i = 0; i < checkNode.childrenNode.length; i++) {
          let node =nodes[checkNode.childrenNode[i]];
          node.checkbox = true;
          _this.setChangeCheckBox(nodes,node);
        }
      } else if (!checkNode.checkbox && !_this.isLeaf(checkNode)) {
        //变更自己的选中状态
        let nodeIndex = checkNode.index;
        nodes[nodeIndex].checkbox = checkNode.checkbox;
        //如果是选中的父节点,更改子节点选中状态
        for (let i = 0; i < checkNode.childrenNode.length; i++) {
          let node = nodes[checkNode.childrenNode[i]];
          node.checkbox = false;
          _this.setChangeCheckBox(nodes,node);
        }
      } else if (_this.isLeaf(checkNode)) {
        //如果是子节点
        let nodeIndex = checkNode.index;
        nodes[nodeIndex].checkbox = checkNode.checkbox;
        //向上递归父节点,确定是否已经全选
        _this.parentNodeChecked(nodes,nodes[nodeIndex]);
      }
    },

    /**
     * 选中子节点向上递归,判断是否需要勾选父节点
     */
    parentNodeChecked(nodes,node) {
      //说明有父节点
      if (node.parentNode != null) {
        let parentNode = nodes[node.parentNode]
        //默认子节点全部选中
        let childNodesAllChecked = true;
        for (let i = 0; i < parentNode.childrenNode.length; i++) {
          let ele = nodes[parentNode.childrenNode[i]];
          //只要有一个没有选中,就停止循环,返回结果
          if (ele.checkbox == false) {
            childNodesAllChecked = false;
            break;
          }
        };
        //如果子节点全部被选中
        if (childNodesAllChecked) {
          //更新父节点的选中状态
          parentNode.checkbox = true;
          //继续递归看看父节点的父节点需不需要全部勾选
          _this.parentNodeChecked(nodes,parentNode);
        } else {
          parentNode.checkbox = false;
          //继续递归看看父节点的父节点需不需要全部勾选
          _this.parentNodeChecked(nodes,parentNode);
        }
      }
    },


    /**
     * 点击确定按钮
     */
    sureClick() {
      //是否有选中的内容
      if (_this.isHasChecked(_this.data.convertAllNodes)) {
        _this.triggerEvent('listener', _this.data.convertAllNodes, {})
      } else {
        wx.showModal({
          title: '提示',
          content: '请至少选择一项内容',
        })
      }
    },

    isHasChecked(nodes) {
      //是否有被选中的内容
      let bol = false;
      for (let i = 0; i < nodes.length; i++) {
        let ele = nodes[i];
        if (ele.checkbox == true) {
          bol = true;
          break;
        }
      }
      return bol;
    }


  },

})