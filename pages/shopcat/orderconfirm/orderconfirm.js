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
    customerInfo: [], //用户信息
    ticketList: [], //卡券
    payAmount: 0, //使用积分后的实付款
    usingTicketAmount: 0, //使用优惠券的抵扣值
    isCheckTicket: 9999, //存储选择卡券索引  9999为不用卡券
    isCheckExpressCompany: 2, //存储选择快递  9999为随机
    addressId:0,
    // invoiceId: 0,
    // invoice:[],
    isLoadSum:true,  //计算合计金额加个转圈
    dryId:0,
    bean:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    that.setData({
      products: options.products, //获取上一页传来的商品id和数量，如：1,2--3,4--15,2--
      dryId: app.globalData.dry_id
    });
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
      // invoiceId: currPage.data.invoiceId
    });
    if (wx.getStorageSync('customerId') && !wx.getStorageSync('get_user_info') && !wx.getStorageSync('get_phone_info')) {
      //获取商品信息
      var param_p = {
        page_code: 'p005',
        type: "confirmProduct",
        products: that.data.products,
        level: wx.getStorageSync("level")
      };
      that.getProducts(param_p);
      // //是否查询卡券
      // that.isSelectTicket();
      // that.getTicketList(); //获取卡券列表

      var param = {
        page_code: 'p004',
        type: "mainCustomer"
      };
      that.getUserDetail(param);
      that.getAddress(); //获取用户设置的默认地址
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
    if (e.target.dataset.type == 'isCheckTicket') {
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
  // //选择发票
  // goInvoice: function () {
  //   wx.navigateTo({
  //     url: '/pages/my/invoice/invoice?come=order'
  //   })
  // },

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
          level:datas['frozeno_level']
        });
        wx.setStorageSync('level', datas['frozeno_level']);
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
          items: datas,
          ticketList: datas.ticket_list,
          isLoadSum:false,
          payAmount:datas.default_show_total_amount,
          usingTicketAmount:datas.ticket_amount
        });
        
        if(datas.ticket_list.ticket_check){
          that.setData({
            isCheckTicket:datas.ticket_list.ticket_check.check_key+1
          });
        }
      }
    };
    base.httpRequest(params);
  },

  //计算商品总价（未减卡券可提现金额前的会员折扣价相加的总价）
  sumProductTotalAmount: function() {
    var pInfo = that.data.items.products;
    var productAmount = 0;
    for (var i = 0; i < pInfo.length; i++) {
      productAmount += parseFloat(pInfo[i]['discount_amount'])*parseInt(pInfo[i]['join_product_count']);
    }
    that.setData({
      payAmount: parseFloat(productAmount)//+parseInt(dryAm)
    });
    //计算减去卡券金额后的实付款
    that.subTicketAmount();
    //商品总价减去可提现金额后价格
    that.subBeanAmount();
    
  },
  //是否查询卡券
  // isSelectTicket(){
    // var productAmount = that.data.payAmount;
    // if (productAmount ) {//&& !that.data.items.is_have_new_ticket
    //   that.getTicketList(); //获取卡券列表
    // }else{
    //   if (that.data.items.sub_amount != 0){
    //     //新人使用新人卡券商品总价计算
    //     that.setData({
    //       payAmount: (productAmount - parseFloat(that.data.items.sub_amount))
    //     });
    //   }
    // }
  // },
  //商品总价减去卡券后价格
  subTicketAmount:function(){
    that.setData({
      isLoadSum:true
    });
    var productAmount = parseFloat(that.data.payAmount);
    var tIndex = that.data.isCheckTicket - 1; //选中卡券索引
    var usingTicketAmount = 0;
    if (tIndex != 9998) { //上面索引减了个1
      var tList = that.data.ticketList.ticket; //卡券列表
      var paysAmount = productAmount;
      if(tList.length > 0){
        if (tList[tIndex]['ticket_type'] == 1) { //通用
          usingTicketAmount = tList[tIndex]['ticket_amount'];
          paysAmount = productAmount - tList[tIndex]['ticket_amount'];
          if (paysAmount < 0){
            paysAmount = 0;
          }
        } else if (tList[tIndex]['ticket_type'] == 2) { //满减
          if (productAmount >= tList[tIndex]['satisfy_amount']) {
            usingTicketAmount = tList[tIndex]['ticket_amount'];
            paysAmount = productAmount - tList[tIndex]['ticket_amount'];
            if (paysAmount < 0) {
              paysAmount = 0;
            }
          } else {
            paysAmount = productAmount;
          }
        }
      }
      that.setData({
        payAmount: parseFloat(paysAmount),
        usingTicketAmount: usingTicketAmount
      });
    } else {
      that.setData({
        payAmount: productAmount,
        usingTicketAmount: 0
      });
    }
    that.setData({
      isLoadSum:false
    });
  },

  // 商品总价减去可提现金额后价格
  subBeanAmount:function(){
    let bean = isNaN(parseFloat(that.data.bean))?0:parseFloat(that.data.bean);
    that.setData({
      payAmount: parseFloat(that.data.payAmount) - bean
    });
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
        if(res.data.data.ticket_check){
          that.setData({
            isCheckTicket:res.data.data.ticket_check.check_key+1
          });
          //计算减去卡券金额后的实付款
          that.sumProductTotalAmount();
        }
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
        var ticket_id = 0;
        if(that.data.ticketList.ticket.length > 0){
          ticket_id = that.data.isCheckTicket == 9999 ? 0 : that.data.ticketList.ticket[that.data.isCheckTicket - 1]['ticket_id'];
          if (that.data.items.ticket.ticket_id && ticket_id == 0){  //使用新人卡券时候存在的值
            ticket_id = that.data.items.ticket.ticket_id;
          }
        }
        let param = {
          page_code: 'p008',
          type:'shopping_by',
          products:that.data.products,//JSON.stringify(products),
          ticket_id: ticket_id,
          express_company: that.data.isCheckExpressCompany,
          customer_addr_id: (that.data.address ? that.data.address.customer_addr_id:0),
          invoice_id: 0,//that.data.invoice.invoice_id ? that.data.invoice.invoice_id:0,
          use_point: 0,
          rebate_amount: that.data.bean == undefined?0:that.data.bean,
          amount: that.data.payAmount
        };
        var params = {
          url: app.globalData.domainUrl,
          data:param,
          method:'POST',
          sCallback: function (res) {
            var datas = res.data.data;
            //此处跳出来支付。调用微信支付
            if(res.data.code == 200){
              wx.redirectTo({
                url: '/pages/my/order/orderdetail/orderdetail?order_id=' + datas +'&from_page=shopping',
              })
            }else{
              wx.showToast({
                // icon: "none",
                title: res.data.message
              });
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
  // 适用门店
  beans: function (e) {
    var beansflexwindow;
    if (that.data.beansflexwindow == true) {
      beansflexwindow = false;
    } else {
      beansflexwindow = true;
    }
    that.setData({
      beansflexwindow: beansflexwindow
    });
  },
  close3: function () {
    that.closeBean();
    that.setData({
      bean:0
    })
    console.log(that.data.bean);
  },
  closeBean: function(){
    let beansflexwindow = false;
    that.setData({
      beansflexwindow: beansflexwindow
    })
  },
  //卡券弹框关闭
  close1: function(e) {
    var couponflexwindow = false;
    that.setData({
      couponflexwindow: couponflexwindow
    });
    //ji算商品总价
    that.sumProductTotalAmount();
  },
  
  PointNum: function(obj) {
      obj = obj.replace(/[^\d.]/g, ""); //清除"数字"和"."以外的字符
      obj = obj.replace(/^\./g, ""); //验证第一个字符是数字
      obj = obj.replace(/\.{2,}/g, "."); //只保留第一个, 清除多余的
      obj = obj.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
      obj = obj.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
      if (obj.indexOf(".") < 0 && obj != "") { //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
          obj = parseFloat(obj);
      }
      if (!obj || obj == '0' || obj == '0.0' || obj == '0.00') {
          return;
      }
      return obj;
  },
  setBeanInput: function(e) {
    that.setData({
      bean: this.PointNum(e.detail.value)
    })
    return 
  },
  /**
   * 提交可提现金额使用数,比较输入可提现金额是否符合匹配数量
   */
  submitBean:function(){
    if(that.data.customerInfo.frozeno_rebate_amount < that.data.bean || that.data.bean > that.data.payAmount ){
      wx.showToast({
        icon: "none",
        title: "请输入正确数量"
      });
    }else{
      that.closeBean();
      //计算减去卡券金额后的实付款
      that.sumProductTotalAmount();
    }
  },
  onInputEvent(e) {
    this.setData({
      inputVal : this.PointNum(e.detail.value)
    })
    return // 必加，不然输入框可以输入多位小数
  },
})