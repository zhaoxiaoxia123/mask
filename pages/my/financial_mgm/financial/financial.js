// pages/home/financial_mgm/financial/financial.js
var that;
var app = getApp();
var base = require('../../../../utils/base.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logId:0,
    financeDetail:[]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.setData({
      logId:options.id
    });

    if (wx.getStorageSync('customerId') && !wx.getStorageSync('get_user_info') && !wx.getStorageSync('get_phone_info')) {
      base.loading(2000);
      var param = {
        page_code: 'p007',
        type: "detail",
        log_id:that.data.logId
      };
      that.getFinanceDetail(param);
    }
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
  
   //获取余额明细详细信息
   getFinanceDetail: function(param) {
    var params = {
      url: app.globalData.domainUrl,
      data:param,
      method:'GET',
      sCallback: function (res) {
        let datas = res.data.data;
        wx.hideToast();
        that.setData({
          financeDetail: datas
        });
      }
    };
    base.httpRequest(params);
  },

})