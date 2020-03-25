// pages/my/login/login.js
var that;
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:'',
    code:'',
    verifyCode:'',
    showModal: false,
    isSubmit:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    that = this;
    if (wx.getStorageSync("openid") != '') {
      wx.switchTab({
        url: '/pages/home/home',
      });
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

  bindGetUserInfo: function () {
    if (app.globalData.code) {
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
            customer_id: wx.getStorageSync('customerId') ? wx.getStorageSync('customerId') : 0,
          });
        }
      });
    } else {
      wx.showToast({
        icon: "none",
        title: "请清除缓存重新登录"
      });
    }
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
        var ret = res.data;
        var datas = ret.data;
        if (ret.code != 200) {
          wx.showToast({
            icon: "none",
            title: ret.message
          });
        } else {
          wx.setStorageSync('customerId', datas.customer_id);
          wx.setStorageSync('openid', datas.openid);
          wx.setStorageSync('sessionKey', datas.session_id);
          wx.setStorageSync('memberNo', datas.number);  //会员号
          wx.setStorageSync('level', datas.level);  //等级
          wx.setStorageSync('discount', datas.discount);  //折扣
          app.globalData.canGetUserInfo = false;
          // that.setData({
          //   canGetUserInfo: app.globalData.canGetUserInfo
          // });
          // if (datas.phone == null || datas.phone.length == 0) {
          //   wx.showToast({
          //     icon: "none",
          //     title: '请继续点击手机号授权',
          //   })
          // } else {
            wx.switchTab({
              url: '/pages/home/home',
            });
          // }
        }
      }
    })
  },
  getPhoneNumber: function (e) {
    // if (wx.getStorageSync('openid') == '') {
    //   wx.showToast({
    //     icon: "none",
    //     title: '请先点击获取用户信息',
    //   })
    //   return
    // } else {
      wx.checkSession({
        success: function (res) {
          var ency = e.detail.encryptedData;
          var iv = e.detail.iv;
          if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
            wx.showModal({
              title: '警告',
              content: '您点击了拒绝授权，部分功能无法使用!!!',
              showCancel: false,
              confirmText: '确定',
              success: function (res) {
                // 用户没有授权成功，不需要改变 isHide 的值
                // if (res.confirm) {
                //   wx.setStorageSync('enws', '1');
                //   wx.switchTab({
                //     url: "/wurui_house/pages/index/index"
                //   })
                //   console.log('用户点击了“返回授权”');
                // };
                wx.switchTab({
                  url: '/pages/home/home',
                });
              }
            })
          } else {

            //同意授权
            var customerId = wx.getStorageSync('customerId');
            wx.request({
              url: app.globalData.domainUrl,
              method: "POST",
              data: {
                page_code: 'p010',
                type: 'wxPhone',  //获取手机号
                sessionid: wx.getStorageSync('sessionKey'),
                customer_id: customerId,
                iv: iv,
                encryptedData: ency
              },
              header: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              success: function (res) {
                console.log(res);
                if (res.data.code != 200) {
                  wx.showToast({
                    icon: "none",
                    title: res.data.message,
                  })
                } else {
                  wx.switchTab({
                    url: '/pages/home/home',
                  });
                }
                if (res.data.data.error == 0) {
                  console.log('success' + res.data.data);
                  //用户已经进入新的版本，可以更新本地数据
                  wx.setStorageSync('versions', '1');
                  wx.setStorageSync('enws', '2');
                } else {
                  //用户保存手机号失败，下次进入继续授权手机号
                  wx.setStorageSync('enws', '1');
                  console.log('fail' + res.data.data);
                }
              },
              fail: function (res) {
                console.log('fail' + res);
              }
            });
          }
        }
      });

    // }
  },
  //手机验证码登录/注册
  showModalView: function () {
    that.setData({
      showModal: true
    });
  },

  setCodeInput: function (e) {
    var value = e.detail.value;
    that.setData({
      code: e.detail.value
    })
    that.setbuttonStatus();
  },
  setPhoneInput: function (e) {
    var value = e.detail.value;
    that.setData({
      phone: e.detail.value
    })
    that.setbuttonStatus();
  },
  //返回按钮状态来 是否可以找回密码
  setbuttonStatus: function () {
    console.log('setbuttonStatus:----');
    if (that.data.phone.length == 11 && that.data.verifyCode.length > 1 && that.data.code == that.data.verifyCode) {
      that.setData({
        isSubmit: true
      })
    } else {
      that.setData({
        isSubmit: false
      })
    }
  },
  sendCode: function () {  //发送手机验证码
    var phoneNum = that.data.phone;
    let str = /^1\d{10}$/
    if (str.test(phoneNum)) {
      wx.request({
        url: app.globalData.domainUrl,
        method: "POST",
        data: {
          page_code: 'p010',
          type: "sendCode",
          phone: phoneNum
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          var ret = res.data;
          var datas = ret.data;
          console.log(datas);
          wx.showToast({
            icon: "none",
            title: ret.message,
          })
          that.setData({
            verifyCode: datas.verify_code
          });
        }
      })
    } else {
      wx.showToast({
        icon: "none",
        title: '手机号不正确',
      })
    }
  },

  loginTo: function () {
    if (that.data.phone == '' || that.data.code == '') {
      wx.showToast({
        icon: "none",
        title: '请确保信息填写完成',
      })
    } else {
      var param = {
        page_code: "p010",
        type: 'loginByPhone',
        phone: that.data.phone
      };
      wx.request({
        url: app.globalData.domainUrl,
        method: "POST",
        data: param,
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          var info = res.data;
          var datas = info.data;
          wx.showModal({
            title: '提示',
            content: info.message,
            showCancel: false,
            success: function (res) {
              wx.setStorageSync('customerId', datas.customer_id);
              wx.setStorageSync('memberNo', datas.number);  //会员号
              wx.setStorageSync('level', datas.level);  //等级
              wx.setStorageSync('discount', datas.discount);  //折扣
              wx.switchTab({
                url: '/pages/home/home',
              });
            }
          });
        }
      });
    }
  }, 
  
  closeModal: function () {
    that.setData({
      showModal: false
    });
    
  },

  goPage:function(e){
    var type = e.currentTarget.dataset.type;
    console.log(type);
    if (type == 'agree'){
      wx.navigateTo({
        url: '/pages/my/agree/agree',
      })
    } else {
      wx.navigateTo({
        url: '/pages/my/privacy/privacy',
      })
      
    }
  }
})