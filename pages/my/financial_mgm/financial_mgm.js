// pages/home/financial_mgm/financial_mgm.js
var that;
var app = getApp();
var base = require('../../../utils/base.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    customerInfo: [], //用户信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
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
    if (wx.getStorageSync('customerId') && !wx.getStorageSync('get_user_info') && !wx.getStorageSync('get_phone_info')) {
      base.loading(2000);
      var param = {
        page_code: 'p004',
        type: "mainCustomer"
      };
      that.getUserDetail(param);
    }
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
   //获取用户信息
   getUserDetail: function(param) {
    var params = {
      url: app.globalData.domainUrl,
      data:param,
      method:'GET',
      sCallback: function (res) {
        let datas = res.data.data;
        wx.hideToast();
        that.setData({
          customerInfo: datas
        });
      }
    };
    base.httpRequest(params);
  },
  // 余额明细
  balance: function (e) {
    wx.navigateTo({
      url: '../../my/financial_mgm/balance/balance',
    })
  },
})