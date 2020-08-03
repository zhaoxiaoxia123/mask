// pages/my/deposit/deposit.js
var that;
var base = require('../../../utils/base.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    customerInfo:[],
    orderList:[],
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

    if (wx.getStorageSync('customerId') && !wx.getStorageSync('get_user_info') && !wx.getStorageSync('get_phone_info')){
      var param = {
        page_code:'p004',
        type:"mainCustomer",
        has_deposit:true
      };
      that.getUserDetail(param);

      var param = {
        page_code: 'p008',
        type: "logOrder"
      };
      that.getOrderList(param);
        
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
  //获取用户信息 ： 积分 卡券数量 等
  getUserDetail: function (param){
    var params = {
      url: app.globalData.domainUrl,
      data:param,
      method:'GET',
      sCallback: function (res) {
        that.setData({
          customerInfo: res.data.data
        });
      }
    };
    base.httpRequest(params);
  },
  
  //以下为自定义点击事件
  getOrderList: function (param) {
    var params = {
      url: app.globalData.domainUrl,
      data:param,
      method:'GET',
      sCallback: function (res) {
        var datas = res.data.data;
        if (datas){
          that.setData({
            orderList: datas,
          });
        }
      }
    };
    base.httpRequest(params);
  },
  // 申请退押金
  deposit: function (e) {
    var depositflexwindow;
    if (that.data.depositflexwindow == true) {
      depositflexwindow = false;
    }
    else {
      depositflexwindow = true;
    }
    that.setData({
      depositflexwindow: depositflexwindow
    });
  },
  close3: function () {
    let depositflexwindow = false;
    that.setData({
      depositflexwindow: depositflexwindow
    })
  },

})