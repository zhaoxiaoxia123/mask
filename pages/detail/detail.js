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
    growth:0

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
      // customer_id: wx.getStorageSync("customerId")
    };
    that.getProductDetail(param);

    //查询积分，成长值兑换设置
    var transformParam = {
      page_code: 'p017',
      code: ''
    };
    that.getTransform(transformParam);


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
        if (datas){
          for (var i = 0; i < datas.length; i++) {
            console.log('for:----');
            console.log(i);
            console.log(datas[i].type);
            console.log(datas[i].value_from / datas[i].value_to );
            if (datas[i].code == "jf01"){
              that.setData({
                point: parseInt(that.data.items.discount_amount/(datas[i].value_from / datas[i].value_to) )
              });
            } else if (datas[i].code == "czz01") {
              that.setData({
                growth: parseFloat(that.data.items.discount_amount / (datas[i].value_from / datas[i].value_to) ).toFixed(2)
              });
            }
          }
        }

      }
    });

  },
  // 跳转规格弹窗
  toggleDialog:function(e){
    var that = this;
    var flexwindow;
    if (this.data.flexwindow==true){
      flexwindow=false;
    }
    else{
      flexwindow = true;
    }
    that.setData({
      flexwindow: flexwindow
    });
  },
  // 减按钮控件
  jianFn: function (e) {
    let self = this
    let count = this.data.count;
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
    let self = this
    let id = e.currentTarget.dataset.id;
    
    let border=self.data.border;
    border=!border;
    console.log("---", border)
      self.setData({
        border: border
      })
  },
  close: function (e) {
    let self = this
    let flexwindow=false;
    
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
          console.log('加入购物车成功。');
          // that.setData({
          //   shopping_count: parseInt(that.data.shopping_count) + 1
          // });
          wx.navigateBack({
            delta:1
          })
        }
      }
    })
    }else{
      wx.switchTab({
        url: '../my/my',
      })
    }
  },
  //加入订单，即立即购买
  joinOrder:function(){ //提交结算，生成结算的订单信息，
      // var product_id = ","+that.data.items.product_id+",";
      // var product_count = ",1,";
      // var product_amount = "";
      // if(wx.getStorageSync("memberNo")){
      //   product_amount = that.data.items.discount_amount;
      // }else{
      //   product_amount = that.data.items.amount;
      // }
    var products = [];
    var info = {
      'product_id': that.data.items.product_id,
      'product_count': 1,
      'discount_amount': that.data.items.discount_amount
    };
    products.push(info);
      wx.request({
        url: app.globalData.domainUrl,
        method: "POST",
        data: {
          page_code:'p008',
          products:products,
          // product_id: product_id,
          // product_count: product_count,
          // product_amount: ','+product_amount + ',',
          ticket_id: 0,
          order_type: 1,//购买订单
          customer_id: wx.getStorageSync('customerId'),
          // is_customer: wx.getStorageSync('memberNo') ? 1 : 2,
          amount: product_amount,
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          console.log(res);
          var datas = res.data.data;
          //getApp().globalData.orderId = datas.order_id;
          // var url = '/pages/shopcat/orderconfirm/orderconfirm';
          // console.log(url);
          // wx.navigateTo({
          //   url: url
          // });
          wx.navigateTo({
            url: '/pages/my/order/orderdetail/orderdetail?order_id=' + datas.order_id,
          })
        }
      })
  },
})