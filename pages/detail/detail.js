// pages/detail/detail.js
var that;
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    collect:false,
    flag:3,
    flexwindow:false,
    count:1,
    border:true,
    swipers: [],
    indicatorDots: true,
    indicatorColor: "#000000",
    indicatorActiveColor: "#b7aa00",
    autoplay: true,
    interval: 3000,
    duration: 500,
    circular: true,
    items: [],
    productId:0,
    transform: [],
    point:0,
    growth:0,
    shoppingCount: 0,
    domainName: app.globalData.domainName
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this; 
    that.setData({
      productId: getApp().globalData.productId
    });
    var param = {
      page_code: 'p005',
      product_id: that.data.productId,
      // customer_id: wx.getStorageSync("customerId"),
      level: wx.getStorageSync("level")
    };
    // var param = '/p005?product_id='+that.data.productId;
    that.getProductDetail(param);

    setTimeout(function(){
      //查询积分，成长值兑换设置
      var transformParam = {
        page_code: 'p017',
        code: ''
      };
      // var transformParam = '/p017?code=';
      that.getTransform(transformParam);
    },1000);

    if (wx.getStorageSync("customerId")){
      //查询购物车个数
      var shoppingParam = {
        page_code: 'p012',
        type: 'shopping_count',
        customer_id: wx.getStorageSync("customerId")
      };
      // var shoppingParam = '/p012?type=shopping_count&customer_id='+wx.getStorageSync("customerId");
      that.getShoppingCount(shoppingParam);
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

  getTransform: function (param) {
    wx.request({
      url: app.globalData.domainUrl,
      data: param,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var datas = res.data.data;
        that.setData({
          transform: datas
        });
        that.sumValue();
      }
    });
  },

  sumValue:function(){
    var datas = that.data.transform;
    if (datas) {
      for (var i = 0; i < datas.length; i++) {
        if (datas[i].code == "jf01") {
          if (that.data.items.customer_amount) {
            that.setData({
              point: parseInt(that.data.items.customer_amount / (datas[i].value_from / datas[i].value_to))
            });
          } else {
          that.setData({
            point: parseInt(that.data.items.frozeno_discount_amount / (datas[i].value_from / datas[i].value_to))
            });
          }
        } else if (datas[i].code == "czz01") {
          if (that.data.items.customer_amount){
            that.setData({
              growth: parseFloat(that.data.items.customer_amount / (datas[i].value_from / datas[i].value_to)).toFixed(1)
            });
          }else{
            that.setData({
              growth: parseFloat(that.data.items.frozeno_discount_amount / (datas[i].value_from / datas[i].value_to)).toFixed(1)
            });
          }
        }
      }
    }
  },

  getShoppingCount: function (param){
    wx.request({
      url: app.globalData.domainUrl,
      data: param,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var datas = res.data.data;
        that.setData({
          shoppingCount: datas.count
        });
      }
    });
  },

  // 跳转规格弹窗
  toggleDialog:function(){
    var that = this;
    var flexwindow;
    if (this.data.flexwindow==true){
      flexwindow=false;
    } else{
      flexwindow = true;
    }
    that.setData({
      flexwindow: flexwindow
    });
  },
  // 减按钮控件
  jianFn: function (e) {
    var self = this
    var count = this.data.count;
    if (count <= 1) {
      count = 1;
      self.setData({
        count: count
      })
    } else {
      count = count - 1;

      self.setData({
        count: count
      })
    }
  },
  // 加按钮控件
  plusFn: function (e) {
    var self = this
    var items = [];
    var count = this.data.count;   //获得items数组
    count = count + 1;
    
    self.setData({
      count: count
    })
  },
  // 选中改变颜色
  selected: function (e) {
    var self = this
    var id = e.currentTarget.dataset.id;
    
    var border=self.data.border;
    border=!border;
    console.log("---", border)
      self.setData({
        border: border
      })
  },
  close: function (e) {
    var self = this
    var flexwindow=false;
    
    self.setData({
      flexwindow: flexwindow
    })
  },
  
  collect:function() {
    var collect=that.data.collect;
    var collectUrl;
    if(collect){
      collect=false;
      collectUrl ='../img/starblock.png';
    }else{
      collect = true;
      collectUrl = '../img/star.png';
    }
    that.setData({
      collect: collect,
      collectUrl: collectUrl
    });
  }, 
  getProductDetail: function (param) {
    wx.request({
      url: app.globalData.domainUrl,
      data: param,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          items: res.data.data,
          swipers: res.data.data.product_image
        });
        // console.log("getProductDetail:----");
        // console.log(that.data.items);
      }
    });
  },
  shoppingList:function(){
    // var productId = event.currentTarget.dataset.id;
    wx.switchTab({
      url: '../shopcat/shopcat',
    });
  },
  joinShopping: function(){
    // var productId = event.target.dataset.id;
    if (wx.getStorageSync('customerId')){
    wx.request({
      url: app.globalData.domainUrl,
      method: "POST",
      data: {
        page_code:'p012',
        type: 'insert',
        product_id: that.data.productId,
        product_count: that.data.count,  //商品个数
        customer_id: wx.getStorageSync('customerId')
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res);
        var datas = res.data.data;
        if (datas) {
          wx.showToast({
            title: "加入购物车成功。"
          });
          //查询购物车个数
          var shoppingParam = {
            page_code: 'p012',
            type: 'shopping_count',
            customer_id: wx.getStorageSync("customerId")
          };
            // var shoppingParam = '/p012?type=shopping_count&customer_id='+wx.getStorageSync("customerId");
            that.getShoppingCount(shoppingParam);

            that.setData({
                flexwindow: false
            });
            // wx.navigateBack({
            //   delta:1
            // })
        }
      }
    })
    }else{
      wx.showModal({
        title: '提示',
        content: '请先登录!',
        showCancel: false,
        confirmText: '确定',
        success: function (res) {
          wx.switchTab({
            url: '../my/my',
          });
        }
      })
    }
  },

  //进入结算页面  加入订单，即立即购买
  goConfirm: function (e) {
    if (wx.getStorageSync('customerId')) {
      var type = e.currentTarget.dataset.type;
      var products = '';
      if (type == "more"){
        products = that.data.productId + "," + that.data.count + "--";
      }else{
        products = that.data.productId + ",1--";
      }
      wx.navigateTo({
        url: '/pages/shopcat/orderconfirm/orderconfirm?products=' + products,
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '请先登录!',
        showCancel: false,
        confirmText: '确定',
        success: function (res) {
          wx.switchTab({
            url: '/pages/my/login/login',
          });
        }
      })
    }
  },

  // //加入订单，即立即购买
  // joinOrder:function(){ //提交结算，生成结算的订单信息，
  //     // var product_id = ","+that.data.items.product_id+",";
  //     // var product_count = ",1,";
  //     // var product_amount = "";
  //     // if(wx.getStorageSync("memberNo")){
  //     //   product_amount = that.data.items.discount_amount;
  //     // }else{
  //     //   product_amount = that.data.items.amount;
  //     // }
  //   var products = [];
  //   var info = {
  //     'product_id': that.data.items.product_id,
  //     'product_count': 1,
  //     'discount_amount': that.data.items.discount_amount
  //   };
  //   products.push(info);
  //     wx.request({
  //       url: app.globalData.domainUrl,
  //       method: "POST",
  //       data: {
  //         page_code:'p008',
  //         products:products,
  //         // product_id: product_id,
  //         // product_count: product_count,
  //         // product_amount: ','+product_amount + ',',
  //         ticket_id: 0,
  //         order_type: 1,//购买订单
  //         customer_id: wx.getStorageSync('customerId'),
  //         // is_customer: wx.getStorageSync('memberNo') ? 1 : 2,
  //         amount: product_amount,
  //       },
  //       header: {
  //         "Content-Type": "application/x-www-form-urlencoded"
  //       },
  //       success: function (res) {
  //         console.log(res);
  //         var datas = res.data.data;
  //         //getApp().globalData.orderId = datas.order_id;
  //         // var url = '/pages/shopcat/orderconfirm/orderconfirm';
  //         // console.log(url);
  //         // wx.navigateTo({
  //         //   url: url
  //         // });
  //         wx.navigateTo({
  //           url: '/pages/my/order/orderdetail/orderdetail?order_id=' + datas.order_id,
  //         })
  //       }
  //     })
  // },
})