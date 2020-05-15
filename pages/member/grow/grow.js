// pages/member/grow/grow.js
var that;
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    customer:[],
    offset: 1,
    pageCount: 20,
    isLast: false,
    // showModal: false,
    qrcode: '',
    items: [],
    domainName: app.globalData.domainName,
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
    if (wx.getStorageSync('customerId')) {
      var param = {
        page_code: 'p004',
        type: "mainCustomer",
        customer_id: wx.getStorageSync('customerId'),
        has_level:true
      };
      // var param = '/p004?type=mainCustomer&customer_id='+wx.getStorageSync('customerId');
      that.getUserDetail(param);

      var paramg = {
        page_code: 'p004',
        type: "logList",  //growthList
        event:2,
        customer_id: wx.getStorageSync('customerId'),
        offset: (that.data.offset - 1) * that.data.pageCount,
        page: that.data.pageCount
      };
      // var paramg = '/p004?type=growthList&customer_id='+wx.getStorageSync('customerId')+'&offset='+((that.data.offset - 1) * that.data.pageCount)+'&page='+that.data.pageCount;
      that.getGrowthList(paramg);
      
      var code = wx.getStorageSync("memberNo");
      if (code) {
        var param = {
          page_code: 'p015',
          share_by: code,
          customer_id: wx.getStorageSync("customerId")
        };
        // var param = '/p015?share_by='+code+'&customer_id='+wx.getStorageSync("customerId");
        wx.request({
          url: app.globalData.domainUrl,
          data: param,
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            let qr = res.data.data;
            if (qr.indexOf("http") >= 0) {
              that.setData({
                qrcode: res.data.data
              });
            } else {
              that.setData({
                qrcode: that.data.domainName + res.data.data
              });
            }
            console.log(that.data.qrcode);
          }
        });
    }
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
      //列表
      var param_p = {
        page_code: 'p004',
        type: "logList",//"growthList",
          event:2,
        customer_id: wx.getStorageSync('customerId'),
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
        imageUrl: that.data.qrcode,
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
    wx.request({
      url: app.globalData.domainUrl,
      data: param,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          customer: res.data.data
        });
      }
    });
  },

  //获取用户信息 ： 成长值列表
  getGrowthList: function (param) {
    wx.request({
      url: app.globalData.domainUrl,
      data: param,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var datas = res.data.data;
        that.setData({
          items: that.data.items.concat(datas)
        });
        if (datas.length <= 0 || datas.length < that.data.pageCount) {
          that.setData({
            isLast: true
          });
        }
      }
    });
  },

})