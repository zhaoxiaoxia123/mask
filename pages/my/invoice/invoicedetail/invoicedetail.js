// pages/info/info.js
var that;
var base = require('../../../../utils/base.js');
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
    isHasSubmit:false,//判断是否提交过一次
    isShowNameTip:false,
    isShowTaxNumberTip:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    var id = options.id;
    that.setData({
      invoiceId: id ? id : 0
    });
    if (that.data.invoiceId) {
      // var param = '/p006?invoice_id='+that.data.invoiceId;
      // wx.request({
      //   url: app.globalData.domainUrl,
      //   data: {
      //     page_code: "p006",
      //     invoice_id: that.data.invoiceId
      //   },
      //   header: {
      //     'content-type': "application/json"
      //   },
      //   success: function (res) {
      //     console.log(res);
      //     var datas = res.data.data;
      //     that.setData({
      //       username: datas.username,
      //       phone: datas.phone,
      //       taxNumber: datas.tax_number,
      //       address: datas.address,
      //       bank: datas.bank,
      //       bankAccount: datas.bank_account
      //     });
      //   }
      // })

      let param =  {
        page_code: "p006",
        invoice_id: that.data.invoiceId
      };
      var params = {
        url: app.globalData.domainUrl,
        data:param,
        method:'GET',
        sCallback: function (res) {
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
      };
      base.httpRequest(params);

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
    that.isShowTip('name');
  },
  setTaxNumberInput: function (e) {
    that.setData({
      taxNumber: e.detail.value
    })
    that.isShowTip('taxNumber');
  },
  setPhoneInput: function (e) { 
    let value = that.validateNumber(e.detail.value)
    that.setData({
      phone:value
    })
  },
  setAddressInput: function (e) {
    that.setData({
      address: e.detail.value
    })
  },
  setBankInput: function (e) {
    that.setData({
      bank: e.detail.value
    })
  },
  setBankAccountInput: function (e) {
    let value = this.validateNumber(e.detail.value)
    this.setData({
      bankAccount:value
    })
  },
  validateNumber(val) {
    return val.replace(/\D/g, '')
  },
  
  //是否显示提示
  isShowTip:function(type,value=0){
    if(type == 'name'){
      if(that.data.username.length == 0 && that.data.isHasSubmit){
        that.setData({isShowNameTip:true});
      }else{
        that.setData({isShowNameTip:false});
      }
    }else if(type == 'taxNumber'){
      if(that.data.taxNumber.length == 0 && that.data.isHasSubmit){
        that.setData({isShowTaxNumberTip:true});
      }else{
        that.setData({isShowTaxNumberTip:false});
      }
    }else if(type == 'submit'){
      that.setData({
        isHasSubmit:value
      });
    }
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
            var params = {
              url: app.globalData.domainUrl,
              data:param,
              method:'POST',
              sCallback: function (res) {
                console.log(res);
                var datas = res.data.data;
                if (datas) {
                  wx.navigateBack({
                    delta: 1
                  });
                }
              }
            };
            base.httpRequest(params);
      
            // wx.request({
            //   url: app.globalData.domainUrl,
            //   method: "POST",
            //   data: param,
            //   header: {
            //     "Content-Type": "application/x-www-form-urlencoded"
            //   },
            //   success: function (res) {
            //     console.log(res);
            //     var datas = res.data.data;
            //     if (datas) {
            //       wx.navigateBack({
            //         delta: 1
            //       });
            //     }
            //   }
            // })
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
  //  提示消息
  //  单位名称：请输入单位名称
  //  税号：纳税人识别号错误，请检查重新输入
  //提交发票信息
  submitInvoice: function () {
    if (wx.getStorageSync('customerId') && !wx.getStorageSync('get_user_info') && !wx.getStorageSync('get_phone_info')){
      that.isShowTip('submit',true);
      if (that.data.username.length <= 5){
        wx.showModal({
          title: '提示',
          content: '请输入单位名称',
          showCancel: false
        });
        return false;
      } else if (that.data.taxNumber.length == 0){
        wx.showModal({
          title: '提示',
          content: '请输入纳税人识别号',
          showCancel: false
        });
        return false;
      } else if (that.data.taxNumber.length != 15 && that.data.taxNumber.length != 18 && that.data.taxNumber.length != 20){
        wx.showModal({
          title: '提示',
          content: '请输入正确位数的纳税人识别号',
          showCancel: false
        });
        return false;
      }
    var param = {
      page_code: "p006",
      type: "edit",
      username: that.data.username,
      phone: that.data.phone,
      tax_number: that.data.taxNumber,
      address: that.data.address,
      bank: that.data.bank,
      bank_account: that.data.bankAccount?that.data.bankAccount:'',
      // customer_id: wx.getStorageSync('customerId'),
      invoice_id: that.data.invoiceId
    };
    console.log(param);

    var params = {
      url: app.globalData.domainUrl,
      data:param,
      method:'POST',
      sCallback: function (res) {
        console.log(res);
        var datas = res.data.data;
        if (datas) {
          wx.navigateBack({
            delta: 1
          });
        }
      }
    };
    base.httpRequest(params);
    // wx.request({
    //   url: app.globalData.domainUrl,
    //   method: "POST",
    //   data: param,
    //   header: {
    //     "Content-Type": "application/x-www-form-urlencoded"
    //   },
    //   success: function (res) {
    //     console.log(res);
    //     var datas = res.data.data;
    //     if (datas) {
    //       wx.navigateBack({
    //         delta: 1
    //       });
    //     }
    //   }
    // })

    } else {
      wx.showModal({
        title: '提示',
        content: '请完成授权后再编辑信息。',
        showCancel: false
      });
    }
  },
})

