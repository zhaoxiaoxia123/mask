// pages/home/home.js
var that;
var app = getApp();
import tmpObj from '../template/template.js';
var base = require('../../utils/base.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    swipers: [],
    indicatorDots: true,
    indicatorColor: "#999",
    indicatorActiveColor: "#333",
    offset: 1,
    pageCount: 5,
    categoryType: 50, //冻龄智美商品类型
    isShowApp: 1, //是否显示在商城
    isLast: false,
    items: [],
    type: '9,12,13' , // 9:广告   12:app商城其他广告   13:app商城关于我们广告
    ftserviceflexwindow: false,
    storeflexwindow:false,
    step:0,
    materialType:20,// 20:公众号发文对应
    message:'',
    imgLoad:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    base.loading(1000);
    if (options.shareBy) {
      wx.setStorageSync('shareBy', options.shareBy);
    }
    console.log(wx.getStorageSync('shareBy'));
    if (wx.getStorageSync("isFirst")){
      that.setData({
        storeflexwindow: false
      });
    }else{
      that.setData({
        step:1,
        storeflexwindow: true
      });
    }
    if (options.scene) {
      var scene = decodeURIComponent(options.scene);
      console.log("scene is ", scene);
      var arrPara = scene.split("&");
      var arr = [];
      for (var i in arrPara) {
        arr = arrPara[i].split("=");
        wx.setStorageSync(arr[0], arr[1]);
        console.log("setStorageSync:", arr[0], "=", arr[1]);
        // if (arr[0] == 'shareBy') {
        //   that.setData({
        //     shareBy: arr[1]
        //   });
        // }
      }
    } else {
      console.log("no scene");
    }

    //商品列表
    var param_p = {
      page_code: "p005",
      category_type: that.data.categoryType,
      product_image_type:3,
      is_show_app: that.data.isShowApp,
      offset: (that.data.offset - 1) * that.data.pageCount,
      page: that.data.pageCount
    };
    that.getProductList(param_p);

    //广告图片列表---------
    that.getAdList();
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
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      })
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

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},


  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (!that.data.isLast) {
      that.setData({
        offset: that.data.offset + 1
      });
      base.loading(1000);
      //商品列表
      var param_p = {
        page_code: "p005",
        category_type: that.data.categoryType,
        product_image_type: 3,
        is_show_app: that.data.isShowApp,
        offset: (that.data.offset - 1) * that.data.pageCount,
        page: that.data.pageCount
      };
      that.getProductList(param_p);
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    // 来自页面内转发按钮
    return {
      title: '冻龄智美商城首页',
      path: 'pages/home/home?shareBy=' + wx.getStorageSync('memberNo'),
      success: (res) => {
        wx.showToast({ title: res, icon: 'success', duration: 2000 })
      },
      fail: (res) => {
        wx.showToast({ title: res, icon: 'success', duration: 2000 })
      }
    }
  },

  close3: function (e) {
    let step = e.currentTarget.dataset.step;
    if(step == 2){
      that.setData({
        step:step,
        storeflexwindow : true
      })
    }else if(step == 3){
      let storeflexwindow = false;
      that.setData({
        storeflexwindow: storeflexwindow
      })
      wx.setStorageSync('isFirst', true);
    }
  },

  ftservice: function(e) {
    let ret = tmpObj.ftservice(e);
    that.setData({
      ftserviceflexwindow: ret
    });
    // wx.hideTabBar();
  },
  ftserviceq: function(e) {
    let ret = tmpObj.ftserviceq(e);
    that.setData({
      ftserviceflexwindow: ret
    })
    // wx.showTabBar();
  },
  calling: function(e) {
    tmpObj.calling(e);
  },
  
  //广告
  getAdList: function() {
    let param = {
      page_code: 'p001',
      type: that.data.type
    };
    var params = {
      url: app.globalData.domainUrl,
      data:param,
      sCallback: function (res) {
        var datas = res.data;
        that.setData({
          swipers: datas.data
        });
      }
    };
    base.httpRequest(params);
  },
  /***
   * 点击进入详情页
   * ***/
  toDetail: function(e) {
    var product_id = e.currentTarget.dataset.obj.category_id;
    // app.globalData.productId = product_id;
    console.log(product_id)
    wx.navigateTo({
      url: '../detail/detail?id='+product_id,
    })
  },
  getProductList: function(param) { //获取商品列表
    
    var params = {
      url: app.globalData.domainUrl,
      data:param,
      sCallback: function (res) {
        var datas = res.data.data;
        that.setData({
          items: that.data.items.concat(datas),
          message:'没有相关信息',
          imgLoad:'../img/wu.png',
        });
        if (datas && (datas.length <= 0 || datas.length < that.data.pageCount)) {
          that.setData({
            isLast: true
          });
        }
      }
    };
    base.httpRequest(params);
  },
  goPost: function (e) {
    console.log(e);
    let post_id = e.currentTarget.dataset.id;
    let href = e.currentTarget.dataset.href;
    console.log(href);
    console.log(encodeURIComponent(href));
    if(href){
      wx.navigateTo({
        url: '../post/post?href=' + encodeURIComponent(href),
      })
    }else{
      wx.navigateTo({
        url: '../post/post?id=' + post_id,
      })
    }
  },
  goMyPage:function(e){
    let href = e.currentTarget.dataset.href;
    if(href){
    wx.navigateTo({
      url: href,
    })
  }else{
    wx.showToast({
      title: "地址为空"
    })
  }
  },

})