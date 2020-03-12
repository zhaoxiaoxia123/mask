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
    shareCustomerInfo:[],
    verifyCode:'',
    shareBy:''
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
      that.getShareCustomer();
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
    param = {
      page_code: 'p004',
      share_by: wx.getStorageSync("shareBy")
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

        that.setData({
          showModal: true
        })
      }
    })
  },

  // bindGetUserInfo: function () {
  //   console.log('userInfo');
  //   wx.getUserInfo({
  //     success: function (res) {
  //       //获取openid，并更新到用户表
  //       that.updateUserInfo({
  //         page_code: 'p010',
  //         code: app.globalData.code,  //获取openid的code码
  //         nickname: res.userInfo.nickName,
  //         avatarUrl: res.userInfo.avatarUrl,
  //       });
  //     },
  //     fail: function () {
  //       wx.showToast({
  //         title: '无获取信息权限',
  //       })
  //     }
  //   });
    
  // },
  // updateUserInfo: function (param) {  //更新用户信息
  //   wx.request({
  //     url: app.globalData.domainUrl,
  //     method: "POST",
  //     data: param,
  //     header: {
  //       "Content-Type": "application/x-www-form-urlencoded"
  //     },
  //     success: function (res) {
  //       // wx.navigateBack({
  //       //     delta: 1  //小程序关闭当前页面返回上一页面
  //       // })
  //       var datas = res.data.data;
  //       wx.setStorageSync('customerId', datas.customer_id);
  //       wx.setStorageSync('openid', datas.openid);
  //       wx.setStorageSync('memberNo', datas.number);  //会员号
  //       wx.setStorageSync('level', datas.level);  //等级
  //       wx.setStorageSync('discount', datas.discount);  //折扣
  //       app.globalData.canGetUserInfo = false;
  //       that.setData({
  //         canGetUserInfo: app.globalData.canGetUserInfo
  //       });
  //       if (datas.is_new == true) {  //若用户是新用户，则进行分享码进来用户注册
  //         that.setData({
  //           showModal: true
  //         });
  //         that.getShareCustomer();
  //       }else{
  //         wx.navigateTo({
  //           url: '../my/my',
  //         });
  //       }
  //     }
  //   })
  // },
  // 弹出层里面的弹窗
  register: function () {
    var param = {
      page_code:"p010",
      share_by: wx.getStorageSync('shareBy'),
      phone: that.data.phone,
      password:that.data.password
    };
    
    wx.request({
      url: app.globalData.domainUrl,
      method: "POST",
      data: param,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        var datas = res.data;
        if (datas.data == false){
          wx.showToast({
            title: datas.message,
          })
        }else{
          this.setData({
            showModal: false
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
  },
  setPhoneInput: function (e) {
    var value = e.detail.value;
    that.setData({
      phone: e.detail.value
    })
  },
  setPasswordInput: function (e) {
    var value = e.detail.value;
    that.setData({
      password: e.detail.value
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
          phopne: phoneNum
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

})