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
    dry_id:0,
    is_apply:false,
    time_diff:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.setData({
      dry_id:app.globalData.dry_id,
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
            is_apply:datas.is_apply,
            time_diff:datas.time_diff
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

  //申请退还押金
  apply:function(){
    wx.showModal({
      title: '提示',
      content: '我们已经收到您的申请,请尽快将货物邮递至我们,感谢您的使用.',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定.');
          that.submitApply();
          that.close3();
        } else if (res.cancel) {
          console.log('用户点击取消.');
          that.close3();
        }
      }
    })
  },
  
  //提交申请退押金信息
  submitApply: function(){
    if (wx.getStorageSync('customerId') && !wx.getStorageSync('get_user_info') && !wx.getStorageSync('get_phone_info')){
      var param = {
        page_code:'p009',
        type:"applyDeposit"
      };
      var params = {
        url: app.globalData.domainUrl,
        data:param,
        method:'POST',
        sCallback: function (res) {
          var datas = res.data;
          if (datas.code == 200){
            that.setData({
              is_apply:true
            });
          }
        }
      };
      base.httpRequest(params);
    }else{
      wx.showModal({
        title: '提示',
        content: '请完成授权后再做申请。',
        showCancel: false
      });
    }
  }

})