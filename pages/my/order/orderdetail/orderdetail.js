// pages/home/home.js
var that;
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_id: 0,
    from_page:'',
    currentTab: '0',
    indicatorDots: true,
    indicatorColor: "#000000",
    indicatorActiveColor: "#b7aa00",
    autoplay: true,
    interval: 3000,
    duration: 500,
    circular: true,
    items: [],
    // address: [],
    transform:[],
    orderAmount:0,
    rateAmount:0,
    customerInfo: [],
    finalSum: 0,   //使用积分后的实付款
    usingPoint:0   //使用积分值

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    console.log('onload:----');
    console.log(options.order_id);
    that.setData({
      order_id: options.order_id,
      from_page: options.from_page
    });

    if (wx.getStorageSync('customerId')) {
      var param = {
        page_code: 'p004',
        type: "mainCustomer",
        customer_id: wx.getStorageSync('customerId')
      };
      // var param = '/p004?type=mainCustomer&customer_id='+ wx.getStorageSync('customerId');
      that.getUserDetail(param);
    }
    //查询积分是否可抵用
    var transformParam = {
      page_code: 'p017',
      code: 'jf01'
    };
    // var transformParam = '/p017?code=jf01';
    that.getTransform(transformParam);

    //获取订单详情
    var param_o = {
      page_code: 'p008',
      has_address:1,   //查询该订单使用地址
      order_id: that.data.order_id
    };
    // var param_o = '/p008?has_address=1&order_id='+that.data.order_id;
    that.getOrder(param_o);
    // that.getAddress();
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
    console.log('orderdetail onUnload:====');
    console.log(that.data.from_page);
    if (that.data.from_page == 'shopping'){
      var pages = getCurrentPages();  // 当前页的数据，可以输出来看看有什么东西
      var prevPage = pages[pages.length - 2];  // 上一页的数据，也可以输出来看看有什么东西
      /** 设置数据 这里面的 value 是上一页你想被携带过去的数据，后面是本方法里你得到的数据，我这里是detail.value，根据自己实际情况设置 */
      prevPage.setData({
        isBack: false,
      })
    }
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

  //获取用户信息 ：积分 等
  getUserDetail: function (param) {
    wx.request({
      url: app.globalData.domainUrl,
      data: param,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          customerInfo: res.data.data
        });
      }
    });
  },

  getTransform: function(param){
    wx.request({
      url: app.globalData.domainUrl,
      data: param,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var datas = res.data.data;
        that.setData({
          transform: datas[0]
        })
      }
    });

  },

  getOrder: function (param) {  //读取订单
    wx.request({
      url: app.globalData.domainUrl,
      data: param,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var datas = res.data.data;
        that.setData({
          items: datas
        });
        var order_amount = that.data.items[0].frozeno_order_amount;

        that.setData({
          orderAmount: order_amount,
          rateAmount: (order_amount * (that.data.transform.rate / 100))
        });
        // console.log('getOrder:----------');
        // console.log((parseFloat(order_amount) >= parseFloat(that.data.transform.satisfy_amount)));
        // console.log(that.data.transform.type);
        
        if ((parseFloat(order_amount) >= parseFloat(that.data.transform.satisfy_amount)) && that.data.transform.type == 2) {
          that.sumAmount(that.data.customerInfo.point, that.data.rateAmount, that.data.orderAmount);
        } else if ((parseFloat(order_amount) < parseFloat(that.data.transform.satisfy_amount)) && that.data.transform.type == 2) {
          that.sumAmount(0, that.data.rateAmount, that.data.orderAmount);
        } else if (that.data.transform.type == 1) {
          that.sumAmount(that.data.customerInfo.point, that.data.rateAmount, that.data.orderAmount);
        }

      }
    });
  },
  sumAmount: function (point, rateAmount, amount) {
    // console.log('sumAmount:----------');
    // console.log(parseFloat(point) >= parseFloat(rateAmount));
    if (parseFloat(point) >= parseFloat(rateAmount)) {
    that.setData({
      usingPoint: rateAmount,
      finalSum: parseFloat(amount) - parseFloat(rateAmount)
    });
  } else {
    that.setData({
      usingPoint: point,
      finalSum: parseFloat(amount) - parseFloat(point)
    });
    }
    console.log('finalSum:----------');
    console.log(that.data.finalSum);
},

