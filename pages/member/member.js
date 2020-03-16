// pages/member/member.js
var that;
var app = getApp();
var wxbarcode = require('../../utils/index.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    items: [],
    canGetUserInfo: false,
    code:'',
      animationData: {},
      hidden: true,//关注默认显示
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.setData({
      canGetUserInfo: app.globalData.canGetUserInfo
    });
    if (wx.getStorageSync('memberNo')) {
      that.writeCode();
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
    if (wx.getStorageSync('customerId')) {
      var param = {
        page_code: 'p004',
        type: "mainCustomer",
        customer_id: wx.getStorageSync('customerId'),
        has_ticket_count: true,
        // has_order_count: true
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
  //获取用户信息 ： 积分 卡券数量 等
  getUserDetail: function (param) {
    wx.request({
      url: app.globalData.domainUrl,
      data: param,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          items: res.data.data
        });
      }
    });
  },

  bindGetUserInfo: function () {
    console.log('userInfo');
    wx.getUserInfo({
      success: function (res) {
        //获取openid，并更新到用户表
        that.updateUserInfo({
          page_code: 'p010',
          code: app.globalData.code,  //获取openid的code码
          nickname: res.userInfo.nickName,
          avatarUrl: res.userInfo.avatarUrl,
        });
      }
    });
  },
  updateUserInfo: function (param) {  //更新用户信息
    wx.request({
      url: app.globalData.domainUrl,
      method: "POST",
      data: param,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        // wx.navigateBack({
        //     delta: 1  //小程序关闭当前页面返回上一页面
        // })
        var datas = res.data.data;
        wx.setStorageSync('customerId', datas.customer_id);
        wx.setStorageSync('openid', datas.openid);
        wx.setStorageSync('memberNo', datas.number);  //会员号
        wx.setStorageSync('level', datas.level);  //等级
        wx.setStorageSync('discount', datas.discount);  //折扣
        app.globalData.canGetUserInfo = false;
        that.setData({
          canGetUserInfo: app.globalData.canGetUserInfo
        });
        that.onShow();
      }
    })
  },

  writeCode: function () {  //在页面上打印条形码和二维码
    var code = wx.getStorageSync("memberNo");
    // var url_member_id = app.globalData.domainUrl + "?is_scan=1&customer_id=" + wx.getStorageSync('customerId');
    wxbarcode.barcode('barcode', code, 680, 200);
    // wxbarcode.qrcode('qrcode', url_member_id, 420, 420);
    // const codeStr = code;//`${code.slice(0, 4)}****${code.slice(12)}`;
    that.setData({
      code,
    //   codeStr
    });
  },

/***
   * 点击进入各自页面
   * ***/
  grade: function (e) {
    console.log(e)
    wx.navigateTo({
      url: '../member/grade/grade',
    })
  },
  grow: function (e) {
    console.log(e)
    wx.navigateTo({
      url: '../member/grow/grow',
    })
  },
  integral: function (e) {
    console.log(e)
    wx.navigateTo({
      url: '../member/integral/integral',
    })
  },
  chanMask: function () {
    var isShow = that.data.show ? false : true;//如果显示就隐藏，隐藏就显示
    that.setData({
      show: isShow
    })
    console.log(that.data.show);
    // setTimeout(function () {
    //   if (that.data.show){
    //     that.setData({
    //       hidden: !that.data.hidden
    //     })
    //   }
    // }.bind(that), 1000)

  },


})
