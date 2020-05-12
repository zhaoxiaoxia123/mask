// pages/post/post.js
var that;
var app = getApp();
var WxParse = require('../../wxParse/wxParse.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    postId:0,
    type: 0,
    href: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.setData({
      postId: options.id,
      type: options.type,
      href:options.href
    });
    if (that.data.type){
      var param = {
        page_code: "p001",
        type: that.data.type
      };
      that.getPost(param);
    } else if (that.data.postId) {
      var param = {
        page_code: "p001",
        post_id: that.data.postId
      };
      that.getPost(param);
    } else if (that.data.href) {
      
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
  //读取文章页面
  getPost: function (param) {
    wx.request({
      url: app.globalData.domainUrl,
      data: param,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var datas = res.data.data;
        console.log(datas.length);
        if (datas.length > 0){
          //修改顶部标题栏信息
          wx.setNavigationBarTitle({
            title: datas[0].title
          });
          var infos = datas[0].description;
          WxParse.wxParse('infos', 'html', infos, that);
        }
      }
    });
  },
})