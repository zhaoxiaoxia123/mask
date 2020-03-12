// pages/home/home.js
var that;
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swipers:[],
    indicatorDots:true,
    indicatorColor:"#999",
    indicatorActiveColor:"#333",
    autoplay:true,
    interval:6000,
    duration:500,
    circular: true,
    offset: 1,
    pageCount: 2,
    isLast:false,
    items: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // if (options.scene) {
    //   var scene = decodeURIComponent(options.scene);
    //   console.log("scene is ", scene);
    //   var arrPara = scene.split("&");
    //   var arr = [];
    //   for (var i in arrPara) {
    //     arr = arrPara[i].split("=");
    //     wx.setStorageSync(arr[0], arr[1]);
    //     console.log("setStorageSync:", arr[0], "=", arr[1]);
    //     if (arr[0] == 'share_by') {
    //       that.getShareCustomer(arr[1]);
    //     }
    //   }
    // } else {
    //   console.log("no scene");
    // }

    that = this;
    //商品列表
    var param_p = {
      page_code:"p005",
      offset: (that.data.offset - 1) * that.data.pageCount,
      page: that.data.pageCount
    };
    that.getProductList(param_p);

    //广告图片列表
    that.getAdList();
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
  //监听页面滑动距离判断搜索栏的背景色
  onPageScroll: function (e) {
    that.setData({
      scrollTop: e.scrollTop
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log(that.data.offset);
    console.log(that.data.isLast); 
    if (! that.data.isLast){
      that.setData({
        offset: that.data.offset + 1
      });
      //商品列表
      var param_p = {
        page_code: "p005",
        offset: (that.data.offset - 1) * that.data.pageCount,
        page: that.data.pageCount
      };
      that.getProductList(param_p);
    }
    
    // that.setData({
    //   items: that.data.items.concat(arr)
    // })
    // console.log(that.data.items)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //广告
  getAdList: function(){
    wx.request({
      url: app.globalData.domainUrl,
      data: {
        page_code:'p001'
      },
      header: {
        'content-type': "application/json"
      },
      success: function (res) {
        var datas = res.data;
        console.log(datas);
        console.log(datas.length);
        that.setData({
          swipers: datas.data
        });
      }
    })
  },
  /***
   * 点击进入详情页
   * ***/
  toDetail:function(e){
    console.log(e)
    var product_id = e.currentTarget.dataset.obj.product_id;
    // console.log(product_id)
    // wx.navigateTo({
    //   url: '../detail/detail?product_id=' + product_id,
    // })
    app.globalData.productId = product_id;
    console.log(product_id)
    wx.navigateTo({
      url: '../detail/detail',
    })
  },
  getProductList: function (param) {  //获取商品列表
    wx.request({
      url: app.globalData.domainUrl,
      data: param,
      header: {
        'content-type': "application/json"
      },
      success: function (res) {
        var datas = res.data.data;
        console.log(datas);
        console.log(datas.length);
        that.setData({
          items: that.data.items.concat(datas)
        });
        if (datas.length <= 0 || datas.length < that.data.pageCount){
          that.setData({
            isLast: true
          });
        }
      }
    })
  },

})