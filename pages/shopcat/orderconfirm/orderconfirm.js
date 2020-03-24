// pages/info/info.js
var that;
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    products: '',
    items: [], //商品
    address: [], //地址
    transform: [], //积分设置
    customerInfo: [], //用户信息
    ticketList: [], //卡券
    productAmount: 0, //商品未做任何折扣和抵扣的总价
    discountAmount: 0, //商品会员折扣后的总价
    payAmount: 0, //使用积分后的实付款
    usingPoint: 0, //使用积分值
    usingTicketAmount: 0, //使用优惠券的抵扣值
    isUsePoint: false,
    isCheckTicket: 9999 //存储选择卡券索引  9999为不用卡券
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
    that.getAddress(); //获取用户设置的默认地址
    that.getTicketList(); //获取卡券列表
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    console.log('onhide');
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    console.log('onUnload');
    let pages = getCurrentPages();  // 当前页的数据，可以输出来看看有什么东西
    let prevPage = pages[pages.length - 2];  // 上一页的数据，也可以输出来看看有什么东西
    /** 设置数据 这里面的 value 是上一页你想被携带过去的数据，后面是本方法里你得到的数据，我这里是detail.value，根据自己实际情况设置 */
    prevPage.setData({
      isBack: true,
    })
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

  checkboxChange: function(e) {
    console.log('checkbox发生change事件，携带value值为：', e.target.dataset.type)
    if (e.target.dataset.type == 'isUsePoint') {
      that.setData({
        isUsePoint: !that.data.isUsePoint
      })
      that.sumUsingPoint(); //计算可用的积分数,并抵扣后获得实付款
    } else if (e.target.dataset.type == 'isCheckTicket') {
      that.setData({
        isCheckTicket: (e.target.dataset.v == that.data.isCheckTicket ? 9999 : e.target.dataset.v)
      })
    }


  },

  //添加默认收货地址
  goAddress: function() {
    wx.navigateTo({
      url: '/pages/my/address/addressdetail/addressdetail' //?products=' + that.data.products,
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
        setTimeout(function() {
          that.sumProductAmount(that.data.items, that.data.customerInfo);
        }, 1000)

      }
    });
  },

  //计算商品总价
  sumProductAmount: function(pInfo, cInfo) {
    console.log('pInfo:----');
    console.log(pInfo);
    var productAmount = 0;
    for (var i = 0; i < pInfo.length; i++) {
      console.log('ii:----');
      console.log((parseFloat(pInfo[i]['discount_amount']) * pInfo[i]['join_product_count']));
      productAmount += (parseFloat(pInfo[i]['discount_amount']) * pInfo[i]['join_product_count']);
      console.log('productAmount:----');
      console.log(productAmount);
    }
    //商品总价会员折扣后的价格
    var discountAmount = productAmount - (cInfo.discount != 0 ? (productAmount * (cInfo.discount / 100)).toFixed(2) : 0);

    console.log('discountAmount:----');
    console.log(discountAmount);
    //商品总价
    that.setData({
      productAmount: productAmount,
      discountAmount: discountAmount,
      payAmount: discountAmount
    });
  },
  //计算可用的积分数,并抵扣后获得实付款
  sumUsingPoint: function() {
    var cInfo = that.data.customerInfo;
    var tInfo = that.data.transform;
    var pInfo = that.data.items;
    that.sumProductAmount(pInfo, cInfo); //获取商品总价
    var tPayAmount = that.sumCheckTicket(); //减卡券价值后的总价

    var discountAmount = tPayAmount; //that.data.discountAmount;
    var productAmount = that.data.productAmount;
    console.log(productAmount);
    console.log(discountAmount);
    var payAmount = 0; //实付款
    console.log(cInfo.point);
    console.log(tInfo.type == 2);
    if (cInfo.point > 0 && that.data.isUsePoint) {
      if (tInfo.type == 2) { //若满减
        console.log("若满减:----");
        console.log(productAmount);
        console.log(productAmount);
        console.log(productAmount >= tInfo.satisfy_amount);
        if (productAmount >= tInfo.satisfy_amount) { //商品总价是否大于等于满减金额设置
          that.sumAmount(cInfo.point, tInfo.rate, discountAmount);
        } else { //小于：则不可使用积分。
          that.setData({
            usingPoint: 0,
            payAmount: parseFloat(discountAmount)
          });
        }
      } else if (tInfo.type == 1) {
        that.sumAmount(cInfo.point, tInfo.rate, discountAmount);
      }
    } else {
      that.setData({
        usingPoint: 0,
        payAmount: parseFloat(discountAmount)
      });
    }
  },

  //计算使用卡券后的付款金额
  sumCheckTicket: function() {
    var productAmount = that.data.productAmount; //商品总价
    var discountAmount = that.data.discountAmount; //商品会员折扣后的总价
    var tIndex = that.data.isCheckTicket - 1; //选中卡券索引
    var usingTicketAmount = 0;
    console.log('tIndex:----');
    console.log(tIndex);
    if (tIndex != 9998) { //上面索引减了个1
      var tList = that.data.ticketList; //卡券列表
      var payAmount = 0;
      console.log('sumCheckTicket:----');
      console.log(tList);
      console.log(tIndex);
      if (tList[tIndex]['ticket_type'] == 1) { //通用
        usingTicketAmount = tList[tIndex]['ticket_amount'];
        payAmount = discountAmount - tList[tIndex]['ticket_amount'];
      } else if (tList[tIndex]['ticket_type'] == 2) { //满减
        if (productAmount >= tList[tIndex]['satisfy_amount']) {
          usingTicketAmount = tList[tIndex]['ticket_amount'];
          payAmount = discountAmount - tList[tIndex]['ticket_amount'];
        } else {
          payAmount = discountAmount;
        }
      }
      that.setData({
        payAmount: parseFloat(payAmount),
        usingTicketAmount: usingTicketAmount
      });
    } else {
      that.setData({
        payAmount: discountAmount,
        usingTicketAmount: 0
      });
    }
    return that.data.payAmount;
  },
  /**
   * 最终计算实付款
   * point： 用户积分数
   * rate:   transform表设置的积分抵扣价格的百分比例
   * discountAmount：  商品的会员折扣价格
   */
  sumAmount: function(point, rate, discountAmount) {
    //可抵用积分数
    var usingPoint = (discountAmount * (parseFloat(rate) / 100));
    console.log('sumAmount:----------');
    console.log(parseFloat(point) >= parseFloat(usingPoint));
    if (parseFloat(point) >= parseFloat(usingPoint)) { //用户积分大于等于可抵用积分数
      that.setData({
        usingPoint: usingPoint,
        payAmount: parseFloat(discountAmount) - parseFloat(usingPoint)
      });
    } else {
      that.setData({
        usingPoint: point, //可用积分为用户积分值
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
  getTicketList: function() { //获取有效卡券列表
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
      success: function(res) {
        var datas = res.data.data;
        that.setData({
          ticketList: datas
        });
      }
    });

  },

//提交订单
  confirmPay:function(){
    var ticket_id = that.data.isCheckTicket == 9999 ? 0 : that.data.ticketList[that.data.isCheckTicket - 1]['ticket_id'];
    wx.request({
      url: app.globalData.domainUrl,
      method: "POST",
      data: {
        page_code: 'p008',
        type:'shopping_by',
        products:that.data.products,//JSON.stringify(products),
        ticket_id: ticket_id,
        customer_addr_id: that.data.address.customer_addr_id,
        use_point: that.data.usingPoint,
        order_type: 1,//购买订单
        customer_id: wx.getStorageSync('customerId'),
        amount: that.data.payAmount,
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res);
        var datas = res.data.data;
        wx.showToast({
          // icon: "none",
          title: res.data.message
        });
        //此处跳出来支付。调用微信支付
        if(res.data.code == 200){
          wx.redirectTo({
            url: '/pages/my/order/orderdetail/orderdetail?order_id=' + datas +'&from_page=shopping',
          })
        }
      }
    })
  },

// submitSettlementGenerateOrder: function(){  //提交结算，生成多商品同时结算的订单信息，
  //   var products = [];
  //   // var product_id = ",";
  //   // var product_count = ",";
  //   // var product_amount = ",";
  //   for (var i = 0; i < that.data.items.length; i++) {
  //     if (that.data.items[i].selected == true) {
  //       var info = {
  //         'product_id': that.data.items[i].product_id, 
  //         'product_count': that.data.items[i].product_count,
  //         'discount_amount': that.data.items[i].discount_amount
  //         };
  //       // product_id += that.data.items[i].product_id+',';
  //       // product_count += that.data.items[i].product_count + ',';
  //       // if(that.data.memberNo){
  //       //   product_amount += that.data.items[i].discount_amount + ',';
  //       // } else {
  //       //   product_amount += that.data.items[i].amount + ',';
  //       // }
  //       products.push(info);
  //     }
  //   }
  //   if (products.length > 0){
  //   wx.request({
  //     url: app.globalData.domainUrl,
  //     method: "POST",
  //     data: {
  //       page_code: 'p008',
  //       type:'shopping_by',
  //       products:JSON.stringify(products),
  //       // product_id: product_id,
  //       // product_count: product_count,
  //       // product_amount: product_amount,
  //       // ticket_id: that.data.selectedTicketId,
  //       order_type: 1,//购买订单
  //       customer_id: wx.getStorageSync('customerId'),
  //       // is_customer: wx.getStorageSync('memberNo') ? 1 : 2,
  //       amount: that.data.totalfee,
  //     },
  //     header: {
  //       "Content-Type": "application/x-www-form-urlencoded"
  //     },
  //     success: function (res) {
  //       console.log(res);
  //       var datas = res.data.data;
  //      // getApp().globalData.orderId = datas.order_id;
  //       // var url = '/pages/shopcat/orderconfirm/orderconfirm';
  //       // console.log(url);
  //       // wx.navigateTo({
  //       //   url: url
  //       // });
  //       wx.showToast({
  //         icon: "none",
  //         title: res.data.message
  //       });
  //       wx.navigateTo({
  //         // url: '/pages/my/order/orderdetail/orderdetail?order_id=' + datas,
  //         url: '/pages/shopcat/orderconfirm/orderconfirm?order_id=' + datas,
  //       })
  //     }
  //   })
  //   }else{
  //     wx.showToast({
  //       icon: "none",
  //       title: "请选择结算的商品"
  //     });
  //   }
  // },


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

    that.setData({
      flexwindow: flexwindow
    })
  },

  //卡券弹框关闭
  close1: function(e) {
    let couponflexwindow = false;
    that.setData({
      couponflexwindow: couponflexwindow
    })
    //计算实付款
    that.sumUsingPoint();
  },



})