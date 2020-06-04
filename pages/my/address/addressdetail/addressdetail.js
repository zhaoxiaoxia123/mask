// pages/info/info.js
var that;
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    addressId: 0,
    name: '',
    phone: '',
    zip: '',
    address: '',
    is_default: false,
    region: ['四川省', '成都市', '锦江区'],
    isClick:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this; 
    var id = options.id;
    that.setData({
      addressId: id ? id : 0
    });

    if (that.data.addressId){
      // var param = '/p002?customer_addr_id='+that.data.addressId;
      wx.request({
        url: app.globalData.domainUrl,
        data: {
          page_code: "p002",
          customer_addr_id: that.data.addressId
        },
        header: {
          'content-type': "application/json"
        },
        success: function (res) {
          console.log(res);
          var datas = res.data.data;
          that.setData({
            name: datas.name,
            phone: datas.phone,
            zip: datas.zip,
            address: datas.address,
            is_default: datas.is_default==1?true:false,
            region:[datas.province,datas.city,datas.area]
          });
          console.log('that.data.is_default');
          console.log(that.data.is_default);
        }
      })
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
  setNameInput: function(e) {
    that.setData({
      name: e.detail.value
    })
    that.hasClick();
  },
  setPhoneInput: function (e) {
    let value = this.validateNumber(e.detail.value)
    console.log(value);
      this.setData({
        phone:value
      })
    that.hasClick();
  },
  setAddressInput: function (e) {
    that.setData({
      address: e.detail.value
    })
    that.hasClick();
  },
  setZipInput: function (e) {
    let value = this.validateNumber(e.detail.value)
    console.log(value);
    this.setData({
      zip:value
    })
    that.hasClick();
  },
  bindRegionChange: function(e) {
    that.setData({
      region: e.detail.value
    })
    that.hasClick();
  },
  radiocon: function (e) {
    var is_default = that.data.is_default;
    that.setData({
      is_default: !that.data.is_default
    });
    console.log(is_default);
  },
  //所有值存在才让确认按钮可点击
  hasClick:function(){
    if(that.data.name && that.data.phone && that.data.address && that.data.zip && that.data.region){
      that.setClickState(true);
    }else {
      that.setClickState(false);
    }
  },
  
  //是否让确认按钮可点击
  setClickState:function(value){
    that.setData({
      isClick:value
    });
  },
  validateNumber(val) {
    return val.replace(/\D/g, '')
  },
  //删除地址信息
  deleteAddress: function () {
    if (wx.getStorageSync('customerId') && !wx.getStorageSync('get_user_info') && !wx.getStorageSync('get_phone_info')) {
      wx.showModal({
        title: '提示',
        content: '你确定要删除该地址信息？',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定');
            var param = {
              page_code: 'p002',
              type: "del",
              customer_addr_id: that.data.addressId
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
                var datas = res.data.data;
                if (datas) {
                  wx.navigateBack({
                    delta: 1
                  });
                }
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })

    } else {
      wx.showModal({
        title: '提示',
        content: '请完成授权后再编辑信息。',
        showCancel: false
      });
    }
  },
  // 提示消息
  // 姓名：收货人姓名长度需要在2-25个字符之间，不能包含非法字符
  // 手机号码：手机号码为十一位，格式不对，请重新输入
  // 所在地区：请选择所在地区
  // 详细地址：详细地址长度需要在5-120个字符之间，不能包含非法字符
  // 保存成功
  toast3Tap: function () {
    wx.showToast({
      title: "收货人姓名长度需要在2-25个字符之间，不能包含非法字符",
      icon: "none",
      duration: 5000
    })
  },
  //提交地址信息
  submitAddress: function(){
    if (wx.getStorageSync('customerId') && !wx.getStorageSync('get_user_info') && !wx.getStorageSync('get_phone_info')){
        that.setClickState(false);
      if (!that.data.name){
        wx.showModal({
          title: '提示',
          content: '收货人姓名长度需要在2-25个字符之间，不能包含非法字符.',
          showCancel: false
        });
        return false;
      } else if (!that.data.phone){
        wx.showModal({
          title: '提示',
          content: '手机号码为十一位，格式不对，请重新输入.',
          showCancel: false
        });
        return false;
      }
    var param = {
      page_code:'p002',
      type:"editAddress",
      name: that.data.name,
      phone: that.data.phone,
      zip: that.data.zip,
      province: that.data.region[0],
      city: that.data.region[1],
      area: that.data.region[2],
      address: that.data.address,
      is_default: that.data.is_default?1:0,
      customer_id:wx.getStorageSync('customerId'),
      customer_addr_id: that.data.addressId
    };
    console.log(param);
    wx.request({
      url: app.globalData.domainUrl,
      method: "POST",
      data: param,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res);
        var datas = res.data.data;
        that.setClickState(true);
        if (datas){
          wx.navigateBack({
            delta:1
          });
        }
      }
    })
    }else{
      wx.showModal({
        title: '提示',
        content: '请完成授权后再编辑信息。',
        showCancel: false
      });
    }
  },
})
