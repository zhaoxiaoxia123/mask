// pages/home/home.js
var that;
var base = require('../../../utils/base.js');
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
    fromPage: '',   //orderconfirm 页面跳转此页面会带这个参数
    items: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.setData({
      fromPage: options.come
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
    that.getInvoiceList();
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

  getInvoiceList: function () {
    if (wx.getStorageSync('customerId') && !wx.getStorageSync('get_user_info') && !wx.getStorageSync('get_phone_info')){
    let param = {
      page_code: "p006",
    };
    var params = {
      url: app.globalData.domainUrl,
      data:param,
      method:'GET',
      sCallback: function (res) {
        var datas = res.data.data;
        that.setData({
          items: datas
        });
      }
    };
    base.httpRequest(params);

    }else{
      wx.showModal({
        title: '提示',
        content: '请完成授权后再查看列表',
        showCancel: false
      });
    }
  },
  addInvoice: function (e) {
    wx.navigateTo({
      url: 'invoicedetail/invoicedetail',
    })
  },
  editInvoice: function (e) {
    var type = e.currentTarget.dataset.type;
    var id = e.currentTarget.dataset.id;
    if (type == 'edit') {
      wx.navigateTo({
        url: 'invoicedetail/invoicedetail?id=' + id,
      })
    } else {  //删除
      var index = e.currentTarget.dataset.index;
      var param = {
        page_code: "p006",
        type: type,
        invoice_id: id
      };
      var params = {
        url: app.globalData.domainUrl,
        data:param,
        method:'POST',
        sCallback: function (res) {
          that.setData({
            items: that.deleteItem(that.data.items, index)
          });
        }
      };
      base.httpRequest(params);
    }
  },
  deleteItem: function (data, delIndex) {
    var temArray = [];
    for (var i = 0; i < data.length; i++) {
      if (i != delIndex) {
        temArray.push(data[i]);
      }
    }
    return temArray;
  },
  /**
   * 选择为发票为订单发票
   */
  checkSendInvoice: function (e) {
    let index = e.currentTarget.dataset.index;
    let items = that.data.items;
    // let check = items[index].checked;
    items[index].checked = !items[index].checked;
    if (items[index].checked) {
      wx.showModal({
        title: '提示',
        content: '确定使用该发票信息？',
        success: function (res) {
          if (res.confirm) {
            that.checkInvoice(e.currentTarget.dataset.value);
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
    that.setData({
      items: items
    });
  },

  //提交信息
  checkInvoice: function (invoice_id) {
    var pagesArr = getCurrentPages();
    pagesArr[pagesArr.length - 2].setData({
      invoiceId: invoice_id,
    });
    wx.navigateBack({
      delta: 1,
    });
  },

})


