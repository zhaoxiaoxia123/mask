// pages/member/bean/bean.js
var that;
var app = getApp();
var base = require('../../../utils/base.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    customer:[],
    offset: 1,
    pageCount: 20,
    isLast: false,
    items:[],
    imgLoad:'',
    message:'',
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
      var param = {
        page_code: 'p004',
        type: "mainCustomer",
        is_bean_entry:1
      };
      that.getUserDetail(param);

      base.loading(1000);
      var param_p = {
        page_code: 'p004',
        type: "logList",
        event:5,
        offset: (that.data.offset - 1) * that.data.pageCount,
        page: that.data.pageCount
      };
      that.getBeanList(param_p);
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
    if (!that.data.isLast) {
      that.setData({
        offset: that.data.offset + 1
      });
      base.loading(1000);
      var param_p = {
        page_code: 'p004',
        type: "logList",
        event:5,
        offset: (that.data.offset - 1) * that.data.pageCount,
        page: that.data.pageCount
      };
      that.getBeanList(param_p);
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //进入会员体系介绍
  grade: function () {
    wx.navigateTo({
      url: '/pages/member/grade/grade',
    })
  },
  //获取用户信息
  getUserDetail: function (param) {
    var params = {
      url: app.globalData.domainUrl,
      data:param,
      method:'GET',
      sCallback: function (res) {
        that.setData({
          customer: res.data.data
        });
      }
    };
    base.httpRequest(params);

  },
  //获取智美豆列表
  getBeanList: function (param) {
    var params = {
      url: app.globalData.domainUrl,
      data:param,
      method:'GET',
      sCallback: function (res) {
        var datas = res.data.data.pointList;
        that.setData({
          items: that.data.items.concat(datas),
          message:'您还没有相关信息',
          imgLoad:'../../img/wu.png',
        });
        if (datas.length <= 0 || datas.length < that.data.pageCount) {
          that.setData({
            isLast: true
          });
        }
      }
    };
    base.httpRequest(params);
  },

})