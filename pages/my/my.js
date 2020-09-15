// pages/my/my.js
import tmpObj from '../template/template.js'
var base = require('../../utils/base.js');
var app = getApp();
var that;
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    business_id: 0,
    business_id1: 0,
    items:[],
    isLogin:false,
    ftserviceflexwindow: false,
    level:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.setLevel();
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
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 3
      })
    }
    if (wx.getStorageSync('customerId') && !wx.getStorageSync('get_user_info') && !wx.getStorageSync('get_phone_info')){
      var param = {
        page_code:'p004',
        type:"mainCustomer",
        has_order_count: true
      };
      that.getUserDetail(param);
      that.setData({
        isLogin: false
      });
    } else{
      that.setData({
        isLogin: true
      });
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
  onShareAppMessage: function (res) {
    wx.showToast({ title: res, icon: 'success', duration: 2000 });
    if (res.from === 'button') {
      // 来自页面内转发按钮
      return {
        title: '邀请好友成为会员',
        path: 'pages/my/login/login?shareBy=' + wx.getStorageSync('memberNo'), // 好友点击分享之后跳转到的小程序的页面
        // desc: '描述',  // 看你需要不需要，不需要不加
        imageUrl: app.globalData.shareImg,
        success: (res) => {
          wx.showToast({ title: res, icon: 'success', duration: 2000 })
        },
        fail: (res) => {
          wx.showToast({ title: res, icon: 'success', duration: 2000 })
        }
      }
    }
  },

  ftservice: function (e) {
    let ret = tmpObj.ftservice(e);
    that.setData({
      ftserviceflexwindow: ret
    });
  },
  ftserviceq: function (e) {
    let ret = tmpObj.ftserviceq(e);
    that.setData({
      ftserviceflexwindow: ret
    })
  },
  calling: function (e) {
    tmpObj.calling(e);
  },
  //进入登录注册页面
  goLogin:function(){
    wx.navigateTo({
      url: '/pages/my/login/login',
    })
  },
  
  //进入会员页面
  goMember: function() {
    wx.switchTab({
      url: '/pages/member/member',
    })
  },
  // 财务管理
  financial: function (e) {
    if (wx.getStorageSync('customerId') && !wx.getStorageSync('get_user_info') && !wx.getStorageSync('get_phone_info')){
      wx.navigateTo({
        url: '../my/financial_mgm/financial_mgm',
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '请完成授权后再点击查看',
        showCancel: false
      });
    }
  },
  //获取用户信息 ： 积分 卡券数量 等
  getUserDetail: function (param){
    var params = {
      url: app.globalData.domainUrl,
      data:param,
      method:'GET',
      sCallback: function (res) {
        if(res.data.code == 404){
          that.setData({
            items: [],
            isLogin:true
          });
        }else{
          that.setData({
            items: res.data.data
          });
          if(that.data.items && res.data.code == 200){
            wx.setStorageSync('level', that.data.items.frozeno_level);  //等级
            that.setLevel();
          }
        }
      }
    };
    base.httpRequest(params);
  },

  bean: function (e) {    
    if (wx.getStorageSync('customerId') && !wx.getStorageSync('get_user_info') && !wx.getStorageSync('get_phone_info')){
      wx.navigateTo({
        url: '../member/bean/bean'
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '请完成授权后再点击查看',
        showCancel: false
      });
    }
  },
  setLevel:function(){
    that.setData({
      level:wx.getStorageSync('level')
    });
  },
  
   /***
   * 点击进入各自页面
   * ***/
  order: function (e) {
    if (wx.getStorageSync('customerId') && !wx.getStorageSync('get_user_info') && !wx.getStorageSync('get_phone_info')){
      var orderId = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: '../my/order/order?id=' + orderId,
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '请完成授权后再点击查看',
        showCancel: false
      });
    }
  },
  info: function (e) {
    if (wx.getStorageSync('customerId') && !wx.getStorageSync('get_user_info') && !wx.getStorageSync('get_phone_info')){
      wx.navigateTo({
        url: '../my/invoice/invoice'
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '请完成授权后再点击查看',
        showCancel: false
      });
    }
  },
  address: function (e) {
    if (wx.getStorageSync('customerId') && !wx.getStorageSync('get_user_info') && !wx.getStorageSync('get_phone_info')){
      wx.navigateTo({
        url: '../my/address/address'
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '请完成授权后再点击查看',
        showCancel: false
      });
    }
  },
  news: function (e) {
    if (wx.getStorageSync('customerId') && !wx.getStorageSync('get_user_info') && !wx.getStorageSync('get_phone_info')){
      wx.navigateTo({
        url: '../my/news/news'
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '请完成授权后再点击查看',
        showCancel: false
      });
    }
  },
  service: function (e) {
    wx.navigateTo({
      url: '../my/service/service'
    })
  },

  setting: function (e) {
    if (wx.getStorageSync('customerId') && !wx.getStorageSync('get_user_info') && !wx.getStorageSync('get_phone_info')){
      wx.navigateTo({
        url: '../my/setting/setting'
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '请完成授权后再点击查看',
        showCancel: false
      });
    }
  },
  //前往工作台
  goWorkBench:function(){
    wx.navigateToMiniProgram({
      appId: 'wx11bfdef5fa29322d',
      path: 'pages/home/home',
      envVersion: 'release',// 打开正式版
      success(res) {
      },
      fail: function (err) {
        console.log(err);
      }
    })
  },

  //优惠券
  coupon: function (e) {
    if (wx.getStorageSync('customerId') && !wx.getStorageSync('get_user_info') && !wx.getStorageSync('get_phone_info')) {
      wx.navigateTo({
        url: '/pages/my/coupon/coupon'
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '请完成授权后再点击查看',
        showCancel: false
      });
    }
  },
})