// pages/info/info.js
var that;
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    products: '',
    items: [],   //商品
    address: [],   //地址
    transform: [],   //积分设置
    customerInfo: [],  //用户信息
    ticketList: [],   //卡券
    productAmount: 0,  //商品未做任何折扣和抵扣的总价
    discountAmount: 0,  //商品会员折扣后的总价
    payAmount: 0, //使用积分后的实付款
    usingPoint: 0, //使用积分值
    isUsePoint:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    that.setData({
      products: options.products //获取上一页传来的商品id和数量，如：1,2--3,4--15,2--
    });
    // console.log(options.products);
    // var product_ids = '';
    // var product_count = '';
    // if (that.data.products.length >= 5) {
    //   var pros = that.data.products.split("--");
    //   for (var i = 0; i < pros.length; i++) {
    //     if (pros[i]){
    //       var p = pros[i].split(',');
    //       product_ids += p[0] + ',';
    //       product_count += p[1] + ',';
    //     }
    //   }
    // }
    // that.setData({
    //   product_ids: product_ids,
    //   product_count: product_count
    // });
    // console.log(product_ids);
    // console.log(product_count);
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (wx.getStorageSync('customerId')) {
      var param = {
        page_code: 'p004',
        type: "mainCustomer",
        customer_id: wx.getStorageSync('customerId')
      };
      that.getUserDetail(param);
    }
    //查询积分是否可抵用
    var transformParam = {
      page_code: 'p017',
      code: 'jf01'
    };
    that.getTransform(transformParam);

    //获取商品信息
    var param = {
      page_code: 'p005',
      type: "confirmProduct",
      products: that.data.products
    };
    that.getProducts(param);
    that.getAddress();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.target.dataset.type)
    if (e.target.dataset.type == 'isUsePoint'){
      that.setData({
        isUsePoint: !that.data.isUsePoint
      })
      that.sumUsingPoint(); //计算可用的积分数,并抵扣后获得实付款
    }


  },

