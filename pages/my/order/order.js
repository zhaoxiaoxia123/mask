// pages/home/home.js
var that;
var base = require('../../../utils/base.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: '0',
    indicatorDots: true,
    indicatorColor: "#000000",
    indicatorActiveColor: "#b7aa00",
    autoplay: true,
    interval: 3000,
    duration: 500,
    circular: true,
    offset: 1,
    pageCount: 20,
    isLast: false,
    order_state: 1,
    memberNo: wx.getStorageSync('memberNo'),
    items: [],
    domainName: app.globalData.domainName
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.setData({
      currentTab: parseInt(options.id) - 1,
      order_state: parseInt(options.id) - 1
    });
    // console.log(that.data.order_state);
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
      items: [],
      isLast: false
    });
    if (wx.getStorageSync('customerId') && !wx.getStorageSync('get_user_info') && !wx.getStorageSync('get_phone_info')){
    var param = {
      page_code: 'p008',
      type: "myOrder",
      // customer_id: wx.getStorageSync('customerId'),
      order_state: that.data.order_state,
      offset: (that.data.offset - 1) * that.data.pageCount,
      page: that.data.pageCount
    };
    // var param = '/p008?type=myOrder&order_state='+that.data.order_state+'&customer_id='+ wx.getStorageSync('customerId')+'&offset='+((that.data.offset - 1) * that.data.pageCount)+'&page='+that.data.pageCount;
    that.getOrderList(param);
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
    if (!that.data.isLast) {
      that.setData({
        offset: that.data.offset + 1
      });
      var param = {
        page_code: 'p008',
        type: "myOrder",
        // customer_id: wx.getStorageSync('customerId'),
        order_state: that.data.order_state,//默认访问待付款
        offset: (that.data.offset - 1) * that.data.pageCount,
        page: that.data.pageCount
      };
      // var param = '/p008?type=myOrder&order_state='+that.data.order_state+'&customer_id='+ wx.getStorageSync('customerId')+'&offset='+((that.data.offset - 1) * that.data.pageCount)+'&page='+that.data.pageCount;
      that.getOrderList(param);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  // 跳转规格弹窗
  logistics: function (e) {
    var that = this;
    var flexwindow;
    if (this.data.flexwindow == true) {
      flexwindow = false;
    }
    else {
      flexwindow = true;
    }
    that.setData({
      flexwindow: flexwindow
    });
  },
  close: function (e) {
    var flexwindow = false;
    that.setData({
      flexwindow: flexwindow
    })
  },

  //以下为自定义点击事件
  getOrderList: function (param) {
    // wx.request({
    //   url: app.globalData.domainUrl,
    //   data: param,
    //   header: {
    //     'content-type': 'application/json'
    //   },
    //   success: function (res) {
    //     var datas = res.data.data;
    //     if (datas){
    //       that.setData({
    //         items: that.data.items.concat(datas)
    //       });
    //       if (datas.length <= 0 || datas.length < that.data.pageCount) {
    //         that.setData({
    //           isLast: true
    //         });
    //       }
    //     }
    //   }
    // });

    var params = {
      url: app.globalData.domainUrl,
      data:param,
      method:'GET',
      sCallback: function (res) {
        var datas = res.data.data;
        if (datas){
          that.setData({
            items: that.data.items.concat(datas)
          });
          if (datas.length <= 0 || datas.length < that.data.pageCount) {
            that.setData({
              isLast: true
            });
          }
        }
      }
    };
    base.httpRequest(params);

  },
  
  // tab切换
  clickTab: function (e) {
    var that = this;
    // console.log("-1", this.data.currentTab)
    // console.log("-2", e.currentTarget.dataset.current)
    if (this.data.currentTab == e.currentTarget.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.currentTarget.dataset.current,
        order_state: parseInt(e.currentTarget.dataset.current),
        offset:1,
        isLast:false,
        items:[]
      })
      if (wx.getStorageSync('customerId') && !wx.getStorageSync('get_user_info') && !wx.getStorageSync('get_phone_info')){
      var param = {
        page_code: 'p008',
        type: "myOrder",
        // customer_id: wx.getStorageSync('customerId'),
        order_state: that.data.order_state,//默认访问待付款
        offset: (that.data.offset - 1) * that.data.pageCount,
        page: that.data.pageCount
      };
      // var param = '/p008?type=myOrder&order_state='+that.data.order_state+'&customer_id='+ wx.getStorageSync('customerId')+'&offset='+((that.data.offset - 1) * that.data.pageCount)+'&page='+that.data.pageCount;
      that.getOrderList(param);
      }
    }
  },
  orderdetail: function (e) {
    wx.navigateTo({
      url: 'orderdetail/orderdetail?order_id=' + e.currentTarget.dataset.id+'&from_page=myorder',
    })
  },
  //取消订单
  cancelOrder: function (e) {
    var order_id = e.currentTarget.dataset.id;
    var order_state = e.currentTarget.dataset.state;
    // wx.request({
    //   url: app.globalData.domainUrl,
    //   method: "POST",
    //   data: {
    //     page_code: 'p008',
    //     type: 'cancel',
    //     order_id: order_id,
    //     order_state: order_state   //取消前的订单状态
    //   },
    //   header: {
    //     "Content-Type": "application/x-www-form-urlencoded"
    //   },
    //   success: function (res) {
    //     // console.log(res);
    //     var datas = res.data.data;
    //     if (datas) {
    //       wx.showToast({
    //         title: res.data.message
    //       });
    //       that.onShow();
    //     }
    //   }
    // })
    let param = {
      page_code: 'p008',
      type: 'cancel',
      order_id: order_id,
      order_state: order_state   //取消前的订单状态
    };
    var params = {
      url: app.globalData.domainUrl,
      data:param,
      method:'POST',
      sCallback: function (res) {
        var datas = res.data.data;
        if (datas) {
          wx.showToast({
            title: res.data.message
          });
          that.onShow();
        }
      }
    };
    base.httpRequest(params);

  },
  submitMessage:function(e){ //提醒发货
    var order_id = e.currentTarget.dataset.id;
    // wx.request({
    //   url: app.globalData.domainUrl,
    //   method: "POST",
    //   data: {
    //     page_code: 'p008',
    //     type: 'sendMessage',
    //     order_id: order_id
    //   },
    //   header: {
    //     "Content-Type": "application/x-www-form-urlencoded"
    //   },
    //   success: function (res) {
    //     // console.log(res);
    //     var datas = res.data.data;
    //     if (datas) {
    //       wx.showToast({
    //         title: res.data.message
    //       });
    //     }
    //   }
    // })
    
    let param = {
      page_code: 'p008',
      type: 'sendMessage',
      order_id: order_id
    };
    var params = {
      url: app.globalData.domainUrl,
      data:param,
      method:'POST',
      sCallback: function (res) {
        var datas = res.data.data;
        if (datas) {
          wx.showToast({
            title: res.data.message
          });
        }
      }
    };
    base.httpRequest(params);

  },
  submitOk: function(e){ //确认收货
    var order_id = e.currentTarget.dataset.id;
    // wx.request({
    //   url: app.globalData.domainUrl,
    //   method: "POST",
    //   data: {
    //     page_code: 'p008',
    //     type: 'receive',
    //     order_id: order_id
    //   },
    //   header: {
    //     "Content-Type": "application/x-www-form-urlencoded"
    //   },
    //   success: function (res) {
    //     // console.log(res);
    //     var datas = res.data.data;
    //     if (datas) {
    //       wx.showToast({
    //         title: res.data.message
    //       });
    //       that.onShow();
    //     }
    //   }
    // })

    let param = {
      page_code: 'p008',
      type: 'receive',
      order_id: order_id
    };
    var params = {
      url: app.globalData.domainUrl,
      data:param,
      method:'POST',
      sCallback: function (res) {
        var datas = res.data.data;
        if (datas) {
          wx.showToast({
            title: res.data.message
          });
          that.onShow();
        }
      }
    };
    base.httpRequest(params);

  },
})

