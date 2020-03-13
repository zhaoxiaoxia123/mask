// pages/home/home.js
var that;
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code: '',
    phone: '',
    password: '',
    shareBy: '',
    canGetUserInfo: false,
    showModal: false,
    showModalPhone: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  bindNumber: function() {
    that.setData({
      showModal: true
    });
  },
  bindGetUserInfo: function() {
    console.log('userInfo');
    if (that.data.shareBy == '' && that.data.showModal == true) {
      wx.showToast({
        title: '未输入优惠码。',
      })
    } else if (that.data.shareBy != '' && that.data.showModal == true) { //绑定验证码登录
      wx.getUserInfo({
        success: function(res) {
          //绑定优惠码
          that.updateUserInfo({
            page_code: 'p010',
            type: "bindCode",
            code: app.globalData.code, //获取openid的code码
            nickname: res.userInfo.nickName,
            avatar: res.userInfo.avatarUrl,
            share_by: that.data.shareBy
          });
        },
        fail: function(e) {
          wx.showToast({
            title: '获取用户信息失败',
          })
        }
      });
    } else if (that.data.shareBy == '' && that.data.showModal == false) { //直接登录
      wx.getUserInfo({
        success: function(res) {
          //直接获取用户微信信息登录
          that.updateUserInfo({
            page_code: 'p010',
            type: "login",
            code: app.globalData.code, //获取openid的code码
            nickname: res.userInfo.nickName,
            avatarUrl: res.userInfo.avatarUrl
          });
        },
        fail: function(e) {
          wx.showToast({
            title: '获取用户信息失败',
          })
        }
      });
    }
  },
  updateUserInfo: function(param) { //更新用户信息
    wx.request({
      url: app.globalData.domainUrl,
      method: "POST",
      data: param,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function(res) {
        // wx.navigateBack({
        //     delta: 1  //小程序关闭当前页面返回上一页面
        // })
        var datas = res.data.data;
        console.log(datas);
        wx.setStorageSync('customerId', datas.customer_id);
        wx.setStorageSync('openid', datas.openid);
        wx.setStorageSync('memberNo', datas.number); //会员号
        wx.setStorageSync('level', datas.level); //等级
        wx.setStorageSync('discount', datas.discount); //折扣
        app.globalData.canGetUserInfo = false;
        that.setData({
          canGetUserInfo: app.globalData.canGetUserInfo,
          showModalPhone: datas.phone == "" ? true : false
        });
        console.log(datas.can_share_by);
        console.log(datas.can_share_by == true);
        if (datas.can_share_by == true) {
          // wx.showToast({
          //   title: '您已有优惠码',
          // })
          wx.showModal({
            title: '提示',
            content: "您已有优惠码",
            showCancel: false,
            success: function(res1) {
              wx.switchTab({
                url: '../home/home',
              });
            }
          })
        } else if (datas.phone != "" && !datas.can_share_by) {
          wx.switchTab({
            url: '../home/home',
          });
        }
      }
    })
  },
  // 弹出层里面的弹窗
  register: function() {
    var param = {
      page_code: "p010",
      type: "bindShareBy",
      share_by: wx.getStorageSync('shareBy')
    };
    wx.request({
      url: app.globalData.domainUrl,
      method: "POST",
      data: param,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function(res) {
        var datas = res.data;
        if (datas.data == false) {
          wx.showToast({
            title: datas.message,
          })
        } else {
          this.setData({
            showModal: false
          });
        }
      }
    });
  },

  setShareByInput: function(e) {
    var value = e.detail.value;
    that.setData({
      shareBy: e.detail.value
    })
  },

  // 绑定优惠码后，返回手机号为空，绑定手机号
  bindPhone: function() {
    var param = {
      page_code: "p010",
      type: "bindPhone",
      customer_id: wx.getStorageSync('customerId'),
      phone: that.data.phone,
      password: that.password,
    };
    wx.request({
      url: app.globalData.domainUrl,
      method: "POST",
      data: param,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function(res) {
        var datas = res.data;

        if (datas.data == false) {
          wx.showToast({
            title: datas.message,
          })
        } else {
          this.setData({
            showModalPhone: false
          });
          wx.switchTab({
            url: '../home/home',
          });
        }
      }
    });
  },

  setCodeInput: function(e) {
    var value = e.detail.value;
    that.setData({
      code: e.detail.value
    })
  },
  setPhoneInput: function(e) {
    var value = e.detail.value;
    that.setData({
      phone: e.detail.value
    })
  },
  setPasswordInput: function(e) {
    var value = e.detail.value;
    that.setData({
      password: e.detail.value
    })
  },
  sendCode: function() { //发送手机验证码
    var phoneNum = that.data.phone;
    let str = /^1\d{10}$/
    if (str.test(phoneNum)) {
      wx.request({
        url: app.globalData.domainUrl,
        data: {
          page_code: 'p010',
          phopne: phoneNum
        },
        header: {
          'content-type': "application/json"
        },
        success: function(res) {
          var datas = res.data.data;
          console.log(datas);
          that.setData({
            verifyCode: datas.verify_code
          });
        }
      })
    } else {
      wx.showToast({
        title: '手机号不正确',
      })
    }

  },

})