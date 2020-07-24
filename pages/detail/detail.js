// pages/detail/detail.js
var that;
var app = getApp();
var base = require('../../utils/base.js');
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
    autoplay: false,
    interval: 3000,
    duration: 500,
    circular: true,
    items: [],
    productId:0,
    shoppingCount: 0,
    level:0,
    isClick:true,
    winHeight:'100%',
    nowstatus:'product',
    toview:'',
    productTop: 0,
    detailTop: 0,
    aboutTop: 0,
    scrollStop:false,
    dryAmount:0,
    promotionPicture:"../img/member/V001.jpg",
    showPromotionTip:"活动中",
    showPromotionClass:"",
    experience_id:0,
    experience_amount:0,
    isOver:false,
    surplusSale:0,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this; 
    if (options.shareBy) {
      wx.setStorageSync('shareBy', options.shareBy);
    }
    that.setData({
      productId: options.id,
      // productId: getApp().globalData.productId,
      experience_id:app.globalData.experience_id,
      experience_amount:app.globalData.experience_amount,
      level: wx.getStorageSync("level")
    });
    var param = {
      page_code: 'p005',
      product_id: that.data.productId,
      // customer_id: wx.getStorageSync("customerId"),
      level: wx.getStorageSync("level")
    };
    that.getProductDetail(param);

    if (wx.getStorageSync("customerId")){
      //查询购物车个数
      var shoppingParam = {
        page_code: 'p012',
        type: 'shopping_count',
      };
      that.getShoppingCount(shoppingParam);
    }

    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          winHeight: res.windowHeight - (res.windowWidth * 90 / 750) + 'px'
        })
        console.log('winHeight::===');
        console.log(that.data.winHeight);
      },
    })
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
    // 来自页面内转发按钮
    return {
      title: '冻龄智美商品详情页',
      path: 'pages/detail/detail?shareBy=' + wx.getStorageSync('memberNo'), // 好友点击分享之后跳转到的小程序的页面
      // desc: '描述',  // 看你需要不需要，不需要不加
      // imageUrl: that.data.qrcode,
      success: (res) => {
        wx.showToast({ title: res, icon: 'success', duration: 2000 })
      },
      fail: (res) => {
        wx.showToast({ title: res, icon: 'success', duration: 2000 })
      }
    }
  },
  touchStart(e){
    console.log('滚起来', e);
    that.setData({
      scrollStop: true
    })
  },
  touchEnd(e){
   console.log('停下来', e);
   that.setData({
      scrollStop: false
    })
  },
  scroll: function (e) {
    console.log(e)
    if(!that.data.scrollStop){
      return ;
    }
    let st = e.scrollTop ? e.scrollTop : e.detail.scrollTop;
    if (st <= that.data.productTop || st < that.data.detailTop ){
      that.setData({
        nowstatus: 'product'
      })
    }else if (st >= that.data.detailTop && st < that.data.aboutTop){
      that.setData({
        nowstatus:'detail'
      })
    }else if (st >= that.data.aboutTop){
      console.log("true")
      that.setData({
        nowstatus: 'about'
      })
    }
  },
  //是否让确认按钮可点击
  setClickState:function(value){
    that.setData({
      isClick:value
    });
  },
  // tab切换
  clickTab: function (e) {
    let status = e.target.dataset.hash?e.target.dataset.hash:e.detail.dash;
    that.setData({
      nowstatus:status,
      toview:status
    })
  },
  
  getShoppingCount: function (param){
    var params = {
      url: app.globalData.domainUrl,
      data:param,
      method:'GET',
      sCallback: function (res) {
        var datas = res.data.data;
        that.setData({
          shoppingCount: datas.count
        });
      }
    };
    base.httpRequest(params);

  },

  /**
   * 是否选中导入仪
   */
  checkDry: function(e) {
    var amount = e.currentTarget.dataset.amount;
    var items = that.data.items;
    if (items.is_check_dry == 1) {
      items.is_check_dry = 2;
      that.setData({
        dryAmount:0
      });
    } else {
      items.is_check_dry = 1;
      that.setData({
        dryAmount:amount
      });
    }
    that.setData({
      items: items
    });
    console.log('that.data.items.is_check_dry:-------');
    console.log(that.data.items.is_check_dry);
  },
  // 跳转规格弹窗
  toggleDialog:function(){
    var flexwindow;
    if (that.data.flexwindow==true){
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
    var count = that.data.count;
    if (count <= 1) {
      count = 1;
      that.setData({
        count: count
      })
    } else {
      count = count - 1;
      that.setData({
        count: count
      })
    }
  },
  // 加按钮控件
  plusFn: function (e) {
    var count = that.data.count;   //获得items数组
    count = count + 1;
    that.setData({
      count: count
    })
  },
  // 选中改变颜色
  selected: function (e) {
    var border=that.data.border;
    border=!border;
    console.log("---", border)
    that.setData({
      border: border
    })
  },
  close: function (e) {
    var flexwindow=false;
    that.setData({
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

  getTop:function(){
    let query = wx.createSelectorQuery();
    query.select('#product').boundingClientRect(res => { //获取detail距离页面顶部高度
      that.setData({
        productTop: res.top
      })
    }).exec()
    query.select('#detail').boundingClientRect(res => { //获取detail距离页面顶部高度
      that.setData({
        detailTop: res.top
      })
    }).exec()
    query.select('#about').boundingClientRect(res => { //about
      that.setData({
        aboutTop: res.top
      })
    }).exec()
  },
  getProductDetail: function (param) {
    var params = {
      url: app.globalData.domainUrl,
      data:param,
      method:'GET',
      sCallback: function (res) {
        if(res.data.data){
          that.setData({
            items: res.data.data,
            swipers: res.data.data.product_image,
          });
          let img = '';
          let tip = '';
          let css = '';
          let isover = parseInt(that.data.items.now_hour) < parseInt(that.data.items.frozeno_start_date) || parseInt(that.data.items.frozeno_promotion_count) <= parseInt(that.data.items.sale);
          if(isover) {
            img = "../img/member/V001.jpg";
            tip="活动结束";
            css = '';
          } else {
            img = "../img/member/V000.jpg";
            tip="活动中";
            css = 'activity-state-active';
          }
          let surCount = parseInt(that.data.items.frozeno_promotion_count) - parseInt(that.data.items.sale);
          that.setData({
            promotionPicture:img,
            showPromotionTip:tip,
            showPromotionClass:css,
            isOver:isover,
            surplusSale:surCount > 0 ? surCount: 0 ,
          });
          console.log("promotionPicture:-----");
          console.log(that.data.promotionPicture);
          that.getTop();
        }
      }
    };
    base.httpRequest(params);
  },
  shoppingList:function(){
    wx.switchTab({
      url: '../shopcat/shopcat',
    });
  },
  joinShopping: function(){
    if (wx.getStorageSync('customerId') && !wx.getStorageSync('get_user_info') && !wx.getStorageSync('get_phone_info')){
      that.setClickState(false);
      let param = {
        page_code:'p012',
        type: 'insert',
        product_id: that.data.productId,
        product_count: that.data.count,  //商品个数
        // customer_id: wx.getStorageSync('customerId')
      };
      var params = {
        url: app.globalData.domainUrl,
        data:param,
        method:'POST',
        sCallback: function (res) {
          var datas = res.data.data;
          if (datas) {
            wx.showToast({
              title: "加入购物车成功。"
            });
            that.setClickState(true);
            //查询购物车个数 start
            var shoppingParam = {
              page_code: 'p012',
              type: 'shopping_count',
              // customer_id: wx.getStorageSync("customerId")
            };
            that.getShoppingCount(shoppingParam);
            //查询购物车个数  end
            that.setData({
                flexwindow: false
            });
          }
        }
      };
      base.httpRequest(params);
    }else{
      wx.showModal({
        title: '提示',
        content: '请先完成授权!',
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
    if (wx.getStorageSync('customerId') && !wx.getStorageSync('get_user_info') && !wx.getStorageSync('get_phone_info')) {
      var type = e.currentTarget.dataset.type;
      var products = '';
      if (type == "more"){
        products = that.data.productId + "," + that.data.count + "--";
      }else{
        products = that.data.productId + ",1--";
      }
      wx.navigateTo({
        url: '/pages/shopcat/orderconfirm/orderconfirm?products=' + products+'&isCheckDry='+that.data.items.is_check_dry,
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '请先完成授权!',
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

})