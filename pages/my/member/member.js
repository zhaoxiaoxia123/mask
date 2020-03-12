// member.js
var wxbarcode = require('../../../utils/index.js');
var that;
var app = getApp();
Page({
  name: "member",
  /**
   * 页面的初始数据
   */
  data: {
    canInterval: true, //判断能不能轮询，作用是控制小程序切换到后台时不进行轮训
    code: '', // 转换成条形码、二维码的数字
    codeStr: '',
    count: 0,
    memberId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    that = this;
    if (wx.getStorageSync('memberNo')) {
      that.setData({
        memberId: wx.getStorageSync('memberNo')
      });
      that.writeCode(wx.getStorageSync('memberNo'));
    }
    that.getWxTicket();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //修改顶部标题栏信息
    wx.setNavigationBarTitle({
      title: '会员码'
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    that = this;
    that.setData({
      canInterval: true
    });
    var param = {
      page_code:'p004',
      customer_id: wx.getStorageSync('customerId')
    };
    console.log('onShow:------');
    console.log(that.data.code);
    that.data.code && that.getStatus(param);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    that.setData({
      canInterval: false
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    that.setData({
      canInterval: false
    })
  },

  //以下为自定义点击事件
  registerMember: function () {  //注册会员号
    wx.request({
      url: app.globalData.domainUrl,
      method: "POST",
      data: {
        page_code: "p011",
        open_id: wx.getStorageSync('openid'),
        customer_id: wx.getStorageSync('customerId')
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        wx.setStorageSync('memberNo', res.data.data.number);
        that.setData({
          memberId: wx.getStorageSync('memberNo')
        });
        that.writeCode(wx.getStorageSync('memberNo'));
        //
        // //添加到微信卡券  "code": "", "openid": "",
        // // var signature,timestamp = that.signature(res.data.number);
        // var cardExt = {
        //     "code":res.data[0].code,
        //     "openid":res.data[0].openid,
        //     "timestamp":res.data[0].timestamp,
        //     "nonce_str":res.data[0].nonce_str,
        //     "signature":res.data[0].signature
        // };
        // var card_id = res.data[0].card_id;
        // console.log(card_id);
        // wx.addCard({
        //     cardList: [
        //         {
        //             cardId: card_id,
        //             cardExt: JSON.stringify(cardExt)
        //         }
        //     ],
        //     success: function(res) {
        //         console.log(res)
        //     // this.addCardSuccess(res.cardList[0].code)
        //     },
        //     fail: function(err) {
        //         console.log(err)
        //     }
        // })
      }
    })
  },
  writeCode: function (memberId) {  //在页面上打印条形码和二维码
    var code = memberId;
    var url_member_id = app.globalData.domainUrl + "?is_scan=1&customer_id=" + wx.getStorageSync('customerId');
    wxbarcode.barcode('barcode', url_member_id, 680, 200);
    wxbarcode.qrcode('qrcode', url_member_id, 420, 420);
    const codeStr = code;//`${code.slice(0, 4)}****${code.slice(12)}`;
    that.setData({
      code,
      codeStr
    });
  },
  getStatus: function (param) {
    wx.request({
      url: app.globalData.domainUrl,
      method: 'GET',
      data: param,
      success: function (res) {
        if (res.data.data.is_scan) {
          // 支付成功后的操作
          that.setData({
            canInterval: false
          })
        }
        // 还未支付并且允许轮训的话就继续轮训
        if (that.data.canInterval) {
          setTimeout(function () {
            that.getStatus(param);
          }, 1000 * 10);
        }
      }
    })
  },

  getWxTicket: function () {
    var openid = wx.getStorageSync('openid');
    wx.request({
      url: app.globalData.domainUrl,
      method: 'POST',
      data: {
        page_code:'p013',
        openid: openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res);
        let datas = res.data.data;
        if (datas.length != 0) {
          //wx.addCard也就是微信小程序的API，地址：https://developers.weixin.qq.com/miniprogram/dev/api/card.html#wxaddcardobject
          wx.addCard({
            cardList: [datas],
            success: function (rs) {
              console.log(rs) // 卡券添加结果
            }
          })
        } else {
          // wx.showModal 弹窗
          wx.showModal({
            title: '提示',
            content: datas,
            showCancel: false,
            success: function (res1) {
              console.log(res1);
            }
          })
        }
      }
    })

    //添加到微信卡券  "code": "", "openid": "",
    // var signature,timestamp = that.signature(res.data.number);
    // var cardExt = {
    //     "code":"481663228286",
    //     "openid":"opeQs5EA92h-lULhJuuolXhvkdMo",
    //     "timestamp":1581841487,
    //     "nonce_str":"1581841488",
    //     "signature":"bcaa8142efef65fbe6675ce6bb442fd1e921b4b2"
    // };
    // var card_id = "001";
    // console.log(card_id);
    // wx.addCard({
    //     cardList: [
    //         {
    //             cardId: card_id,
    //             cardExt: JSON.stringify(cardExt)
    //         }
    //     ],
    //     success: function(res) {
    //         console.log(res)
    //         // this.addCardSuccess(res.cardList[0].code)
    //     },
    //     fail: function(err) {
    //         console.log(err)
    //     }
    // })
  }
})
