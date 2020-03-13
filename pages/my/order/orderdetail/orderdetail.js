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
    items: [],
    address:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.setData({
      order_id: options.order_id
    });
    //获取订单详情
    var param = {
      page_code: 'p008',
      order_id: that.data.order_id
    };
    that.getOrder(param);

    that.getAddress();
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

  getOrder: function (param) {  //读取订单
    wx.request({
      url: app.globalData.domainUrl,
      data: param,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var datas = res.data.data;
        that.setData({
          items: datas[0]
        })
      }
    });
  },

getAddress: function(){
  wx.request({
    url: app.globalData.domainUrl,
    data: {
      page_code: 'p002',
      customer_id: wx.getStorageSync('customerId')
    },
    header: {
      'content-type': "application/json"
    },
    success: function (res) {
      console.log(res);
      var datas = res.data.data;
      if (datas.length > 0){
        that.setData({
          address: datas[0]
        });
      }
    }
  })
},
//删除订单
  deleteOrder: function(){
    wx.request({
      url: app.globalData.domainUrl,
      method: "POST",
      data: {
        page_code: 'p008',
        type: 'delete',
        order_id: that.data.items.order_id
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res);
        var datas = res.data.data;
        if (datas) {
          console.log('删除成功。');
          // that.setData({
          //   shopping_count: parseInt(that.data.shopping_count) + 1
          // });
          wx.navigateBack({
            delta: 1
          })
        }
      }
    })
  },
  payOrder:function(){
    wx.request({
      url: app.globalData.domainUrl,
      method: "POST",
      data: {
        page_code: 'p008',
        type: 'delete',
        order_id: that.data.items.order_id
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res);
        var datas = res.data.data;
        if (datas) {
          console.log('付款成功。');
          // that.setData({
          //   shopping_count: parseInt(that.data.shopping_count) + 1
          // });
          wx.navigateBack({
            delta: 1
          })
        }
      }
    })
  }
 
  
})