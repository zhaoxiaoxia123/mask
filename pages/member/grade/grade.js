// pages/member/grade/grade.js
var app = getApp();
var that;
var base = require('../../../utils/base.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items:[],
    type: 16
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    base.loading(1000);
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
  /***
   * 点击进入各自页面
   * ***/
  agreementone: function (e) {
    wx.navigateTo({
      url: '../../post/post?type=11',
    })
  },
  
  getPost: function () {
    let param =  {
      page_code: 'p001',
      type: that.data.type
    };
    var params = {
      url: app.globalData.domainUrl,
      data:param,
      sCallback: function (res) {
        var datas = res.data;
        console.log(datas);
        that.setData({
          items: datas.data
        });
      }
    };
    base.httpRequest(params);
  },
})