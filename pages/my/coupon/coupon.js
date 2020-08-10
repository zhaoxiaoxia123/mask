// pages/my/coupon/coupon.js
var that;
var app = getApp();
var base = require('../../../utils/base.js');
Page({

  /**
   * 组件的初始数据
   */
  data: {
    currentIndex: 0,
    offset: 1,
    pageCount: 20,
    isLast: false,
    ticketList: [],
    show_amount: '', //需展示的新会员卡券兑换金额
    imgLoad:'../../img/loading.gif',
    message:'正在努力加载中',
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    that = this;//在请求数据时setData使用
  
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
      ticketList: [],
      show_amount:'',
      isLast: false
    });
    if (wx.getStorageSync('customerId') && !wx.getStorageSync('get_user_info') && !wx.getStorageSync('get_phone_info')) {
      
      that.setData({
        imgLoad:'../../img/loading.gif',
        message:'正在努力加载中',
      });
      var param = {
        page_code: "p013",
        // customer_id: wx.getStorageSync('customerId'),
        is_show_amount: 1,  //是否展示新会员卡券
        ticket_state: (parseInt(that.data.currentIndex) + 1),  //记录当前显示的列表状态
        offset: (that.data.offset - 1) * that.data.pageCount,
        page: that.data.pageCount
      };
      // var param = '/p013?customer_id='+ wx.getStorageSync('customerId')+'&offset='+((that.data.offset - 1) * that.data.pageCount)+'&page='+that.data.pageCount;
      that.getTicketList(param);
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
  onReachBottom: function () {
    if (wx.getStorageSync('customerId') && !wx.getStorageSync('get_user_info') && !wx.getStorageSync('get_phone_info')) {
      if (!that.data.isLast) {
        that.setData({
          offset: that.data.offset + 1
        });
        var param = {
          page_code: "p013",
          // customer_id: wx.getStorageSync('customerId'),
          is_show_amount: 1,  //是否展示新会员卡券
          ticket_state: (parseInt(that.data.currentIndex) + 1),  //记录当前显示的列表状态
          offset: (that.data.offset - 1) * that.data.pageCount,
          page: that.data.pageCount
        };
        // var param = '/p013?customer_id='+ wx.getStorageSync('customerId')+'&offset='+((that.data.offset - 1) * that.data.pageCount)+'&page='+that.data.pageCount;
        that.getTicketList(param);
      }
    }
  },

  //swiper切换时会调用
  pagechange: function (e) {
    if ("touch" === e.detail.source) {
      let currentPageIndex = that.data.currentIndex
      currentPageIndex = (currentPageIndex + 1) % 3
      that.setData({
        currentIndex: currentPageIndex,
        offset: 1,
        isLast: false,
        ticketList: [],
      show_amount: '',
      });
      if (wx.getStorageSync('customerId') && !wx.getStorageSync('get_user_info') && !wx.getStorageSync('get_phone_info')) {
        
      that.setData({
        imgLoad:'../../img/loading.gif',
        message:'正在努力加载中',
      });
        var param = {
          page_code: "p013",
          // customer_id: wx.getStorageSync('customerId'),
          is_show_amount: 1,  //是否展示新会员卡券
          ticket_state: (parseInt(that.data.currentIndex) + 1),  //记录当前显示的列表状态
          offset: (that.data.offset - 1) * that.data.pageCount,
          page: that.data.pageCount
        };
        // var param = '/p013?customer_id='+ wx.getStorageSync('customerId')+'&offset='+((that.data.offset - 1) * that.data.pageCount)+'&page='+that.data.pageCount;
        that.getTicketList(param);
      }
    }
  },
  //用户点击tab时调用
  titleClick: function (e) {
    if (that.data.currentIndex == e.currentTarget.dataset.idx) {
      return false;
    } else {
      that.setData({
        //拿到当前索引并动态改变
        currentIndex: e.currentTarget.dataset.idx,
        offset: 1,
        isLast: false,
        ticketList: [],
        show_amount:'',
      })
      if (wx.getStorageSync('customerId') && !wx.getStorageSync('get_user_info') && !wx.getStorageSync('get_phone_info')) {
        
      that.setData({
        imgLoad:'../../img/loading.gif',
        message:'正在努力加载中',
      });
        var param = {
          page_code: "p013",
          // customer_id: wx.getStorageSync('customerId'),
          is_show_amount: 1,  //是否展示新会员卡券
          ticket_state: (parseInt(that.data.currentIndex) + 1),  //记录当前显示的列表状态
          offset: (that.data.offset - 1) * that.data.pageCount,
          page: that.data.pageCount
        };
        that.getTicketList(param);
      }
    }
  },
  //以下为自定义点击事件
  getTicketList: function (param) {
    var params = {
      url: app.globalData.domainUrl,
      data:param,
      method:'GET',
      sCallback: function (res) {
        var datas = res.data.data;
        that.setData({
          ticketList: that.data.ticketList.concat(datas.ticket),
          show_amount: datas.show_amount,
          message:'您还没有优惠券',
          imgLoad:'../../img/wu.png',
        });
        if (datas.ticket.length <= 0 || datas.ticket.length < that.data.pageCount) {
          that.setData({
            isLast: true
          });
        }
      }
    };
    base.httpRequest(params);

  },
  goOrder: function(e) {  //去购物车使用卡券
    // var ticketId = e.currentTarget.dataset.id;
    // console.log(ticketId);
    // app.globalData.ticketId = ticketId;
    wx.switchTab({
      url: '/pages/shopcat/shopcat',
    })
  },
})
