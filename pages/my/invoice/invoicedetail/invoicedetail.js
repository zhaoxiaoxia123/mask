// pages/info/info.js
var that;
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    items: [],
    invoiceId: 0,
    username: '',
    taxNumber: '',
    phone: '',
    address: '',
    bank: '',
    bankccount: '',
    isClick:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("onLoad");
    that = this;

    var id = options.id;
    that.setData({
      invoiceId: id ? id : 0
    });
    if (that.data.invoiceId) {
      // var param = '/p006?invoice_id='+that.data.invoiceId;
      wx.request({
        url: app.globalData.domainUrl,
        data: {
          page_code: "p006",
          invoice_id: that.data.invoiceId
        },
        header: {
          'content-type': "application/json"
        },
        success: function (res) {
          console.log(res);
          var datas = res.data.data;
          that.setData({
            username: datas.username,
            phone: datas.phone,
            taxNumber: datas.tax_number,
            address: datas.address,
            bank: datas.bank,
            bankAccount: datas.bank_account
          });
        }
      })
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
  setUsernameInput: function (e) {
    that.setData({
      username: e.detail.value
    })
    that.hasClick();
  },
  setPhoneInput: function (e) { 
    let value = this.validateNumber(e.detail.value)
    console.log(value);
    this.setData({
      phone:value
    })
    that.hasClick();
  },
  setAddressInput: function (e) {
    that.setData({
      address: e.detail.value
    })
    that.hasClick();
  },
  setTaxNumberInput: function (e) {
    that.setData({
      taxNumber: e.detail.value
    })
    that.hasClick();
  },
  setBankInput: function (e) {
    that.setData({
      bank: e.detail.value
    })
    that.hasClick();
  },
  setBankAccountInput: function (e) {
    let value = this.validateNumber(e.detail.value)
    console.log(value);
    this.setData({
      bankAccount:value
    })
    that.hasClick();
  },
//所有值存在才让确认按钮可点击
hasClick:function(){
  if(that.data.name && that.data.phone && that.data.address && that.data.zip && that.data.region){
    that.setClickState(true);
  }else {
    that.setClickState(false);
  }
},
//是否让确认按钮可点击
setClickState:function(value){
  that.setData({
    isClick:value
  });
},
validateNumber(val) {
  return val.replace(/\D/g, '')
},

  //删除发票信息
  deleteInvoice:function(){
    if (wx.getStorageSync('customerId') && !wx.getStorageSync('get_user_info') && !wx.getStorageSync('get_phone_info')) {
      wx.showModal({
        title: '提示',
        content: '你确定要删除该发票信息？',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定');
            var param = {
              page_code: "p006",
              type: "delete",
              invoice_id: that.data.invoiceId
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
                if (datas) {
                  wx.navigateBack({
                    delta: 1
                  });
                }
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      
    } else {
      wx.showModal({
        title: '提示',
        content: '请完成授权后再编辑信息。',
        showCancel: false
      });
    }
  },
  //提交发票信息
  submitInvoice: function () {
    if (wx.getStorageSync('customerId') && !wx.getStorageSync('get_user_info') && !wx.getStorageSync('get_phone_info')){
      that.setClickState(false);
    var param = {
      page_code: "p006",
      type: "edit",
      username: that.data.username,
      phone: that.data.phone,
      tax_number: that.data.taxNumber,
      address: that.data.address,
      bank: that.data.bank,
      bank_account: that.data.bankAccount,
      customer_id: wx.getStorageSync('customerId'),
      invoice_id: that.data.invoiceId
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
        that.setClickState(true);
        if (datas) {
          wx.navigateBack({
            delta: 1
          });
        }
      }
    })

    } else {
      wx.showModal({
        title: '提示',
        content: '请完成授权后再编辑信息。',
        showCancel: false
      });
    }
  },
})