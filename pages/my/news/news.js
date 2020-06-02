// pages/news/news.js
var that;
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: '',
    offset: 1,
    pageCount: 20,
    isLast: false,
    msgList: [],
    type: '6,7'  //6：系统消息 7：冻龄智美通知
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    that = this;//在请求数据时setData使用
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (wx.getStorageSync('customerId') && !wx.getStorageSync('get_user_info') && !wx.getStorageSync('get_phone_info')){
      var param = {
        page_code: 'p001',
        type: that.data.type,
        customer_id: wx.getStorageSync('customerId'),
        offset: (that.data.offset - 1) * that.data.pageCount,
        page: that.data.pageCount
      };
    // var param = '/p007?customer_id='+ wx.getStorageSync('customerId')+'&offset='+((that.data.offset - 1) * that.data.pageCount)+'&page='+that.data.pageCount;
    that.getMsgList(param);
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  onReachBottom: function () {
    if (!that.data.isLast) {
      that.setData({
        offset: that.data.offset + 1
      });
      var param = {
        page_code: 'p007',
        customer_id: wx.getStorageSync('customerId'),
        offset: (that.data.offset - 1) * that.data.pageCount,
        page: that.data.pageCount
      };
      // var param = '/p007?customer_id='+ wx.getStorageSync('customerId')+'&offset='+((that.data.offset - 1) * that.data.pageCount)+'&page='+that.data.pageCount;
      that.getMsgList(param);
    }
  },
  //以下为自定义点击事件
  getMsgList: function (param) {
    wx.request({
      url: app.globalData.domainUrl,
      data: param,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var datas = res.data.data;
        that.setData({
          msgList: that.data.msgList.concat(datas)
        });
        if (datas.length <= 0 || datas.length < that.data.pageCount) {
          that.setData({
            isLast: true
          });
        }
      }
    });
  },
  // tab切换
  clickTab: function(e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
})

