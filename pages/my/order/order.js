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
    pageCount: 8,
    isLast: false,
    order_state: 1,
    memberNo: wx.getStorageSync('memberNo'),
    items: [],
    imgLoad:'',
    message:'',
    dry_id:0,
    level:0,
    cancelClick:false,
    apply_type:0,
    note:'',
    orderId:0,
    refundType:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.setData({
      currentTab: parseInt(options.id) - 1,
      order_state: parseInt(options.id) - 1,
      dry_id:app.globalData.dry_id,
      level:wx.getStorageSync('level')
    });
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
      
    base.loading(6000);
    var param = {
      page_code: 'p008',
      type: "myOrder",
      // customer_id: wx.getStorageSync('customerId'),
      order_state: that.data.order_state,
      offset: (that.data.offset - 1) * that.data.pageCount,
      page: that.data.pageCount
    };
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
      base.loading(2000);
      var param = {
        page_code: 'p008',
        type: "myOrder",
        // customer_id: wx.getStorageSync('customerId'),
        order_state: that.data.order_state,//默认访问待付款
        offset: (that.data.offset - 1) * that.data.pageCount,
        page: that.data.pageCount
      };
      that.getOrderList(param);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // 售后
  service: function (e) {
    var serviceflexwindow;
    if (that.data.serviceflexwindow == true) {
      serviceflexwindow = false;
    } else {
      serviceflexwindow = true;
    }
    that.setData({
      serviceflexwindow: serviceflexwindow,
      orderId:e.currentTarget.dataset.id,
      refundType:e.currentTarget.dataset.refund_type
    });
  },
  close1: function (e) {
    var serviceflexwindow = false;
    that.setData({
      serviceflexwindow: serviceflexwindow
    })
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
    that.setData({
      imgLoad:''
    });
    var params = {
      url: app.globalData.domainUrl,
      data:param,
      method:'GET',
      sCallback: function (res) {
        wx.hideToast();
        var datas = res.data.data;
        if (datas){
          that.setData({
            items: that.data.items.concat(datas),
            message:'您还没有相关订单',
            imgLoad:'../../img/wu.png',
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
    if (that.data.currentTab == e.currentTarget.dataset.current) {
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
        
        base.loading(1000);
        var param = {
          page_code: 'p008',
          type: "myOrder",
          // customer_id: wx.getStorageSync('customerId'),
          order_state: that.data.order_state,//默认访问待付款
          offset: (that.data.offset - 1) * that.data.pageCount,
          page: that.data.pageCount
        };
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
    wx.showModal({
      title: '提示',
      content: '你确定要取消该订单？',
      success: function (res) {
        if (res.confirm) {
          var order_id = e.currentTarget.dataset.id;
          var order_state = e.currentTarget.dataset.state;
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
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  submitMessage:function(e){ //提醒发货
    var order_id = e.currentTarget.dataset.id;
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
    that.setData({
      cancelClick:true
    });
    var order_id = e.currentTarget.dataset.id;
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
          that.setData({
            cancelClick:false
          });
        }
      }
    };
    base.httpRequest(params);
  },
  //选中申请售后条件
  checkApply:function(e){
    that.setData({
      apply_type: e.currentTarget.dataset.apply_type
    })
  },
  //添加备注信息
  setNoteInput: function (e) {
    that.setData({
      note: e.detail.value
    })
  },
  //申请退款,售后(已发货,退款退货)
  applyService:function(){
    let order_id = that.data.orderId;
    let apply_type = that.data.apply_type;
    that.sendRefundRequest(order_id,apply_type);
  },

  //申请退款(未发货,已发货均可退款)
  applyRefund: function(e){
    wx.showModal({
      title: '提示',
      content: '您确定要退款？',
      success: function (res) {
        if (res.confirm) {
          var order_id = e.currentTarget.dataset.id;
          var apply_type = e.currentTarget.dataset.apply_type;
          that.sendRefundRequest(order_id,apply_type);
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  //退款提交
  sendRefundRequest:function(order_id,apply_type){
    let param = {
      page_code: 'p008',
      type: 'applyRefund',
      order_id: order_id,
      apply_type:apply_type,
      apply_note:that.data.note
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
          that.close1();
          that.onShow();
        }
      }
    };
    base.httpRequest(params);
  }
})

