// pages/info/info.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    totalfee: 0,
    items: [
      {
        id: 0,
        title: '无创水光套装',
        imgUrl: '../../img/shop3.jpg',
        sale: '199',
        count: 1,
        selected: true,
        total: 855,
        abstract: '探究奢华的产品质感'
      },
      {
        id: 1,
        title: '精华液',
        count: 1,
        selected: true,
        total: 855,
        imgUrl: '../../img/shop3.jpg',
        sale: 2880,
        abstract: '探究奢华的产品质感'
      },

    ]
  },
  // checkboxChange: function (e) {
  //   console.log('checkbox发生change事件，携带value值为：', e.detail.value)
  // },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    var self = this;
    var items = [];
    items = this.data.items;   //获得items数组
    let fee = 0;
    for (var i = 0; i < this.data.items.length; i++) {
      fee = fee + items[i].count * items[i].sale;
    }
    self.setData({
      totalfee: fee
    })
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
  // 跳转规格弹窗
  delivery: function (e) {
    var that = this;
    var flexwindow;
    if (this.data.flexwindow == true) {
      flexwindow = false;
    }
    else {
      flexwindow = true;
    }
    that.setData({
      flexwindow: flexwindow
    });
  },
  coupon: function (e) {
    var that = this;
    var couponflexwindow;
    if (this.data.couponflexwindow == true) {
      couponflexwindow = false;
    }
    else {
      couponflexwindow = true;
    }
    that.setData({
      couponflexwindow: couponflexwindow
    });
  },
  close: function (e) {
    let self = this
    let flexwindow = false;

    self.setData({
      flexwindow: flexwindow
    })
  },
  close1: function (e) {
    let self = this
    let couponflexwindow = false;

    self.setData({
      couponflexwindow: couponflexwindow
    })
  },

  // 减按钮控件
  jianFn: function (e) {
    let self = this
    let items = this.data.items;
    let id = e.currentTarget.dataset.id;
    if (items[id].count <= 1) {
      items[id].count = 1;
      self.setData({
        items: items
      })
    } else {
      items[id].count = items[id].count - 1;
      let fee = 0;
      for (var i = 0; i < this.data.items.length; i++) {
        fee = fee + items[i].count * items[i].sale;
      }

      self.setData({
        items: items,
        totalfee: fee
      })
    }
  },
  // 加按钮控件
  plusFn: function (e) {
    var self = this
    var items = [];
    items = this.data.items;   //获得items数组
    var id = e.currentTarget.dataset.id; // 获得wxml的data-id的值 data-id与dataset.id对应
    items[id].count = items[id].count + 1;
    // let totalfee = this.data.totalfee;
    let fee = 0;
    for (var i = 0; i < this.data.items.length; i++) {
      fee = fee + items[i].count * items[i].sale;
    }
    self.setData({
      items: items,
      totalfee: fee
    })
  },


  checkOne: function (e) {
    let self = this;
    var items = [];

    items = this.data.items;   //获得items数组
    var id = e.currentTarget.dataset.id;
    var selected = items[id].selected;
    console.log("-", selected);
    selected = !selected;
    this.setData({
      selected: selected
    })
  }
})