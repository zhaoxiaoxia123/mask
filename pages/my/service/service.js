// pages/my/service/service.js
var app = getApp();
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item: [],
    type: 17,
    domainName: app.globalData.domainName,
    ftserviceflexwindow: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.getPost();
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
  ftservice: function (e) {
    var ftserviceflexwindow = e.currentTarget.dataset.item;
    if (ftserviceflexwindow) {
      ftserviceflexwindow = false;
    } else {
      ftserviceflexwindow = true;
    }
    that.setData({
      ftserviceflexwindow: ftserviceflexwindow
    } );
  },
  ftserviceq: function (e) {
    let ftserviceflexwindow = false;
    that.setData({
      ftserviceflexwindow: ftserviceflexwindow
    });
  },
  calling: function (e) {
    wx.makePhoneCall({
      phoneNumber: '10000',
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  },
  getPost: function (param) {
    wx.request({
      url: app.globalData.domainUrl,
      data: {
        page_code: 'p001',
        type: that.data.type
      },
      header: {
        'content-type': "application/json"
      },
      success: function (res) {
        var datas = res.data;
        console.log(datas);
        console.log(datas.length);
        that.setData({
          item: datas.data
        });
      }
    })
  },
})