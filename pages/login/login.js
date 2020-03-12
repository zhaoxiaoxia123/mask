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
    showModal: false,
    isBindWechat: false,
    customer_id: 0,
    verifyCode:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that= this;
    console.log(options.isBindWechat);
    if (options.isBindWechat != 'undefined'){
    that.setData({
      isBindWechat:options.isBindWechat
    });
    }
    if(wx.getStorageSync("openid") != ''){
      wx.switchTab({
        url: '../home/home',
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
  
  showLoginByPhone: function () {  //手机验证码登录/注册
    that.setData({
      showModal: true
    });
  },
  // 弹出层里面的弹窗
  loginByPhone: function () {
//     wx.setStorageSync('customerId', 2);
//     that.setData({
//       showModal: false,
//       customer_id: 2,
//         isBindWechat: true
//       });
  
// return false;
    if (that.data.code == that.data.verifyCode && (that.data.verifyCode != '' && that.data.code != '')){
      var param = {
        page_code: "p010",
        type:'loginByPhone',
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
          var datas = res.data.data;
            this.setData({
              showModal: false,
              customer_id: datas.customer_id
          });
          
          wx.setStorageSync('customerId', datas.customer_id);
          wx.setStorageSync('memberNo', datas.number);  //会员号
          wx.setStorageSync('level', datas.level);  //等级
          wx.setStorageSync('discount', datas.discount);  //折扣
            if (!datas.openid) {
              that.setData({
                isBindWechat:true
              });
            }else{
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
      });
    }else{
      wx.showToast({
        title: '验证码不正确',
      })
    }
    
  },

  setCodeInput: function (e) {
    var value = e.detail.value;
    that.setData({
      code: e.detail.value
    })
  },
  setPhoneInput: function (e) {
    var value = e.detail.value;
    that.setData({
      phone: e.detail.value
    })
  },
  
  sendCode: function() {  //发送手机验证码
    var phoneNum = that.data.phone;
    let str = /^1\d{10}$/
    if (str.test(phoneNum)) {
      wx.request({
        url: app.globalData.domainUrl,
        data: {
          page_code: 'p010',
          type:"sendCode",
          phone: phoneNum
        },
        header: {
          'content-type': "application/json"
        },
        success: function (res) {
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
          customer_id: wx.getStorageSync('customerId'),
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
        wx.switchTab({
          url: '../home/home',
        });
      }
    })
  },
  goLoginPage:function(){
    wx.navigateTo({
      url: '../bind/bind',
    });
  }
})