// pages/home/home.js
var that;
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal: false,
    code: '',
    phone: '',
    pw1:'',
    pw2:'',
    account:'',
    password: '',
    customer_id: 0,
    verifyCode:'',
    isLogin:true,
    isInput:false,
    isCheck:false,
    isSubmit:false,   //是否可以找回密码
    isBindWechat:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that= this;
    if(wx.getStorageSync("openid") != ''){
      wx.switchTab({
        url: '../home/home',
      });
    }else{
      that.setData({
        isBindWechat: true
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  bindWechat:function(){
    that.setData({
      isBindWechat: true
    });
  },

  bindGetUserInfo: function () {
    if (app.globalData.code){
    console.log('userInfo');
    wx.getUserInfo({
      success: function (res) {
        //获取openid，并更新到用户表
        that.updateUserInfo({
          page_code: 'p010',
          type:'wxLogin',
          code: app.globalData.code,  //获取openid的code码
          nickname: res.userInfo.nickName,
          avatarUrl: res.userInfo.avatarUrl,
          customer_id: wx.getStorageSync('customerId') ? wx.getStorageSync('customerId'):0,
        });
      }
    });
    }else{
      wx.showToast({
        icon: "none",
        title: "请清楚缓存重新登录"
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
        if(ret.code != 200){
          wx.showToast({
            icon: "none",
            title: ret.message
          });
        }else{

          wx.setStorageSync('customerId', datas.customer_id);
          wx.setStorageSync('openid', datas.openid);
          wx.setStorageSync('sessionKey', datas.session_id);
          wx.setStorageSync('memberNo', datas.number);  //会员号
          wx.setStorageSync('level', datas.level);  //等级
          wx.setStorageSync('discount', datas.discount);  //折扣
          app.globalData.canGetUserInfo = false;
          that.setData({
            canGetUserInfo: app.globalData.canGetUserInfo
          });
          if (datas.phone == null || datas.phone.length == 0){
            wx.showToast({
              icon: "none",
              title: '请继续点击手机号授权',
            })
          }else{
            wx.switchTab({
              url: '../home/home',
            });
          }
        }
      }
    })
  },
  getPhoneNumber: function (e) {
    if (wx.getStorageSync('openid') == ''){
      wx.showToast({
        icon: "none",
        title: '请先点击获取用户信息',
      })
      return
    } else {
      wx.checkSession({
        success: function (res) {
      console.log(e);
      console.log(e.detail.errMsg)
      console.log(e.detail.iv)
      console.log(e.detail.encryptedData)

          var ency = e.detail.encryptedData;
          var iv = e.detail.iv;
      if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
        wx.showModal({
          title: '警告',
          content: '您点击了拒绝授权，部分功能无法使用!!!',
          showCancel: false,
          confirmText: '返回授权',
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
              url: '../home/home',
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
            if(res.data.code != 200){
              wx.showToast({
                icon: "none",
                title: res.data.message,
              })
            }else{
              wx.switchTab({
                url: '../home/home',
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
    }
  },

  setAccountInput: function (e) {
    var value = e.detail.value;
    that.setData({
      account: e.detail.value
    })
    that.setInputStatus();
  },
  setPasswordInput: function (e) {
    var value = e.detail.value;
    that.setData({
      password: e.detail.value
    })
    that.setInputStatus();
  },
  checkBox: function () {
    that.setData({
      isCheck: !that.data.isCheck
    })
    that.setInputStatus();
    console.log(that.data.isCheck);
  },
  setInputStatus: function () {
    if (that.data.account.length == 11 && that.data.password.length > 1 && that.data.isCheck) {
      that.setData({
        isInput: true
      })
    } else {
      that.setData({
        isInput: false
      })
    }
  },
  loginTo:function(){
    if (that.data.account == '' || that.data.password == '') {
      wx.showToast({
        icon: "none",
        title: '请确保信息填写完成',
      })
    }else{
      var param = {
        page_code: "p010",
        type: 'loginTo',
        account: that.data.account,
        password: that.data.password
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
          if (info.code != 200) {
            wx.showToast({
              icon: "none",
              title: info.message
            });

          } else {
            that.setData({
              customer_id: datas.customer_id
            });

            wx.setStorageSync('customerId', datas.customer_id);
            wx.setStorageSync('memberNo', datas.number);  //会员号
            wx.setStorageSync('level', datas.level);  //等级
            wx.setStorageSync('discount', datas.discount);  //折扣
            if (!datas.openid) {
              that.setData({
                isBindWechat: true
              });
            } else {
              wx.setStorageSync('openid', datas.openid);
              app.globalData.canGetUserInfo = false;
              that.setData({
                canGetUserInfo: app.globalData.canGetUserInfo
              });
              wx.switchTab({
                url: '../home/home',
              });
            }
          }
        }
      });
    } 
  },
  
  showFindPassword: function() {
    that.setData({
      showModal: true
    });
    console.log(that.data.showModal);
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
  setPw1Input: function (e) {
    var value = e.detail.value;
    that.setData({
      pw1: e.detail.value
    })
    that.setbuttonStatus();
  },
  setPw2Input: function (e) {
    var value = e.detail.value;
    that.setData({
      pw2: e.detail.value
    })
    that.setbuttonStatus();
  },
  //返回按钮状态来 是否可以找回密码
  setbuttonStatus: function () {
    console.log('setbuttonStatus:----');
    if (that.data.phone.length == 11 && that.data.verifyCode.length > 1 && that.data.pw1.length > 1 && that.data.pw2.length > 1 && that.data.pw1 == that.data.pw2 && that.data.code == that.data.verifyCode) {
      that.setData({
        isSubmit: true
      })
    } else {
      that.setData({
        isSubmit: false
      })
    }
  },
  sendCode: function() {  //发送手机验证码
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
          if(ret.code != 200){
            wx.showToast({
              icon: "none",
              title: ret.message,
            })
          }else{
          that.setData({
            verifyCode: datas.verify_code
          });
          }
        }
      })
    } else {
      wx.showToast({
        icon: "none",
        title: '手机号不正确',
      })
    }

  },
  findPassword: function(){
    if (that.data.phone != '' && that.data.code != '' && that.data.pw1 != '' && that.data.pw1 == that.data.pw2){
    var param = {
      page_code: "p010",
      type: 'findPassword',
      phone: that.data.phone,
      code: that.data.code,
      password: that.data.pw1
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
        if (info.code != 200) {
          wx.showToast({
            icon: "none",
            title: info.message
          });
        } else {
          that.setData({
            showModal: false
          });
        }
      }
    });
    }else{
      wx.showToast({
        icon: "none",
        title: '信息不完整',
      })
    }
  },
  toRegister:function(){
    wx.navigateTo({
      url: '../register/register',
    });
  }
})