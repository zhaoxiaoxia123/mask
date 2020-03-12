// pages/home/home.js
var that = this;
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    indicatorDots: true,
    indicatorColor: "#000000",
    indicatorActiveColor: "#b7aa00",
    autoplay: true,
    interval: 3000,
    duration: 500,
    circular: true,
    keyword: '',
    offset: 1,
    pageCount: 20,
    isLast: false,
    categoryId: 0,
    items: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.setData({
      keyword:options.keyword
    });

    //商品列表
    var param_p = {
      page_code: "p005",
      offset: (that.data.offset - 1) * that.data.pageCount,
      page: that.data.pageCount,
      category_id: that.data.categoryId,
      keyword: that.data.keyword
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
        category_id: that.data.categoryId,
        keyword:that.data.keyword
      };
      that.getProductList(param);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

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
      url: '/pages/detail/detail',
    })
  },
})