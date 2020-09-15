// pages/home/financial_mgm/balance/balance.js
var that;
var app = getApp();
var base = require('../../../../utils/base.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    year:'',
    month:'',
    date: '',
    financeList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    if (wx.getStorageSync('customerId') && !wx.getStorageSync('get_user_info') && !wx.getStorageSync('get_phone_info')) {
      base.loading(2000);
      var param = {
        page_code: 'p007',
        type: "list"
      };
      that.getFinanceList(param);
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
    base.loading(2000);
    let mon = (that.data.month-1) > 0 ?(that.data.month-1):12;
    let year = that.data.year;
    if(mon == 12){
      year = year - 1;
    }
    that.setData({
      month:mon,
      year:year
    });
    var param = {
      page_code: 'p007',
      type: "list",
      year:year,
      month:mon
    };
    that.getFinanceList(param);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

   //获取余额明细信息
   getFinanceList: function(param) {
    var params = {
      url: app.globalData.domainUrl,
      data:param,
      method:'GET',
      sCallback: function (res) {
        let datas = res.data.data;
        wx.hideToast();
        that.setData({
          financeList: that.data.financeList.concat(datas),
          year:datas.year,
          month:datas.month
        });
      }
    };
    base.httpRequest(params);
  },

  bindDateChange: function (e) {
    let date = e.detail.value;
    let pickerInfo = date.split("-");
    let year = pickerInfo[0];
    let month = pickerInfo[1];

    that.setData({
      // date: year+"年"+month+"月",
      financeList:[]
    })
    var param = {
      page_code: 'p007',
      type: "list",
      year:year,
      month:month
    };
    that.getFinanceList(param);
  },
  
  // 账单详情
  financial: function (e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../../../my/financial_mgm/financial/financial?id='+id
    })
  },
  // // tab切换
  // clickTab: function (e) {
  //   var that = this;
  //   console.log("-1", this.data.currentTab)
  //   console.log("-2", e.currentTarget.dataset.current)
  //   if (this.data.currentTab == e.currentTarget.dataset.current) {
  //     return false;
  //   } else {
  //     that.setData({
  //       currentTab: e.currentTarget.dataset.current,
  //     })
  //   }
  // }
})