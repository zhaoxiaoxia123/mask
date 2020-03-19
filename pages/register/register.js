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
    pw1: '',
    pw2: '',
    // showModal: false,
    shareCustomerInfo:[],
    verifyCode:'',
    shareBy:'',
    nickname: '',
    avatar: '',
    isSubmit: false,   //是否可以找回密码
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    if (options.scene) {
      var scene = decodeURIComponent(options.scene);
      console.log("scene is ", scene);
      var arrPara = scene.split("&");
      var arr = [];
      for (var i in arrPara) {
        arr = arrPara[i].split("=");
        wx.setStorageSync(arr[0], arr[1]);
        console.log("setStorageSync:", arr[0], "=", arr[1]);
        if (arr[0] == 'shareBy') {
          that.setData({
            shareBy: arr[1]
          });
        }
      }
    } else {
      console.log("no scene");
    }
    if (wx.getStorageSync('customerId')){
      wx.switchTab({
        url: '../home/home',
      });
    }else{
      if (wx.getStorageSync('shareBy')){
        that.setData({
          shareBy: wx.getStorageSync('shareBy')
        });
        that.getShareCustomer();
      }
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
  
  getShareCustomer: function () {  //获取分享用户信息
    var param = {
      page_code: 'p004',
      share_by: that.data.shareBy
    };
    wx.request({
      url: app.globalData.domainUrl,
      data: param,
      header: {
        'content-type': "application/json"
      },
      success: function (res) {
        var datas = res.data.data;
        that.setData({
          shareCustomerInfo:datas
        });

        // that.setData({
        //   showModal: true
        // })
      }
    })
  },
  phoneRegister: function(){
    if (that.data.phone.length == 11 && that.data.pw1.length > 0 && that.data.pw1 == that.data.pw2){
      var param = {
        page_code: "p010",
        type: "shareBy",
        share_by: that.data.shareBy,
        phone: that.data.phone,
        password: that.data.pw1
      };
      that.register(param);
    }else{
      wx.showToast({
        title: '填写信息不完整',
      })
    }
  },
  bindGetUserInfo: function () {
    // console.log('userInfo');
    wx.getUserInfo({
      success: function (res) {
        //获取openid，并更新到用户表
        that.setData({
          nickname: res.userInfo.nickName,
          avatar: res.userInfo.avatarUrl,
        });

        var param = {
          page_code: "p010",
          type: "shareBy",
          share_by: that.data.shareBy,
          phone: that.data.phone,
          password: that.data.pw1,
          code:app.globalData.code,
          nickname: that.data.nickname,
          avatar: that.data.avatar
        };
        that.register(param);
      },
      fail: function () {
        wx.showToast({
          icon: "none",
          title: '权限限制,操作无法继续',
        })
      }
    });
  },
  // 弹出层里面的弹窗
  register: function (param) {
    wx.request({
      url: app.globalData.domainUrl,
      method: "POST",
      data: param,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        var ret = res.data;
        var datas = ret.data;
        if (datas.has_share_by || datas.customer_exist){
          wx.showToast({
            icon: "none",
            title: ret.message,
          })
        }else{
          // this.setData({
          //   showModal: false
          // });
          wx.setStorageSync('customerId', datas.customer_id);
          wx.setStorageSync('openid', datas.openid);
          wx.setStorageSync('memberNo', datas.number);  //会员号
          wx.setStorageSync('level', datas.level);  //等级
          wx.setStorageSync('discount', datas.discount);  //折扣
          wx.switchTab({
            url: '../home/home',
          });
        }
      }
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
          if (ret.code == 221) {
            wx.showToast({
              icon: "none",
              title: ret.message,
            })
          } else {
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

})