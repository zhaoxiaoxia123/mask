// pages/member/integral/integral.js
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
    pageCount: 8,
    isLast: false,
    items:[]
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
        // customer_id: wx.getStorageSync('customerId'),
      };
      // var param = '/p004?type=mainCustomer&customer_id='+wx.getStorageSync('customerId');
      that.getUserDetail(param);

      var param_p = {
        page_code: 'p004',
        type: "logList",//"pointList",
        event:1,
        // customer_id: wx.getStorageSync('customerId'),
        offset: (that.data.offset - 1) * that.data.pageCount,
        page: that.data.pageCount
      };
      // var param_p = '/p004?type=pointList&customer_id='+wx.getStorageSync('customerId')+'&offset='+((that.data.offset - 1) * that.data.pageCount)+'&page='+that.data.pageCount;
      that.getPointList(param_p);
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
      //商品列表
      var param_p = {
        page_code: 'p004',
        type: "logList",//"pointList",
        event:1,
        // customer_id: wx.getStorageSync('customerId'),
        offset: (that.data.offset - 1) * that.data.pageCount,
        page: that.data.pageCount
      };
      // var param_p = '/p004?type=pointList&customer_id='+wx.getStorageSync('customerId')+'&offset='+((that.data.offset - 1) * that.data.pageCount)+'&page='+that.data.pageCount;
      that.getPointList(param_p);
    }

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //获取用户信息 ： 积分 卡券数量 等
  getUserDetail: function (param) {
    // wx.request({
    //   url: app.globalData.domainUrl,
    //   data: param,
    //   header: {
    //     'content-type': 'application/json'
    //   },
    //   success: function (res) {
    //     that.setData({
    //       customer: res.data.data
    //     });
    //   }
    // });

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
  //获取用户信息 ： 积分列表
  getPointList: function (param) {
    // wx.request({
    //   url: app.globalData.domainUrl,
    //   data: param,
    //   header: {
    //     'content-type': 'application/json'
    //   },
    //   success: function (res) {
    //     var datas = res.data.data;
    //     that.setData({
    //       items: that.data.items.concat(datas)
    //     });
    //     if (datas.length <= 0 || datas.length < that.data.pageCount) {
    //       that.setData({
    //         isLast: true
    //       });
    //     }
    //   }
    // });
    
    var params = {
      url: app.globalData.domainUrl,
      data:param,
      method:'GET',
      sCallback: function (res) {
        var datas = res.data.data.pointList;
        that.setData({
          items: that.data.items.concat(datas)
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