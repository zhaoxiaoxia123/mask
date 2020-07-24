// pages/info/info.js
var that;
var app = getApp();
import tmpObj from '../template/template.js'
var base = require('../../utils/base.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    icons: ["../img/plus_pink.png", "../img/jian_pink.png"],
    check: false,
    totalfee: 0,
    memberNo: wx.getStorageSync('memberNo'),
    offset: 1,
    pageCount: 20,
    isLast: false,
    items: [],
    isBack: false,
    ftserviceflexwindow: false,
    dryInfos:[],
    gift:[],
    dryAmount:0,
    experience_amount:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    that.setData({
      isBack: false,
      experience_amount:app.globalData.experience_amount
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
  onShow: function () {
    if (!that.data.isBack){  //判断返回键返回
      that.setData({
        items:[],
        totalfee:0,
        check:false
      });
    } else {   //判断直接点击进入
      that.setData({
        isBack: false  
      });
    }
    // that.setData({  //解决佳总手机返回不刷新 ，移动到getShoppingList方法内
    //   items:[]
    // });
    if (wx.getStorageSync('customerId') && !wx.getStorageSync('get_user_info') && !wx.getStorageSync('get_phone_info') && that.data.items.length <= 0) {
      var param_s = {
        page_code: 'p012',
        type: "shopping_list",
        // customer_id: wx.getStorageSync('customerId'),
        offset: (that.data.offset - 1) * that.data.pageCount,
        page: that.data.pageCount
      };
      // var param_s = '/p012?type=shopping_list&customer_id='+wx.getStorageSync('customerId')+'&offset='+((that.data.offset - 1) * that.data.pageCount)+'&page='+that.data.pageCount;
      that.getShoppingList(param_s);
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
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (!that.data.isLast) {
      that.setData({
        offset: that.data.offset + 1
      });
      //列表
      var param_s = {
        page_code: 'p012',
        type: "shopping_list",
        // customer_id: wx.getStorageSync('customerId'),
        offset: (that.data.offset - 1) * that.data.pageCount,
        page: that.data.pageCount
      };
        // var param_s = '/p012?type=shopping_list&customer_id='+wx.getStorageSync('customerId')+'&offset='+((that.data.offset - 1) * that.data.pageCount)+'&page='+that.data.pageCount;
        that.getShoppingList(param_s);
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  ftservice: function (e) {
    let ret = tmpObj.ftservice(e);
    that.setData({
      ftserviceflexwindow: ret
    });
  },
  ftserviceq: function (e) {
    let ret = tmpObj.ftserviceq(e);
    that.setData({
      ftserviceflexwindow: ret
    })
  },
  calling: function (e) {
    tmpObj.calling(e);
  },
  //进入首页页面
  gohome: function () {
    wx.switchTab({
      url: '/pages/home/home',
    })
  },

  //以下为自定义点击事件
  getShoppingList: function(param) {
    var params = {
      url: app.globalData.domainUrl,
      data:param,
      method:'GET',
      sCallback: function (res) {
        var datas = res.data.data;
        that.setData({  //解决佳总手机返回不刷新
          items:[]
        }); 
        that.setData({
          items: that.data.items.concat(datas.shopping),
          dryInfos:datas.dryInfos,
          gift:datas.gift
        });
        if (datas.shopping.length <= 0 || datas.shopping.length < that.data.pageCount) {
          that.setData({
            isLast: true
          });
        }
      }
    };
    base.httpRequest(params);

  },
  // 减按钮控件
  jianFn: function(e) {
    var items = that.data.items;
    var id = e.currentTarget.dataset.id;
    if (items[id].product_count <= 1) {
      items[id].product_count = 1;
      if (items[id].product_count <= items[id].stock) { //库存是否足够来显示单选按钮
        items[id].is_enough = true;
        // items[id].selected = true;  //true  为1时点减号也会被选中
      } else {
        items[id].is_enough = false;
        items[id].selected = false;
      }
      that.setData({
        items: items
      })
    } else {
      items[id].product_count = items[id].product_count - 1;
      if (items[id].product_count <= items[id].stock){ //库存是否足够来显示单选按钮
        items[id].is_enough = true;
        items[id].selected = true;
      }else{
        items[id].is_enough = false;
        items[id].selected = false;
      }
      var fee = 0;
      for (var i = 0; i < items.length; i++) {
        if (items[i].selected) {
          // fee = that.returnFee(fee, items[i].product_count, items[i].frozeno_discount_amount);
          fee = that.returnFee(fee, items[i].product_count, items[i].customer_amount);
        }
      }
      that.setData({
        items: items
      });
      that.setTotalFee(fee);
    }
  },
  // 加按钮控件
  plusFn: function(e) {
    var items = [];
    items = that.data.items; //获得items数组
    var id = e.currentTarget.dataset.id; // 获得wxml的data-id的值 data-id与dataset.id对应
    items[id].product_count = parseInt(items[id].product_count) + 1;

    if (items[id].product_count <= items[id].stock) { //库存是否足够来显示单选按钮
      items[id].is_enough = true;
      items[id].selected = true;
    } else {
      items[id].is_enough = false;
      items[id].selected = false;
    }
    var fee = 0;
    for (var i = 0; i < items.length; i++) {
      if (items[i].selected) {
        // fee = that.returnFee(fee, parseInt(items[i].product_count), items[i].frozeno_discount_amount);
        fee = that.returnFee(fee, parseInt(items[i].product_count), items[i].customer_amount);
      }
    }
    that.setData({
      items: items
    });
    that.setTotalFee(fee);
  },

  /**
   * 是否选中导入仪
   */
  checkDry: function() {
    var amount = that.data.dryInfos.dry_amount ;//e.currentTarget.dataset.amount;
    var items = that.data.items;
    var dryInfos = that.data.dryInfos;
    if (dryInfos.is_check_dry == 1) {
      dryInfos.is_check_dry = 2;
      that.setData({
        dryAmount:0
      });
    } else {
      dryInfos.is_check_dry = 1;
      that.setData({
        dryAmount:amount
      });
    }
    that.setData({
      dryInfos: dryInfos
    });
    
    var fee = 0;
    for (var i = 0; i < items.length; i++) {
      if (items[i].selected) {
        // fee = that.returnFee(fee, parseInt(items[i].product_count), items[i].frozeno_discount_amount);
        fee = that.returnFee(fee, parseInt(items[i].product_count), items[i].customer_amount);
      }
    }
    that.setTotalFee(fee);
    console.log('that.data.dryInfos.is_check_dry:-------');
    console.log(that.data.dryInfos.is_check_dry);
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
        // fee = that.returnFee(fee, items[i].product_count, items[i].frozeno_discount_amount);
        fee = that.returnFee(fee, items[i].product_count, items[i].customer_amount);
      }
    }
    that.setData({
      items: items
    });
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
      for (var a = 0; a < items.length; a++) {
        if (items[a].is_enough){
          items[a].selected = true;
        }
      }
    }
    that.setData({
      check: check,
      items: items
    });
    that.checkDry();
    // var fee = 0;
    // for (var i = 0; i < items.length; i++) {
    //   if (items[i].selected) {
    //     // fee = that.returnFee(fee, items[i].product_count, items[i].frozeno_discount_amount);
    //     fee = that.returnFee(fee, items[i].product_count, items[i].customer_amount);
    //   }
    // }
    // that.setTotalFee(fee); //赋值合计金额
  },

  returnFee: function (fee, product_count, frozeno_discount_amount) {

    fee = fee + (product_count * frozeno_discount_amount); 
    return fee;
  },
  //赋值合计金额
  setTotalFee: function(fee) {
    var dryAm = 0;
    if(that.data.dryInfos.is_check_dry == 1){
      dryAm = that.data.dryAmount;
    }
    that.setData({
      totalfee: (parseFloat(fee)+ parseInt(dryAm)).toFixed(2) //加入导入仪金额
    })
  },
  //进入结算页面
  goConfirm: function() {
    var products = '';
    for (var i = 0; i < that.data.items.length; i++) {
      if (that.data.items[i].selected == true) {
        products += that.data.items[i].product_id + "," + that.data.items[i].product_count + "--";
      }
    }
    if (products == ''){
      wx.showToast({
        icon: "none",
        title: "请选择需要结算的商品"
      });
    }else{
      wx.navigateTo({
        url: '/pages/shopcat/orderconfirm/orderconfirm?products=' + products+'&isCheckDry='+that.data.dryInfos.is_check_dry,
      })
    }
  },
  //清除购物车商品
  deleteShopping:function(e){
    var shopping_id = e.currentTarget.dataset.id;
    let param = {
      page_code: 'p012',
      type: 'delete_shopping',
      shopping_id: shopping_id,
    };
    var params = {
      url: app.globalData.domainUrl,
      data:param,
      method:'POST',
      sCallback: function (res) {
        // var datas = res.data.data;
        wx.showToast({
          title: res.data.message
        });
        that.onShow();
      }
    };
    base.httpRequest(params);

  },
})