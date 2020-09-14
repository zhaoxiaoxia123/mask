// pages/home/financial_mgm/balance/balance.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
    date: '2020年9月',
    date1: '2020年8月'

  },

  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  // 账单详情
  financial: function (e) {
    console.log(e)
    wx.navigateTo({
      url: '../../../my/financial_mgm/financial/financial',
    })
  },
  // tab切换
  clickTab: function (e) {
    var that = this;
    console.log("-1", this.data.currentTab)
    console.log("-2", e.currentTarget.dataset.current)
    if (this.data.currentTab == e.currentTarget.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.currentTarget.dataset.current,
      })
    }
  }
})