// getAddress: function(){
//   wx.request({
//     url: app.globalData.domainUrl,
//     data: {
//       page_code: 'p002',
//       customer_id: wx.getStorageSync('customerId')
//     },
//     header: {
//       'content-type': "application/json"
//     },
//     success: function (res) {
//       console.log(res);
//       var datas = res.data.data;
//       if (datas.length > 0){
//         that.setData({
//           address: datas[0]
//         });
//       }
//     }
//   })
// },
//取消订单
  cancelOrder: function(){
    wx.request({
      url: app.globalData.domainUrl,
      method: "POST",
      data: {
        page_code: 'p008',
        type: 'cancel',
        order_id: that.data.items[0].o_id,
        order_type: that.data.items[0].frozeno_order_state
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res);
        var datas = res.data.data;
        if (datas) {
          wx.showToast({
            title: res.data.message
          });
          wx.navigateBack({
            delta: 1
          })
        }
      }
    })
  },
  //付款   商户在小程序中先调用该接口在微信支付服务后台生成预支付交易单，返回正确的预支付交易后调起支付。
  payOrder:function(){
    if (wx.getStorageSync('customerId')){
      if(that.data.items[0].frozeno_order_amount == 0){
        that.payAfter();
      }else{
        wx.request({
          url: app.globalData.domainUrl,
          method: "POST",
          data: {
            page_code: 'p008',
            type: 'unifiedorder',  
            amount: that.data.items[0].frozeno_order_amount,
            openid: wx.getStorageSync('openid')
          },
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          success: function (res) {
            console.log(res);
            var datas = res.data.data;
            if (datas) {
              console.log(datas);
              wx.requestPayment({
                'timeStamp': datas.timeStamp,
                'nonceStr': datas.nonceStr,
                'package': datas.package,
                'signType': 'MD5',
                'paySign': datas.paySign,
                'success': function (res) {
                  console.log('success');
                  wx.showToast({
                    title: '支付成功',
                    icon: 'success',
                    duration: 3000
                  });
                  that.payAfter();
                },
                'fail': function (res) {
                  console.log(res);
                },
                'complete': function (res) {
                  console.log('complete');
                }
              });
            }
          }
        })
      }
    }else{
      wx.showToast({
        title: "请先登录"
      });
    }
  },

  //付款成功则修改订单状态。
  payAfter: function () {
    if (wx.getStorageSync('customerId')) {
      wx.request({
        url: app.globalData.domainUrl,
        method: "POST",
        data: {
          page_code: 'p008',
          type: 'pay',
          order_id: that.data.items[0].o_id,
          amount: that.data.items[0].frozeno_order_amount,
          customer_id: wx.getStorageSync('customerId')
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          console.log(res);
          var ret = res.data;
          var datas = ret.data;
          if (ret.code == 201) {
            console.log(ret.message);
            // that.setData({
            //   shopping_count: parseInt(that.data.shopping_count) + 1
            // });
          }else{
            wx.navigateBack({
              delta: 1
            })
          }
        }
      })
    } else {
      wx.showToast({
        title: "请先登录"
      });
    }
  },
  copyInfo:function(e){  //复制内容
    var code = e.target.dataset.code;
    wx.setClipboardData({
      data: code,
      success: function (res) {
        console.log('copyCode:------');
        console.log(res);
        wx.showToast({
          title: "复制成功"
        });
      }
    })
  },
  //确认收货
  confirm:function(){
    wx.request({
      url: app.globalData.domainUrl,
      method: "POST",
      data: {
        page_code: 'p008',
        type: 'receive',
        order_id: that.data.items[0].o_id
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res);
        var datas = res.data.data;
        if (datas) {
          wx.showToast({
            title: res.data.message
          });
          wx.navigateBack({
            delta: 1
          })
        }
      }
    })
  },
  
})