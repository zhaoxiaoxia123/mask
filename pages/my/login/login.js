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
    showModal: false,
    isSubmit:false,
    isShareBy: false,   //是否通过邀请码注册
    shareBy: '',   //邀请码
    get_user_info:false,   //是否继续获取用户信息
    get_phone_info:false,  //是否继续获取手机信息
    isVerifyClick:true, // 获取验证码按钮是否可点击
    isPhoneClick:true, // 手机授权按钮是否可点击
    isUserInfoClick:true, // 获取用户信息按钮是否可点击
    timer: '',//定时器名字
    countNum: '10',  //倒计时初始值
    sessId:'',  //存储手机验证码的sessionid
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    if (options.shareBy || wx.getStorageSync("shareBy") != '') {
      that.setData({
        isShareBy:true,
        shareBy: options.shareBy?options.shareBy: wx.getStorageSync("shareBy"),
      });
    }
    if (wx.getStorageSync('customerId') && !wx.getStorageSync('get_user_info') && !wx.getStorageSync('get_phone_info')){
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
    that.setData({
      get_user_info : (wx.getStorageSync("get_user_info")==="" || wx.getStorageSync("get_user_info")===true)?true:false, //是否继续获取用户信息
      get_phone_info : (wx.getStorageSync("get_phone_info")==="" || wx.getStorageSync("get_phone_info")===true)?true:false   //是否继续获取手机信息
    });
    wx.login({
      success: r => {
        app.globalData.code = r.code;
        // that.phoneLogin(ency, iv);
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log('onHide');
    clearInterval(that.data.timer);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log('unload');
    clearInterval(that.data.timer);
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

  //获取验证码按钮是否可点击
  setVerifyClickState:function(value){
    that.setData({
      isVerifyClick:value
    });
  },
  //手机授权按钮是否可点击
  setPhoneClickState:function(value){
    that.setData({
      isPhoneClick:value
    });
  },
  // 获取用户信息按钮是否可点击
  setUserInfoClickState:function(value){
    that.setData({
      isUserInfoClick:value
    });
  },
  // bindGetUserInfo: function () {
  //   console.log('userInfo');
  //   if (!app.globalData.code) {
  //     wx.login({
  //       success: r => {
  //         app.globalData.code = r.code;  //无权，显示向用户获取权限
  //         that.wxGetUserInfo();
  //       }
  //     })
  //   }else{
  //     that.wxGetUserInfo();
  //   }
  //   // } else {
  //   //   wx.showToast({
  //   //     icon: "none",
  //   //     title: "请清除缓存重新登录"
  //   //   });
  //   // }
  // },
  // wxGetUserInfo:function(){
    
  bindGetUserInfo: function () {
    // wx.checkSession({
    //   success: function (res) {
    wx.login({
      success: r => {
        app.globalData.code = r.code;  //无权，显示向用户获取权限
      wx.getUserInfo({
        withCredentials:true,
        success: function (res) {
          console.log("getUserInfo:-----");
          console.log(res);

          wx.setStorageSync('username', res.userInfo.nickName);
          wx.setStorageSync('avatar', res.userInfo.avatarUrl);

          //获取openid，并更新到用户表
          that.updateUserInfo({
            page_code: 'p010',
            type: 'wxLogin',
            code: app.globalData.code,  //获取openid的code码
            nickname: res.userInfo.nickName,
            avatarUrl: res.userInfo.avatarUrl,
            phone:wx.getStorageSync('phone')?wx.getStorageSync('phone'):'',
            openid:wx.getStorageSync('openid')?wx.getStorageSync('openid'):'',
            unionid:wx.getStorageSync('unionid')?wx.getStorageSync('unionid'):'',
            sessionid:wx.getStorageSync('sessionKey')?wx.getStorageSync('sessionKey'):'',
            encryptedData:res.encryptedData, 
            iv:res.iv,
            share_by: that.data.shareBy,
          });
        }
      });
    // },fail:function(){
      // wx.login({
      //   success: r => {
      //     app.globalData.code = r.code;  //无权，显示向用户获取权限
      //     that.bindGetUserInfo();
      //   }
      // });
    }
  })
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
        console.log(res);
        var ret = res.data;
        var datas = ret.data;
        if (ret.code != 200) {
          wx.showToast({
            icon: "none",
            title: ret.message
          });
        } else {
          // app.globalData.canGetUserInfo = false;
          that.addStorage(datas);
          // wx.setStorageSync('customerId', datas.c_id);
          // wx.setStorageSync('openid', datas.frozeno_openid);
          // wx.setStorageSync('memberNo', datas.c_number);  //会员号
          // wx.setStorageSync('level', datas.frozeno_level);  //等级
          // wx.setStorageSync('discount', datas.discount);  //折扣
          // wx.setStorageSync('sessionKey', datas.session_id);
          // that.setData({
          //   canGetUserInfo: app.globalData.canGetUserInfo
          // });
          // if (datas.phone == null || datas.phone.length == 0) {
          //   wx.showToast({
          //     icon: "none",
          //     title: '请继续点击手机号授权',
          //   })
          // } else {
            // wx.switchTab({
            //   url: '/pages/home/home',
            // });
          // }
        }
      }
    })
  },
  getPhoneNumber: function (e) {
    var ency = e.detail.encryptedData;
    var iv = e.detail.iv;
    wx.checkSession({
      success: function (res) {
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
          if(ency != undefined && iv != undefined){
            if (app.globalData.code == ''){
              wx.login({
                success: r => {
                  app.globalData.code = r.code;
                  that.phoneLogin(ency, iv);
                }
              })
            }else{
              that.phoneLogin(ency, iv);
            }
          }
        }
      },
      fail:function(){
        wx.login({
          success: r => {
            app.globalData.code = r.code;
            that.phoneLogin(ency, iv);
          }
        })
      },
    });
  },
  phoneLogin: function (ency, iv){
    //同意授权
    wx.request({
      url: app.globalData.domainUrl,
      method: "POST",
      data: {
        page_code: 'p010',
        type: 'wxPhone',  //获取手机号
        sessionid: wx.getStorageSync('sessionKey'),
        code: app.globalData.code,
        iv: iv,
        encryptedData: ency,
        username:wx.getStorageSync('username')?wx.getStorageSync('username'):'',
        avatar:wx.getStorageSync('avatar')?wx.getStorageSync('avatar'):'',
        openid:wx.getStorageSync('openid')?wx.getStorageSync('openid'):'',
        unionid:wx.getStorageSync('unionid')?wx.getStorageSync('unionid'):'',
        share_by: that.data.shareBy
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        let datas = res.data.data;
        if (res.data.code != 200) {
          wx.showToast({
            icon: "none",
            title: res.data.message,
          })
        } else {
          that.addStorage(datas);
        }
      },
      fail: function (res) {
        console.log('fail' + res);
      }
    });
  },

  addStorage: function(datas){
    wx.setStorageSync('get_user_info', datas.get_user_info);//是否需要继续授权获取用户信息
    wx.setStorageSync('get_phone_info', datas.get_phone_info);//是否需要继续授权获取手机信息
    wx.setStorageSync('customerId', datas.c_id);
    wx.setStorageSync('sessionKey', datas.session_id);
    wx.setStorageSync('phone', datas.c_phone);
    wx.setStorageSync('username', datas.c_name?datas.c_name:'');  //用户名
    wx.setStorageSync('avatar', datas.frozeno_avatar);  //用户名
    wx.setStorageSync('openid', datas.frozeno_openid);
    wx.setStorageSync('unionid', datas.frozeno_unionid);
    wx.setStorageSync('token', datas.token);
    if(datas.c_number){
      wx.setStorageSync('memberNo', datas.c_number);  //会员号
      wx.setStorageSync('level', datas.frozeno_level);  //等级
      wx.setStorageSync('discount', datas.discount);  //折扣
    }
    that.setData({
      get_user_info : wx.getStorageSync("get_user_info"), //是否继续获取用户信息
      get_phone_info : wx.getStorageSync('get_phone_info'),    //是否继续获取手机信息
    });
    
    if(!wx.getStorageSync('get_user_info') && !wx.getStorageSync('get_phone_info')){
      wx.switchTab({
        url: '/pages/home/home',
      });
    }
  },

  //手机验证码登录/注册
  showModalView: function () {
    that.setData({
      showModal: true
    });
  },

  setCodeInput: function (e) {
    let value = that.validateNumber(e.detail.value)
    console.log(value);
    that.setData({
      code:value
    })
    that.setbuttonStatus();
  },
  setPhoneInput: function (e) {
    let value = that.validateNumber(e.detail.value)
    console.log(value);
    that.setData({
      phone:value
    })
    that.setbuttonStatus();
  },
  validateNumber(val) {
    return val.replace(/\D/g, '')
  },
  //返回按钮状态来 是否可以找回密码
  setbuttonStatus: function () {
    console.log('setbuttonStatus:----');
    if (that.data.phone.length == 11 && that.data.code.length == 4 ) {
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
    var str = /^1\d{10}$/;
    if (str.test(phoneNum)) {
      that.setVerifyClickState(false);
      that.intervalTimer();//开始倒计时
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
          if (ret.code == 200){
            that.setData({
              sessId:datas.sess_id
            });
          }else{
            wx.showToast({
              icon: "none",
              title: '出错了。'
            });
          }
        }
      })
    } else {
      wx.showToast({
        icon: "none",
        title: '手机号不正确'
      })
    }
  },

  intervalTimer: function () {
    let countNum = that.data.countNum;
    that.setData({
      timer: setInterval(function () {
        countNum--;
        that.setData({
          countNum: countNum
        })
        if (countNum == 0) {
          clearInterval(that.data.timer);
          that.setVerifyClickState(true);
          that.setData({
            countNum: 10
          })
        }
      }, 1000)
    })
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
        phone: that.data.phone,
        code: that.data.code,
        sess_id: that.data.sessId,
        share_by:wx.getStorageSync('shareBy')?wx.getStorageSync('shareBy'):'',
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
              if (info.code == 200){
                that.addStorage(datas);
              }
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
    clearInterval(that.data.timer);
    that.setVerifyClickState(true);
  },

  goPage:function(e){
    var type = e.currentTarget.dataset.type;
    console.log(type);
    if (type == 'agree'){
      wx.navigateTo({
        url: '/pages/post/post?type=14'
      })
    } else {
      wx.navigateTo({
        url: '/pages/post/post?type=15'
      })
    }
  },
  /**
   * 是否输入邀请码注册
   */
  checkboxChange:function(){
    that.setData({
      isShareBy:!that.data.isShareBy
    });
  },

  setShareByInput: function (e) {
    var value = e.detail.value;
    that.setData({
      shareBy: e.detail.value
    })
  },
})