// pages/home/home.js
var that;
var app = getApp();
import tmpObj from '../template/template.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    swipers: [],
    indicatorDots: true,
    indicatorColor: "#999",
    indicatorActiveColor: "#333",
    // interval: 6000,
    // duration: 500,
    // circular: true,
    offset: 1,
    pageCount: 5,
    categoryType: 50, //冻龄智美商品类型
    isShowApp: 1, //是否显示在商城
    isLast: false,
    items: [],
    type: '9,12,13' , // 9:广告   12:app商城其他广告   13:app商城关于我们广告
    domainName: app.globalData.domainName,
    ftserviceflexwindow: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
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
    // var param_p = '?page_code=p005&offset='+(that.data.offset - 1) * that.data.pageCount+'&page='+that.data.pageCount;
    that.getProductList(param_p);

    //广告图片列表
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
  //监听页面滑动距离判断搜索栏的背景色
  onPageScroll: function(e) {
    that.setData({
      scrollTop: e.scrollTop
    })
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
        page_code: "p005",
        category_type: that.data.categoryType,
        product_image_type: 3,
        is_show_app: that.data.isShowApp,
        offset: (that.data.offset - 1) * that.data.pageCount,
        page: that.data.pageCount
      };
      // var param_p = '/p005?offset='+(that.data.offset - 1) * that.data.pageCount+'&page='+that.data.pageCount;
      that.getProductList(param_p);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {},
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
    wx.request({
      url: app.globalData.domainUrl,
      data: {
        page_code: 'p001',
        type: that.data.type
      },
      header: {
        'content-type': "application/json"
      },
      success: function(res) {
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
  toDetail: function(e) {
    var product_id = e.currentTarget.dataset.obj.category_id;
    app.globalData.productId = product_id;
    console.log(product_id)
    wx.navigateTo({
      url: '../detail/detail',
    })
  },
  getProductList: function(param) { //获取商品列表
    wx.request({
      url: app.globalData.domainUrl,
      data: param,
      header: {
        'content-type': "application/json"
      },
      success: function(res) {
        var datas = res.data.data;
        console.log(datas);
        console.log(datas.length);
        that.setData({
          items: that.data.items.concat(datas)
        });
        if (datas.length <= 0 || datas.length < that.data.pageCount) {
          that.setData({
            isLast: true
          });
        }
      }
    })
  },
  goPost: function (e) {
    console.log(e);
    let post_id = e.currentTarget.dataset.id;
    let href = e.currentTarget.dataset.href;
    console.log(href);
    if(href){
      wx.navigateTo({
        url: '../post/post?href=' + href,
      })
    }else{
      wx.navigateTo({
        url: '../post/post?id=' + post_id,
      })
    }
  },

  // goWx:function(){
  //   wx.navigateTo({
  //     url: '/pages/my/service/service',
  //   })
  // },

})