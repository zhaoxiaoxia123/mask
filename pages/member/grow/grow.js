// pages/member/grow/grow.js
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
    items: [],
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
    that.setData({
      items: [],
      isLast: false
    });
    if (wx.getStorageSync('customerId') && !wx.getStorageSync('get_user_info') && !wx.getStorageSync('get_phone_info')) {
      var param = {
        page_code: 'p004',
        type: "mainCustomer",
        // customer_id: wx.getStorageSync('customerId'),
        has_level:true
      };
      that.getUserDetail(param);

      base.loading(800);
      var paramg = {
        page_code: 'p004',
        type: "logList",  //growthList
        event:2,
        // customer_id: wx.getStorageSync('customerId'),
        offset: (that.data.offset - 1) * that.data.pageCount,
        page: that.data.pageCount
      };
      that.getGrowthList(paramg);
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
      base.loading(800);
      //列表
      var param_p = {
        page_code: 'p004',
        type: "logList",//"growthList",
        event:2,
        // customer_id: wx.getStorageSync('customerId'),
        offset: (that.data.offset - 1) * that.data.pageCount,
        page: that.data.pageCount
      };
      // var param_p = '/p004?type=growthList&customer_id='+wx.getStorageSync('customerId')+'&offset='+((that.data.offset - 1) * that.data.pageCount)+'&page='+that.data.pageCount;
      that.getGrowthList(param_p);
    }

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
  //进入会员体系介绍
  grade: function () {
    wx.navigateTo({
      url: '/pages/member/grade/grade',
    })
  },
  //进入首页
  gohome: function () {
    wx.switchTab({
      url: '/pages/home/home',
    })
  },
  //获取用户信息 ： 积分 卡券数量 等
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

  //获取用户信息 ： 成长值列表
  getGrowthList: function (param) {    
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