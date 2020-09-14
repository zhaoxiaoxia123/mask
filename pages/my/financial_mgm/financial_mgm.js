// pages/home/financial_mgm/financial_mgm.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

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
  // 余额明细
  balance: function (e) {
    console.log(e)
    wx.navigateTo({
      url: '../../my/financial_mgm/balance/balance',
    })
  },
  // 提现到银行卡
  bankacc: function (e) {
    console.log(e)
    wx.navigateTo({
      url: '../../my/financial_mgm/bank_acc/bank_acc',
    })
  },
  // 添加银行卡
  addbankacc: function (e) {
    console.log(e)
    wx.navigateTo({
      url: '../../my/financial_mgm/add_bank_acc/add_bank_acc',
    })
  }
})