//添加默认收货地址
  goAddress: function(){
    wx.navigateTo({
      url: '/pages/my/address/addressdetail/addressdetail'  //?products=' + that.data.products,
    })
  },

  //获取用户信息 ：积分 等
  getUserDetail: function(param) {
    wx.request({
      url: app.globalData.domainUrl,
      data: param,
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        that.setData({
          customerInfo: res.data.data
        });
      }
    });
  },

  getTransform: function(param) {
    wx.request({
      url: app.globalData.domainUrl,
      data: param,
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        var datas = res.data.data;
        that.setData({
          transform: datas[0]
        })
      }
    });

  },

  getProducts: function(param) { //读取商品信息
    wx.request({
      url: app.globalData.domainUrl,
      data: param,
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        var datas = res.data.data;
        console.log(datas);
        that.setData({
          items: datas
        })
        setTimeout(function(){
          that.sumProductAmount(that.data.items, that.data.customerInfo);
        },1000)
        
      }
    });
  },
  sumProductAmount: function (pInfo, cInfo) {
    console.log('pInfo:----');
    console.log(pInfo);
    var productAmount = 0;
    for (var i = 0; i < pInfo.length; i++) {
      productAmount += parseFloat(pInfo[i]['discount_amount']);
    }
    var discountAmount = cInfo.discount != 0 ? (productAmount * cInfo.discount) : productAmount;  //商品总价会员折扣后的价格

    //商品总价
    that.setData({
      productAmount: productAmount,
      discountAmount: discountAmount,
      payAmount: discountAmount
    });
  },
  //计算可用的积分数,并抵扣后获得实付款
  sumUsingPoint: function(){
    var cInfo = that.data.customerInfo;
    var tInfo = that.data.transform;
    var pInfo = that.data.items;
    that.sumProductAmount(pInfo, cInfo);  //获取商品总价
    var discountAmount = that.data.discountAmount;
    var productAmount = that.data.productAmount;
    var payAmount = 0;//实付款
    if (cInfo.point > 0) {
      if (tInfo.type == 2) { //若满减
        if (productAmount >= tInfo.satisfy_amount) { //商品总价是否大于等于满减金额设置
          that.sumAmount(cInfo.point, tInfo.rate, discountAmount);
        } else {  //小于：则不可使用积分。
          that.setData({
            usingPoint: 0,
            payAmount: parseFloat(discountAmount)
          });
        }
      }else if(tInfo.type == 1) {
        that.sumAmount(cInfo.point, tInfo.rate, discountAmount);
      }
    }else{
      that.setData({
        usingPoint: 0,
        payAmount: parseFloat(discountAmount)
      });
    }
  },
  /**
   * point： 用户积分数
   * rate:   transform表设置的积分抵扣价格的百分比例
   * discountAmount：  商品的会员折扣价格
   */
  sumAmount: function (point, rate, discountAmount) {
    //可抵用积分数
    var usingPoint = (discountAmount * (parseFloat(rate) / 100));  
    console.log('sumAmount:----------');
    console.log(parseFloat(point) >= parseFloat(usingPoint));
    if (parseFloat(point) >= parseFloat(usingPoint)) {  //用户积分大于等于可抵用积分数
      that.setData({
        usingPoint: usingPoint,
        payAmount: parseFloat(discountAmount) - parseFloat(usingPoint)
      });
    } else {
      that.setData({
        usingPoint: point,  //可用积分为用户积分值
        payAmount: parseFloat(discountAmount) - parseFloat(point)
      });
    }

    console.log('payAmount:----------');
    console.log(that.data.payAmount);
  },

  getAddress: function() {
    wx.request({
      url: app.globalData.domainUrl,
      data: {
        page_code: 'p002',
        customer_id: wx.getStorageSync('customerId'),
        is_default: 1
      },
      header: {
        'content-type': "application/json"
      },
      success: function(res) {
        console.log(res);
        var datas = res.data.data;
        if (datas.length > 0) {
          that.setData({
            address: datas[0]
          });
        }
      }
    })
  },
 getTicketList: function () {   //获取有效卡券列表
    console.log(that.data.ticketList);
    console.log(that.data.ticketList.length);
    if (that.data.ticketList.length <= 0){
      //获取卡券列表
      var param_t = {
        page_code: 'p013',
        customer_id: wx.getStorageSync('customerId'),
        offset: 0,
        page: 20
      };
      wx.request({
        url: app.globalData.domainUrl,
        data: param_t,
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          var datas = res.data.data;
          that.setData({
            ticketList: datas
          });
          if (that.data.queryTicketId){
            for (var ei = 0; ei < datas.length; ++ei) {
              if (datas[ei]['ticket_id'] == that.data.queryTicketId) {
                that.setData({
                  selectedTicketId: datas[ei]['ticket_id'],
                  selectedTicketName: datas[ei]['ticket_name'],
                  ticketAmount: datas[ei]['ticket_amount'],
                  selectedTicketType: datas[ei]['ticket_type'],
                  selectedSatisfyAmount: datas[ei]['satisfy_amount'],
                });
              }
            }
          }
          that.setData({
            queryTicketId: 0
          });
          app.globalData.ticketId = 0;  //还原全局变量
        }
      });
    }else{
      that.setData({
        showTicket: that.data.showTicket == "display:flex" ? "display:none" : "display:flex"
      });
    }
  },




  // 配送方式
  delivery: function(e) {
    var flexwindow;
    if (that.data.flexwindow == true) {
      flexwindow = false;
    } else {
      flexwindow = true;
    }
    that.setData({
      flexwindow: flexwindow
    });
  },
  //选择优惠券
  coupon: function(e) {
    var couponflexwindow;
    if (that.data.couponflexwindow == true) {
      couponflexwindow = false;
    } else {
      couponflexwindow = true;
    }
    that.setData({
      couponflexwindow: couponflexwindow
    });
  },
  close: function(e) {
    let flexwindow = false;

    self.setData({
      flexwindow: flexwindow
    })
  },
  close1: function(e) {
    let couponflexwindow = false;

    self.setData({
      couponflexwindow: couponflexwindow
    })
  },



})