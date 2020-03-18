// pages/home/home.js
var that;
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: '0',
    indicatorDots: true,
    indicatorColor: "#000000",
    indicatorActiveColor: "#b7aa00",
    autoplay: true,
    interval: 3000,
    duration: 500,
    circular: true,
    offset: 1,
    pageCount: 20,
    isLast: false,
    order_state: 1,
    memberNo: wx.getStorageSync('memberNo'),
    items: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.setData({
      currentTab: parseInt(options.id) - 1,
      order_state:options.id
    });
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
    that.setData({
      items: [],
      isLast: false
    });

    var param = {
      page_code: 'p008',
      type: "myOrder",
      customer_id: wx.getStorageSync('customerId'),
      order_type: 1,//购买订单
      order_state: that.data.order_state,
      offset: (that.data.offset - 1) * that.data.pageCount,
      page: that.data.pageCount
    };
    that.getOrderList(param);
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
      var param = {
        page_code: 'p008',
        type: "myOrder",
        customer_id: wx.getStorageSync('customerId'),
        order_type: 1,//购买订单
        order_state: that.data.order_state,//默认访问待付款
        offset: (that.data.offset - 1) * that.data.pageCount,
        page: that.data.pageCount
      };
      that.getOrderList(param);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  // 跳转规格弹窗
  logistics: function (e) {
    var that = this;
    var flexwindow;
    if (this.data.flexwindow == true) {
      flexwindow = false;
    }
    else {
      flexwindow = true;
    }
    that.setData({
      flexwindow: flexwindow
    });
  },
  close: function (e) {
    let self = this
    let flexwindow = false;

    self.setData({
      flexwindow: flexwindow
    })
  },

  //以下为自定义点击事件
  getOrderList: function (param) {
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


  
  // tab切换
  clickTab: function (e) {
    var that = this;
    console.log("-1", this.data.currentTab)
    console.log("-2", e.currentTarget.dataset.current)
    if (this.data.currentTab == e.currentTarget.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.currentTarget.dataset.current,
        order_state: parseInt(e.currentTarget.dataset.current)+1,
        offset:1,
        isLast:false,
        items:[]
      })
      var param = {
        page_code: 'p008',
        type: "myOrder",
        customer_id: wx.getStorageSync('customerId'),
        order_type: 1,//购买订单
        order_state: that.data.order_state,//默认访问待付款
        offset: (that.data.offset - 1) * that.data.pageCount,
        page: that.data.pageCount
      };
      that.getOrderList(param);
    }
  },
  orderdetail: function (e) {
    wx.navigateTo({
      url: 'orderdetail/orderdetail?order_id='+e.currentTarget.dataset.id,
    })
  },
})