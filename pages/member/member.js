// pages/member/member.js
var that;
var app = getApp();
var wxbarcode = require('../../utils/index.js');
var base = require('../../utils/base.js');
import tmpObj from '../template/template.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    items: [],
    isLogin:false,
    // canGetUserInfo: false,
    code:'',
    animationData: {},
    hidden: true,//关注默认显示
    ftserviceflexwindow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    // that.setData({
    //   canGetUserInfo: app.globalData.canGetUserInfo
    // });
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
        selected: 1
      })
    }
    that.setData({
      items:[]
    });
    if (wx.getStorageSync('customerId') && !wx.getStorageSync('get_user_info') && !wx.getStorageSync('get_phone_info')){
      var param = {
        page_code: 'p004',
        type: "mainCustomer",
        // customer_id: wx.getStorageSync('customerId'),
        has_ticket_count: true,
      };
      that.getUserDetail(param);

      that.setData({
        isLogin: false
      });
    } else {
      that.setData({
        isLogin: true
      });
    }
    if (wx.getStorageSync('memberNo')) {
      that.writeCode();
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
  goLogin: function () {
    wx.navigateTo({
      url: '/pages/my/login/login',
    })
  },
  //获取用户信息 ： 积分 卡券数量 等
  getUserDetail: function (param) {
    var params = {
      url: app.globalData.domainUrl,
      data:param,
      method:'get',
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
          }
        }
      }
    };
    base.httpRequest(params);
  },

  writeCode: function () {  //在页面上打印条形码和二维码
    var code = wx.getStorageSync("memberNo");
    // var url_member_id = app.globalData.domainUrl + "?is_scan=1&customer_id=" + wx.getStorageSync('customerId');
    wxbarcode.barcode('barcode', code, 680, 200);
    // wxbarcode.qrcode('qrcode', url_member_id, 420, 420);
    // const codeStr = code;//`${code.slice(0, 4)}****${code.slice(12)}`;
    that.setData({
      code
    //   codeStr
    });
  },

  //优惠券
  coupon: function (e) {
    if (wx.getStorageSync('customerId') && !wx.getStorageSync('get_user_info') && !wx.getStorageSync('get_phone_info')){
      wx.navigateTo({
        url: '/pages/my/coupon/coupon'
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '请完成授权后再点击查看',
        showCancel: false
      });
    }
  },

  grade: function (e) {
    wx.navigateTo({
      url: '../member/grade/grade'
    })
  },
    // 成长值
  grow: function (e) {
    if (wx.getStorageSync('customerId') && !wx.getStorageSync('get_user_info') && !wx.getStorageSync('get_phone_info')){
      wx.navigateTo({
        url: '../member/grow/grow'
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '请完成授权后再点击查看',
        showCancel: false
      });
    }
  },
  integral: function (e) {
    wx.navigateTo({
      url: '../member/integral/integral'
    })
  },
  //智美豆
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
  chanMask: function () {
    var isShow = that.data.show ? false : true;//如果显示就隐藏，隐藏就显示
    that.setData({
      show: isShow
    });
  },
})
