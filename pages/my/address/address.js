// pages/home/home.js
var that;
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true,
    indicatorColor: "#000000",
    indicatorActiveColor: "#b7aa00",
    autoplay: true,
    interval: 3000,
    duration: 500,
    circular: true,
    items: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("onLoad");
    that = this;
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
    that.getAddressList();
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
  getAddressList: function(){
    wx.request({
      url: app.globalData.domainUrl,
      data: {
        page_code: "p002",
        customer_id: wx.getStorageSync('customerId')
      },
      header: {
        'content-type': "application/json"
      },
      success: function (res) {
        console.log(res);
        var datas = res.data.data;
        that.setData({
          items: datas
        });
      }
    })
  },
  addAddress: function (e) {
    console.log(e)
    wx.navigateTo({
      url: '../../my/address/addressdetail/addressdetail',
    })
  },
  editAddress: function(e){
    var type = e.currentTarget.dataset.type;
    var id = e.currentTarget.dataset.id;
    if (type == 'edit'){
      wx.navigateTo({
        url: '../../my/address/addressdetail/addressdetail?id=' + id,
      })
    } else {  //删除
      var index = e.currentTarget.dataset.index;
      var param = {
        page_code: "p002",
        type: type,
        customer_addr_id: id,
        // is_default: false
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
          that.setData({
            items: that.deleteItem(that.data.items, index)
          });
        }
      })
    }
  },
  deleteItem: function (data,delIndex) {
    var temArray = [];
    for (var i = 0; i < data.length; i++) {
      if (i != delIndex) {
        temArray.push(data[i]);
      }
    }
    return temArray;
  }
})