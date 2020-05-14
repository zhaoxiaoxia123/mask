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
    showModal: false,
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
  onShareAppMessage: function () {
    return {
      title: '邀请好友成为会员',
      path: 'pages/my/login/login?shareBy=' + wx.getStorageSync('memberNo'), // 好友点击分享之后跳转到的小程序的页面
      // desc: '描述',  // 看你需要不需要，不需要不加
      imageUrl: '分享的图片路径'
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
  shareApp: function (e) {   //邀请好友
    if (wx.getStorageSync('level') > 1) {
      wx.showActionSheet({
        itemList: ['复制邀请码', '邀请二维码'],
        success: function (res) {
          // console.log('showActionSheet:------');
          // console.log(res.tapIndex);
          if (res.tapIndex == 0) {
            that.copyCode();
          } else if (res.tapIndex == 1) {
            that.showShareQRCode();
          }
        },
        fail: function (res) {
          console.log(res.errMsg)
        }
      })
    } else {
      wx.showToast({
        icon: "info",
        title: '无法邀请好友。'
      })
    }
  }, 
  copyCode: function () {  //复制邀请码
    if (wx.getStorageSync("level") > 1) {
      wx.setClipboardData({
        data: wx.getStorageSync("memberNo"),
        success: function (res) {
          console.log('copyCode:------');
          console.log(res);
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '该用户无法分享邀请码',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },
  showShareQRCode: function () {   //邀请二维码
    var code = wx.getStorageSync("memberNo");
    if (wx.getStorageSync("customerId") && code) {
      var param = {
        page_code: 'p015',
        share_by: code,
        customer_id: wx.getStorageSync("customerId")
      };
      // var param = '/p015?share_by='+code+'&customer_id='+wx.getStorageSync("customerId");
      wx.request({
        url: "https://www.frozeno.cn/api/v1/uploadFileToAliyunOss",//app.globalData.domainUrl,
        data: param,
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          that.setData({
            qrcode: res.data.data
          });
          console.log(that.data.qrcode);
        }
      });
    }
    that.setData({
      showModal: true
    })
  },
  // 弹出层里面的弹窗
  ok: function () {
    this.setData({
      showModal: false
    })
  }

})