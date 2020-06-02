// pages/my/setting/information/information.js
var app = getApp();
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    birthday:'',
    endDate: '',
    items: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    let nowDate = new Date();
    that.setData({
      endDate: nowDate.getFullYear() + '-' + (nowDate.getMonth() + 1) + '-' + nowDate.getDate()
    });
    console.log(that.data.endDate);
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
    if (wx.getStorageSync('customerId') && !wx.getStorageSync('get_user_info') && !wx.getStorageSync('get_phone_info')) {
      var param = {
        page_code: 'p004',
        type: "mainCustomer",
        customer_id: wx.getStorageSync('customerId')
      };
      that.getUserDetail(param);
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

  bindDateChange: function (e) {
    
    if (wx.getStorageSync('customerId') && !wx.getStorageSync('get_user_info') && !wx.getStorageSync('get_phone_info')) {
    let value = e.detail.value;
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let param = {
      page_code: 'p004',
      type:'updateCustomer',
      birthday: value,
      customer_id: wx.getStorageSync('customerId')
    };
    wx.request({
      url: app.globalData.domainUrl,
      method: "POST",
      data: param,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res);
        var ret = res.data;
        var datas = ret.data;
        if (ret.code == 200) {
          that.setData({
            birthday: value
          });
        }
      }
    })
    }else{
      wx.showToast({
        icon: "none",
        title: '请完成授权后再修改生日',
      })
    }
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
          items: res.data.data,
          birthday:res.data.data.c_user_info
        });
      }
    });
  }
})