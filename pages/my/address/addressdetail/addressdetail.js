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
    region: ['四川省', '成都市', '成华区']
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
    var value = e.detail.value;
    that.setData({
      name: e.detail.value
    })
  },
  setPhoneInput: function (e) {
    var value = e.detail.value;
    that.setData({
      phone: e.detail.value
    })
  },
  setAddressInput: function (e) {
    var value = e.detail.value;
    that.setData({
      address: e.detail.value
    })
  },
  setZipInput: function (e) {
    var value = e.detail.value;
    that.setData({
      zip: e.detail.value
    })
  },
  bindRegionChange: function(e) {
    that.setData({
      region: e.detail.value
    })
  },
  radiocon: function (e) {
    var is_default = that.data.is_default;
    that.setData({
      is_default: !that.data.is_default
    })
    console.log(is_default);
  },
  //提交地址信息
  submitAddress: function(){
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
      is_default: that.data.is_default,
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
        if (datas){
          wx.navigateBack({
            delta:1
          });
        }
      }
    })
  },
})