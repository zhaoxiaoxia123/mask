// pages/my/my.js
import tmpObj from '../template/template.js'
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
    canGetUserInfo: false,
    // showModal: false,
    qrcode: '',
    // pageData: {
    //   ftserviceflexwindow: false,
    //   imgService: "option"
    // }
    ftserviceflexwindow: false,
    // imgService: '../img/service@2x.png',
    domainName: app.globalData.domainName,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.setData({
      canGetUserInfo:app.globalData.canGetUserInfo
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
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 3
      })
    }
    if (wx.getStorageSync('customerId')){
      var param = {
        page_code:'p004',
        type:"mainCustomer",
        customer_id:wx.getStorageSync('customerId'),
        // has_ticket_count: true,
        has_order_count: true
      };
      // var param = '/p004?type=mainCustomer&has_ticket_count=true&has_order_count=true&customer_id='+wx.getStorageSync('customerId');
      that.getUserDetail(param);
      app.globalData.canGetUserInfo = false;
      that.setData({
        canGetUserInfo: app.globalData.canGetUserInfo,
        isLogin: false
      });
    }else{
      that.setData({
        isLogin: true
      });
    }

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
  //获取用户信息 ： 积分 卡券数量 等
  getUserDetail: function (param){
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
  
   /***
   * 点击进入各自页面
   * ***/
  order: function (e) {
    console.log(e)
    if (wx.getStorageSync('customerId')){
      var orderId = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: '../my/order/order?id=' + orderId,
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '请授权登录后再查看订单列表',
        showCancel: false
      });
    }
  },
  info: function (e) {
    wx.navigateTo({
      url: '../my/invoice/invoice'
    })
  },
  address: function (e) {
    wx.navigateTo({
      url: '../my/address/address'
    })
  },
  news: function (e) {
    wx.navigateTo({
      url: '../my/news/news'
    })
  },
  coupon: function (e) {
    wx.navigateTo({
      url: '../my/coupon/coupon'
    })
  },
  service: function (e) {
    wx.navigateTo({
      url: '../my/service/service'
    })
  },
  // customer: function (e) {
    // wx.navigateTo({
    //   url: '../my/customer/customer'
    // })
  // },
  setting: function (e) {
    wx.navigateTo({
      url: '../my/setting/setting'
    })
  },
  // shareApp:function(e) {   //邀请好友
  //   if(wx.getStorageSync('level') > 1){
  //   wx.showActionSheet({
  //     itemList: ['复制邀请码', '邀请二维码'],
  //     success: function (res) {
  //       // console.log('showActionSheet:------');
  //       // console.log(res.tapIndex);
  //       if(res.tapIndex == 0) {
  //         that.copyCode();
  //       } else if (res.tapIndex == 1) {
  //         that.showShareQRCode();
  //       }
  //     },
  //     fail: function (res) {
  //       console.log(res.errMsg)
  //     }
  //   })
  //   }else{
  //     wx.showToast({
  //       icon: "info",
  //       title: '无法邀请好友。'
  //     })
  //   }
  // },
  // copyCode: function () {  //复制邀请码
  //   if (wx.getStorageSync("level") > 1) {
  //     wx.setClipboardData({
  //       data: wx.getStorageSync("memberNo"),
  //       success: function (res) {
  //         console.log('copyCode:------');
  //         console.log(res);
  //       }
  //     })
  //   } else {
  //     wx.showModal({
  //       title: '提示',
  //       content: '该用户无法分享邀请码',
  //       success: function (res) {
  //         if (res.confirm) {
  //           console.log('用户点击确定')
  //         } else if (res.cancel) {
  //           console.log('用户点击取消')
  //         }
  //       }
  //     })
  //   }
  // },
  // showShareQRCode: function () {   //邀请二维码
  //   var code = wx.getStorageSync("memberNo");
  //   if (wx.getStorageSync("customerId") && code) {
  //     var param = {
  //       page_code:'p015',
  //       share_by: code,
  //       customer_id: wx.getStorageSync("customerId")
  //     };
  //     // var param = '/p015?share_by='+code+'&customer_id='+wx.getStorageSync("customerId");
  //     wx.request({
  //       url: app.globalData.domainUrl,
  //       data: param,
  //       header: {
  //         'content-type': 'application/json'
  //       },
  //       success: function (res) {
  //         that.setData({
  //           qrcode: res.data.data
  //         });
  //         console.log(that.data.qrcode);
  //       }
  //     });
  //   }
  //   that.setData({
  //     showModal: true
  //   })
  // },
  // // 弹出层里面的弹窗
  // ok: function () {
  //   this.setData({
  //     showModal: false
  //   })
  // }
})