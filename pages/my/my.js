// pages/my/my.js
var app = getApp();
// var wxbarcode = require('../../utils/index.js');
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
    // isShare:false    
    showModal: false,
    qrcode:''
    // code:''
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
  //进入登录注册页面
  goLogin:function(){
    wx.navigateTo({
      url: '/pages/my/login/login',
    })
  },
  
  //进入会员页面
  goMember: function() {
    wx.navigateTo({
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
  bindGetUserInfo: function () {
    console.log('userInfo');
    wx.getUserInfo({
      success: function (res) {
          //获取openid，并更新到用户表
          that.updateUserInfo({
            page_code: 'p010',
            type: 'wxLogin',
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
  customer: function (e) {
    wx.navigateTo({
      url: '../my/customer/customer'
    })
  },
  setting: function (e) {
    wx.navigateTo({
      url: '../my/setting/setting'
    })
  },
  shareApp:function(e) {   //邀请好友
    // that.setData({
    //   isShare:true
    // });
    if(wx.getStorageSync('level') > 1){
    wx.showActionSheet({
      itemList: ['复制邀请码', '邀请二维码'],
      success: function (res) {
        console.log('showActionSheet:------');
        console.log(res.tapIndex);
        if(res.tapIndex == 0) {
          that.copyCode();
        } else if (res.tapIndex == 1) {
          that.showShareQRCode();
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
    }else{
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
          // wx.showModal({
          //   title: '提示',
          //   content: '复制成功',
          //   showCancel: false
          // });
        }
      })
      // wx.getClipboardData({
      //   success: function (res) {
      //     wx.showToast({
      //       title: '复制成功'
      //     })
      //   }
      // })
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
        page_code:'p015',
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
          that.setData({
            qrcode: res.data.data
          });
        }
      });
    }

    // var code = wx.getStorageSync("memberNo");
    // var url_member_id = app.globalData.domainUrl + "?is_scan=1&customer_id=" + wx.getStorageSync('customerId');
    // wxbarcode.qrcode('qrcode', url_member_id, 420, 420);
    // // const codeStr = code;//`${code.slice(0, 4)}****${code.slice(12)}`;
    // that.setData({
    //   code,
    //   // codeStr
    // });

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