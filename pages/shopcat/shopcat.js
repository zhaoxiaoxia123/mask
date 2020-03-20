// pages/info/info.js
var that;
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    icons: ["../img/plus_pink.png", "../img/jian_pink.png"],
    check: false,
    // totalfeeOld: 0,
    totalfee: 0,
    memberNo: wx.getStorageSync('memberNo'),
    offset: 1,
    pageCount: 20,
    isLast: false,
    items: [],
    // ticketList: [],
    // selectedTicketType: 1,  //卡券类型 1：通用 2：满减
    // selectedSatisfyAmount: 0,   //卡券满足金额  即可使用该券
    // ticketAmount:0,   //卡券金额
    // selectedTicketName: "",
    // selectedTicketId: 0,
    // queryTicketId: 0,
    // showTicket: "display:none"  //是否展示卡券列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    // var id = app.globalData.ticketId;
    // that.setData({
    //   queryTicketId: id
    // });

    // that.setData({
    //   items: [],
    //   isLast: false,
    //   // ticketList: [],
    //   // ticketAmount: 0,   //卡券金额
    //   // selectedTicketType: 1,  //卡券类型 1：通用 2：满减
    //   // selectedSatisfyAmount: 0,   //卡券满足金额  即可使用该券
    //   // selectedTicketName: "",
    //   // selectedTicketId: 0,
    //   showTicket: "display:none"
    // })
    if (wx.getStorageSync('customerId')) {
      var param = {
        page_code: 'p012',
        type: "shopping_list",
        customer_id: wx.getStorageSync('customerId'),
        offset: (that.data.offset - 1) * that.data.pageCount,
        page: that.data.pageCount
      };
      that.getShoppingList(param);

      // that.getTicketList();
    }
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
    console.log(that.data.offset);
    console.log(that.data.isLast);
    if (!that.data.isLast) {
      that.setData({
        offset: that.data.offset + 1
      });
      //商品列表
      var param_p = {
        page_code: 'p012',
        type: "shopping_list",
        customer_id: wx.getStorageSync('customerId'),
        offset: (that.data.offset - 1) * that.data.pageCount,
        page: that.data.pageCount
      };
      that.getShoppingList(param_p);
    }

    // that.setData({
    //   items: that.data.items.concat(arr)
    // })
    // console.log(that.data.items)
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  //以下为自定义点击事件
  returnFee: function(fee, product_count, discount_amount) {
    // var discount = wx.getStorageSync('discount') ? wx.getStorageSync('discount'):0;
    // if (discount){
    // fee = fee + (product_count * discount_amount) * (discount/10);
    // }else{
    fee = fee + (product_count * discount_amount);
    // }
    return fee;
  },
  getShoppingList: function(param) {
    wx.request({
      url: app.globalData.domainUrl,
      data: param,
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        console.log(res);
        var datas = res.data.data;
        that.setData({
          items: that.data.items.concat(datas)
        })
        if (datas.length <= 0 || datas.length < that.data.pageCount) {
          that.setData({
            isLast: true
          });
        }
      }
    });
  },
  // 减按钮控件
  jianFn: function(e) {
    var items = that.data.items;
    var id = e.currentTarget.dataset.id;
    if (items[id].product_count <= 1) {
      items[id].product_count = 1;
      self.setData({
        items: items
      })
    } else {
      items[id].product_count = items[id].product_count - 1;
      var fee = 0;
      for (var i = 0; i < items.length; i++) {
        if (items[i].selected) {
          fee = that.returnFee(fee, items[i].product_count, items[i].discount_amount);
        }
      }

      that.setData({
        items: items,
      })
      that.setTotalFee(fee);
    }
  },
  // 加按钮控件
  plusFn: function(e) {
    var items = [];
    items = that.data.items; //获得items数组
    var id = e.currentTarget.dataset.id; // 获得wxml的data-id的值 data-id与dataset.id对应
    items[id].product_count = parseInt(items[id].product_count) + 1;
    // let totalfee = this.data.totalfee;
    var fee = 0;
    for (var i = 0; i < items.length; i++) {
      if (items[i].selected) {
        fee = that.returnFee(fee, parseInt(items[id].product_count), items[i].discount_amount);
      }
    }
    that.setData({
      items: items,
    })
    that.setTotalFee(fee);
  },

  radiocon: function(e) {
    var id = e.currentTarget.dataset.id;
    var items = that.data.items;
    // var selected = items[id].selected;
    if (items[id].selected) {
      items[id].selected = false;
    } else {
      items[id].selected = true;
    }
    var fee = 0;
    for (var i = 0; i < items.length; i++) {
      if (items[i].selected) {
        fee = that.returnFee(fee, items[i].product_count, items[i].discount_amount);
      }
    }
    that.setData({
      items: items,
    })
    that.setTotalFee(fee);
  },
  all: function(e) {
    var check = that.data.check;
    var items = that.data.items;
    if (check) {
      check = false;
      for (var i = 0; i < items.length; i++) {
        items[i].selected = false;
      }
    } else {
      check = true;
      for (var i = 0; i < items.length; i++) {
        items[i].selected = true;
      }
    }
    var fee = 0;
    for (var i = 0; i < items.length; i++) {
      if (items[i].selected) {
        fee = that.returnFee(fee, items[i].product_count, items[i].discount_amount);
      }
    }
    that.setData({
      check: check,
      items: items
    })
    that.setTotalFee(fee); //赋值合计金额
  },
  //赋值合计金额
  setTotalFee: function(fee) {
    // var money = fee - that.data.ticketAmount;
    // money = (money <= 0) ? 0 : money;
    that.setData({
      totalfee: fee
    })
  },
  goConfirm: function() {
    var products = '';
    for (var i = 0; i < that.data.items.length; i++) {
      if (that.data.items[i].selected == true) {
        products += that.data.items[i].product_id + "," + that.data.items[i].product_count + "--";
      }
    }
    wx.navigateTo({
      url: '/pages/shopcat/orderconfirm/orderconfirm?products=' + products,
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

  // getTicketList: function () {   //获取有效卡券列表
  //   console.log(that.data.ticketList);
  //   console.log(that.data.ticketList.length);
  //   if (that.data.ticketList.length <= 0){
  //     //获取卡券列表
  //     var param_t = {
  //       page_code: 'p013',
  //       customer_id: wx.getStorageSync('customerId'),
  //       offset: 0,
  //       page: 20
  //     };
  //     wx.request({
  //       url: app.globalData.domainUrl,
  //       data: param_t,
  //       header: {
  //         'content-type': 'application/json'
  //       },
  //       success: function (res) {
  //         var datas = res.data.data;
  //         that.setData({
  //           ticketList: datas
  //         });
  //         if (that.data.queryTicketId){
  //           for (var ei = 0; ei < datas.length; ++ei) {
  //             if (datas[ei]['ticket_id'] == that.data.queryTicketId) {
  //               that.setData({
  //                 selectedTicketId: datas[ei]['ticket_id'],
  //                 selectedTicketName: datas[ei]['ticket_name'],
  //                 ticketAmount: datas[ei]['ticket_amount'],
  //                 selectedTicketType: datas[ei]['ticket_type'],
  //                 selectedSatisfyAmount: datas[ei]['satisfy_amount'],
  //               });
  //             }
  //           }
  //         }
  //         that.setData({
  //           queryTicketId: 0
  //         });
  //         app.globalData.ticketId = 0;  //还原全局变量
  //       }
  //     });
  //   }else{
  //     that.setData({
  //       showTicket: that.data.showTicket == "display:flex" ? "display:none" : "display:flex"
  //     });
  //   }
  // },

  // checkTicket: function (e) {
  //   console.log('------');

  //   const index = e.currentTarget.dataset.id;
  //   console.log(index);
  //   // that.setData({
  //   //   selectedTicketName: that.data.ticketList[index].ticket_name,
  //   //   selectedTicketId: that.data.ticketList[index].ticket_id,
  //   //   ticketAmount: that.data.ticketList[index].ticket_amount,
  //   //   selectedTicketType: that.data.ticketList[index].ticket_type,  //卡券类型 1：通用 2：满减
  //   //   selectedSatisfyAmount: that.data.ticketList[index].satisfy_amount,   //卡券满足金额  即可使用该券
  //   //   showTicket: "display:none",
  //   //   totalfee: that.data.totalfeeOld - that.data.ticketList[index].ticket_amount
  //   // });
  //   console.log(that.data.ticketList[index].ticket_type);
  //   console.log(that.data.totalfeeOld);
  //   console.log(that.data.ticketList[index].satisfy_amount);
  //   console.log(that.data.ticketList[index].ticket_type == 1 || (that.data.ticketList[index].ticket_type == 2 && that.data.totalfeeOld >= that.data.ticketList[index].satisfy_amount));
  //   if (that.data.ticketList[index].ticket_type == 1 || (that.data.ticketList[index].ticket_type == 2 && that.data.totalfeeOld >= that.data.ticketList[index].satisfy_amount)){
  //     that.setData({
  //       selectedTicketName: that.data.ticketList[index].ticket_name,
  //       selectedTicketId: that.data.ticketList[index].ticket_id,
  //       ticketAmount: that.data.ticketList[index].ticket_amount,
  //       selectedTicketType: that.data.ticketList[index].ticket_type,  //卡券类型 1：通用 2：满减
  //       selectedSatisfyAmount: that.data.ticketList[index].satisfy_amount,   //卡券满足金额  即可使用该券
  //       showTicket: "display:none",
  //       totalfee: that.data.totalfeeOld - that.data.ticketList[index].ticket_amount
  //     });
  //   }

  // },
})