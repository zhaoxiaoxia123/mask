// pages/info/info.js
var that;
var app = getApp();
var base = require('../../../utils/base.js');
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
    isCheckTicket: 9999, //存储选择卡券索引  9999为不用卡券
    isCheckExpressCompany: 2, //存储选择快递  9999为随机
    addressId:0,
    invoiceId: 0,
    dry: 998,  //导入仪价格
    invoice:[],
    discount:0,
    experience:0,
    isCheckDry:2, //2：未选中 1：选中导入仪
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    that.setData({
      products: options.products, //获取上一页传来的商品id和数量，如：1,2--3,4--15,2--
      isCheckDry:options.isCheckDry == 'undefined'?2:options.isCheckDry,
      experience : app.globalData.experience_id,
      experience_amount: app.globalData.experience_amount
    });
    console.log('that.data.isCheckDry:----');
    console.log(that.data.isCheckDry);
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
    let pages = getCurrentPages();
    let currPage = pages[pages.length - 1];
    that.setData({
      addressId: currPage.data.addressId,
      invoiceId: currPage.data.invoiceId
    });
    if (wx.getStorageSync('customerId') && !wx.getStorageSync('get_user_info') && !wx.getStorageSync('get_phone_info')) {
      var param = {
        page_code: 'p004',
        type: "mainCustomer",
        // customer_id: wx.getStorageSync('customerId')
      };
      that.getUserDetail(param);
    
      //查询积分是否可抵用
      var transformParam = {
        page_code: 'p017',
        code: 'jf01'
      };
      that.getTransform(transformParam);

      //获取商品信息
      var param_p = {
        page_code: 'p005',
        type: "confirmProduct",
        products: that.data.products,
        // customer_id: wx.getStorageSync("customerId"),
        level: wx.getStorageSync("level")
      };
      that.getProducts(param_p);
      that.getAddress(); //获取用户设置的默认地址
      
      if(that.data.invoiceId){
        that.getInvoice(); //获取用户设置的发票信息
      }
    }
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
    var pages = getCurrentPages();  // 当前页的数据，可以输出来看看有什么东西
    var prevPage = pages[pages.length - 2];  // 上一页的数据，也可以输出来看看有什么东西
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
    if (e.target.dataset.type == 'isUsePoint') {
      that.setData({
        isUsePoint: !that.data.isUsePoint
      });
      that.sumUsingPoint(); //计算可用的积分数,并抵扣后获得实付款
    } else if (e.target.dataset.type == 'isCheckTicket') {
      that.setData({
        isCheckTicket: (e.target.dataset.v == that.data.isCheckTicket ? 9999 : e.target.dataset.v)
      })
    } else if (e.target.dataset.type == 'isCheckExpressCompany') { //配送方式改变
      that.setData({
        isCheckExpressCompany: (e.target.dataset.v == that.data.isCheckExpressCompany ? 9999 : e.target.dataset.v)
      })
    }
  },

  //添加默认收货地址
  goAddress: function() {
    wx.navigateTo({
      url: '/pages/my/address/address?come=order'
    })
  },
  //选择发票
  goInvoice: function () {
    wx.navigateTo({
      url: '/pages/my/invoice/invoice?come=order'
    })
  },

  //获取用户信息 ：积分 等
  getUserDetail: function(param) {
    var params = {
      url: app.globalData.domainUrl,
      data:param,
      method:'GET',
      sCallback: function (res) {
        let datas = res.data.data;
        that.setData({
          customerInfo: datas,
          discount:datas['discount']
        });
        wx.setStorageSync('discount', datas['discount'])
      }
    };
    base.httpRequest(params);
  },

  getTransform: function(param) {
    var params = {
      url: app.globalData.domainUrl,
      data:param,
      method:'GET',
      sCallback: function (res) {
        var datas = res.data.data;
        that.setData({
          transform: datas
        })
      }
    };
    base.httpRequest(params);
  },

  getProducts: function(param) { //读取商品信息
    var params = {
      url: app.globalData.domainUrl,
      data:param,
      method:'GET',
      sCallback: function (res) {
        var datas = res.data.data;
        that.setData({
          items: datas
        });
        setTimeout(function() {
          //计算实付款
          that.sumUsingPoint();
        }, 2000);
      }
    };
    base.httpRequest(params);
  },

  //计算商品总价
  sumProductAmount: function(pInfo, cInfo) {
    var productAmount488 = 0;
    var productAmount = 0;
    var dryCount = 0;
    var dryAmount = 0;   //导入仪不参加任何折扣
    for (var i = 0; i < pInfo.length; i++) {
      var ret = that.returnProductAmountAndDRYCount(pInfo,i);
      // if(pInfo[i]['category_id'] == that.data.experience && parseInt(pInfo[i]['sale']) < parseInt(pInfo[i]['frozeno_promotion_count'])){
      //   productAmount488 += ret['productAmount'];
      // }else{
      if(pInfo[i]['customer_amount'] == that.data.experience_amount && parseInt(pInfo[i]['sale']) < parseInt(pInfo[i]['frozeno_promotion_count'])){
        productAmount488 += ret['productAmount'];
      }else{
        productAmount += ret['productAmount'];
      }
      if((pInfo[i]['customer_amount'] == that.data.experience_amount && parseInt(pInfo[i]['sale']) >= parseInt(pInfo[i]['frozeno_promotion_count'])) || pInfo[i]['customer_amount'] != that.data.experience_amount){
        dryCount += ret['dryCount'];
      }else{
        dryCount += 0;
      }
      dryAmount += ret['dryAmount'];
    }
    //商品总价会员折扣后的价格  productAmount
    var discountAmount = 0;
    if (productAmount != 0){
      discountAmount = (cInfo.discount != 0 ? ((productAmount - (that.data.dry * dryCount)) * (cInfo.discount / 100) + (that.data.dry * dryCount)).toFixed(2) : productAmount);
    }
    
    productAmount = parseFloat(productAmount);
    discountAmount = Math.floor(parseFloat(discountAmount));
    dryAmount = parseFloat(dryAmount);
    var productAmounts = productAmount + dryAmount+productAmount488;
    var discountAmounts = discountAmount + dryAmount+productAmount488;

    //商品总价
    that.setData({
      productAmount: productAmounts,
      discountAmount: discountAmounts,
      payAmount: discountAmounts
    });
    if (that.data.payAmount && !that.data.items.is_have_new_ticket) {
      that.getTicketList(); //获取卡券列表
    }else{
      if (that.data.items.sub_amount != 0){
        //新人使用新人卡券商品总价计算
        that.setData({
          productAmount: productAmounts,
          discountAmount: (discountAmounts - parseFloat(that.data.items.sub_amount)),
          payAmount: (discountAmounts - parseFloat(that.data.items.sub_amount))
        });
      }
    }
  },

  returnProductAmountAndDRYCount: function(pInfo,i){
    var productAmount = 0;
    var dryCount = 0;
    var dryAmount = 0;
    var ret = {};
      if (pInfo[i]['frozeno_is_discount'] == 1){
        if(app.globalData.experience_amount == pInfo[i]['customer_amount']){
          productAmount = (parseFloat(pInfo[i]['customer_amount']) * pInfo[i]['join_product_count']);
          // productAmount = (parseFloat(pInfo[i]['frozeno_discount_amount']) * pInfo[i]['join_product_count']);
        }else{
          productAmount = (parseFloat(pInfo[i]['frozeno_discount_amount']) * pInfo[i]['join_product_count']);
        }
        if (pInfo[i]['frozeno_is_sub_dry'] == 1){
          dryCount = parseInt(pInfo[i]['join_product_count']);
        }
      }else{
        dryAmount = (parseFloat(pInfo[i]['frozeno_discount_amount']) * pInfo[i]['join_product_count']);
      }
      ret['productAmount'] = productAmount;
      ret['dryCount'] = dryCount;
      ret['dryAmount'] = dryAmount;
      return ret;
  },

  //计算可用的积分数,并抵扣后获得实付款
  sumUsingPoint: function() {
    var cInfo = that.data.customerInfo;
    var tInfo = that.data.transform;
    var pInfo = that.data.items.products;
    that.sumProductAmount(pInfo, cInfo); //获取商品总价
    var tPayAmount = that.sumCheckTicket(); //减卡券价值后的总价
    var discountAmount = tPayAmount; //that.data.discountAmount;
    var productAmount = that.data.productAmount;
    var dryAm = 0;
    if(that.data.isCheckDry == 1){
      dryAm = that.data.items.dryInfos.dry_amount;
    }
    if (cInfo.frozeno_point > 0 && that.data.isUsePoint) {
      if (tInfo.type == 2) { //若满减
        if (productAmount >= tInfo.satisfy_amount) { //商品总价是否大于等于满减金额设置
          that.sumAmount(cInfo.frozeno_point, tInfo.rate, discountAmount);
        } else { //小于：则不可使用积分。
          that.setData({
            usingPoint: 0,
            payAmount: parseFloat(discountAmount) + parseInt(dryAm)
          });
        }
      } else if (tInfo.type == 1) {
        that.sumAmount(cInfo.frozeno_point, tInfo.rate, discountAmount);
      }
    } else {
      that.setData({
        usingPoint: 0,
        payAmount: parseFloat(discountAmount) + parseInt(dryAm)
      });
    }
  },

  //计算使用卡券后的付款金额
  sumCheckTicket: function() {
    var productAmount = that.data.productAmount; //商品总价
    var discountAmount = that.data.discountAmount; //商品会员折扣后的总价
    var tIndex = that.data.isCheckTicket - 1; //选中卡券索引
    var usingTicketAmount = 0;
    if (tIndex != 9998) { //上面索引减了个1
      var tList = that.data.ticketList.ticket; //卡券列表
      var payAmount = 0;
      if (tList[tIndex]['ticket_type'] == 1) { //通用
        usingTicketAmount = tList[tIndex]['ticket_amount'];
        payAmount = discountAmount - tList[tIndex]['ticket_amount'];
        if (payAmount < 0){
          payAmount = 0;
        }
      } else if (tList[tIndex]['ticket_type'] == 2) { //满减
        if (productAmount >= tList[tIndex]['satisfy_amount']) {
          usingTicketAmount = tList[tIndex]['ticket_amount'];
          payAmount = discountAmount - tList[tIndex]['ticket_amount'];
          if (payAmount < 0) {
            payAmount = 0;
          }
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
    usingPoint = parseInt(usingPoint);// .toFixed(2);
    var dryAm = 0;
    if (parseFloat(point) >= parseFloat(usingPoint)) { //用户积分大于等于可抵用积分数
      if(that.data.isCheckDry == 1){
        dryAm = that.data.items.dryInfos.dry_amount;
      }
      that.setData({
        usingPoint: usingPoint,
        payAmount: parseFloat(discountAmount) - parseFloat(usingPoint) + parseInt(dryAm)
      });
    } else {
      that.setData({
        usingPoint: point, //可用积分为用户积分值
        payAmount: parseFloat(discountAmount) - parseFloat(point) + parseInt(dryAm)
      });
    }
  },

  getAddress: function () {
    if (wx.getStorageSync('customerId') && !wx.getStorageSync('get_user_info') && !wx.getStorageSync('get_phone_info')){
      var param = {
        page_code: 'p002',
        is_default: 1
      };
    if(that.data.addressId > 0){
      param = {
        page_code: 'p002',
        customer_addr_id: that.data.addressId
      };
    }

    var params = {
      url: app.globalData.domainUrl,
      data:param,
      method:'GET',
      sCallback: function (res) {
        var datas = res.data.data;
        if (datas) {
          if (that.data.addressId > 0) {
            that.setData({
              address: datas
            });
          }else{
            that.setData({
              address: datas[0]
            });
          }
        }
      }
    };
    base.httpRequest(params);
    }
  },
  getInvoice:function(){
    if (wx.getStorageSync('customerId') && that.data.invoiceId > 0) {
      // var param = '/p002?is_default=1&customer_id='+wx.getStorageSync('customerId');
      var param = {
        page_code: 'p006',
        invoice_id: that.data.invoiceId
      };
      var params = {
        url: app.globalData.domainUrl,
        data:param,
        method:'GET',
        sCallback: function (res) {
          var datas = res.data.data;
          if (datas) {
            that.setData({
              invoice: datas
            });
          }
        }
      };
      base.httpRequest(params);
    }
  },
  getTicketList: function() { //获取有效卡券列表
    if (wx.getStorageSync('customerId') && !wx.getStorageSync('get_user_info') && !wx.getStorageSync('get_phone_info')){
    //获取卡券列表
    var param = {
      page_code: 'p013',
      // customer_id: wx.getStorageSync('customerId'),
      amount: that.data.payAmount,
      is_show_amount:0,  //是否展示新会员卡券
      ticket_state:1,
      offset: 0,
      page: 20
    };
        
    var params = {
      url: app.globalData.domainUrl,
      data:param,
      method:'GET',
      sCallback: function (res) {
        var datas = res.data.data;
        that.setData({
          ticketList: datas
        });
      }
    };
    base.httpRequest(params);
    }
  },

//提交订单
  confirmPay:function(){
    if (wx.getStorageSync('customerId') && !wx.getStorageSync('get_user_info') && !wx.getStorageSync('get_phone_info')){
      if (! that.data.address){
        wx.showToast({
          icon: "none",
          title: "请选择收货地址。"
        });
      }else{
        var ticket_id = that.data.isCheckTicket == 9999 ? 0 : that.data.ticketList.ticket[that.data.isCheckTicket - 1]['ticket_id'];
        if (that.data.items.ticket.ticket_id && ticket_id == 0){  //使用新人卡券时候存在的值
          ticket_id = that.data.items.ticket.ticket_id;
        }

        let param = {
          page_code: 'p008',
          type:'shopping_by',
          products:that.data.products,//JSON.stringify(products),
          ticket_id: ticket_id,
          express_company: that.data.isCheckExpressCompany,
          customer_addr_id: (that.data.address ? that.data.address.customer_addr_id:0),
          invoice_id: that.data.invoice.invoice_id ? that.data.invoice.invoice_id:0,
          use_point: that.data.usingPoint,
          amount: that.data.payAmount,
          is_check_dry: that.data.isCheckDry,
          // order_type: 1,//购买订单
        };
        if(that.data.items.is_have_new_ticket){
          param['is_have_new_ticket'] = that.data.items.is_have_new_ticket; //是否使用的是新会员卡券
          param['sub_amount'] = that.data.items.sub_amount; //新会员卡券抵扣金额
        }
        var params = {
          url: app.globalData.domainUrl,
          data:param,
          method:'POST',
          sCallback: function (res) {
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
        };
        base.httpRequest(params);
      }
    }else{
      wx.showToast({
        icon: "none",
        title: "请完成授权并登录"
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
    if(that.data.couponflexwindow) {
      couponflexwindow = false;
    } else {
      couponflexwindow = true;
    }
    that.setData({
      couponflexwindow: couponflexwindow
    });
  },
  close: function(e) {
    var flexwindow = false;

    that.setData({
      flexwindow: flexwindow
    })
  },

  //卡券弹框关闭
  close1: function(e) {
    var couponflexwindow = false;
    that.setData({
      couponflexwindow: couponflexwindow
    });
    //计算实付款
    that.sumUsingPoint();
  },

})