// pages/home/home.js
var that;
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    category: [], 
    offset: 1,
    pageCount: 20,
    isLast: false,
    categoryId:0,
    items: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    var param = {
      page_code: "p003",
      category_type: 1 //商品分类
    };
    that.getCategoryList(param);

    //商品列表
    var param_p = {
      page_code: "p005",
      offset: (that.data.offset - 1) * that.data.pageCount,
      page: that.data.pageCount,
      category_id:that.data.categoryId
    };
    that.getProductList(param_p);
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

    if (!that.data.isLast) {
      that.setData({
        offset: that.data.offset + 1
      });
      var param_p = {
        page_code: "p005",
        offset: (that.data.offset - 1) * that.data.pageCount,
        page: that.data.pageCount,
        category_id: that.data.categoryId
      };
      that.getProductList(param);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //以下为自定义点击事件
  getProductListFun: function (e) {
    var category_id = e.currentTarget.dataset.id;
    that.setData({
      categoryId:category_id,
      items:[]
    });
    //商品列表
    var param_p = {
      page_code: "p005",
      offset: (that.data.offset - 1) * that.data.pageCount,
      page: that.data.pageCount,
      category_id: that.data.categoryId
    };
    that.getProductList(param_p);
  },
  getCategoryList: function (param) {   //获取分类列表
    wx.request({
      url: app.globalData.domainUrl,
      data: param,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var datas = res.data.data;
        console.log(datas);
        console.log(datas.length);
        that.setData({
          category: datas
        });
      }
    });
  },

  getProductList: function (param) { //获取商品列表
    wx.request({
      url: app.globalData.domainUrl,
      data: param,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var datas = res.data.data;
        console.log(datas);
        console.log(datas.length);
        that.setData({
          items: that.data.items.concat(datas)
        });
        if (datas.length <= 0 || datas.length < that.data.pageCount) {
          that.setData({
            isLast: true
          });
        }
      }
    });
  },

  /***
   * 点击进入详情页
   * ***/
  toDetail: function (e) {
    console.log(e)
    var product_id = e.currentTarget.dataset.obj.product_id;

    app.globalData.productId = product_id;
    console.log(product_id)
    wx.navigateTo({
      url: '../detail/detail',
    })
  },
  clickTab: function (e) {
    let self = this
    let current = e.currentTarget.dataset.current;
    self.setData({
      currentTab: current
    })
  },
  // 搜索栏input回调
  searchValue: function (res) {
    console.log(res.detail.value)
    this.setData({
      searchValue: res.detail.value
    })
  },
  // 搜索栏搜索图标
  search: function (res) {
    console.log('search:--');
    console.log(this.data.searchValue);
    if (this.data.searchValue != null || this.data.searchValue != '') {
      var url = '../kind/search/search?keyword=' + this.data.searchValue;
    }
    wx.navigateTo({
      url: url,
    })

  }

})