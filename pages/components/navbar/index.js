// components/navbar/index.js
const App = getApp();

Component({
  options: {
    addGlobalClass: true,
  },
  externalClasses: ['custom-class'],
  /**
   * 组件的属性列表
   */
  properties: {
    pageName:String,
    selectTab:String,
    tabCount:Number,
    showNav: {
      type: Boolean,
      value: true
    },
    bgColor:{
      type: String,
      value: '#333'
    },
    iconColor:{
      type: String,
      value: '#fff'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
  },
  lifetimes: {
    attached: function () {
      this.setData({
        navHeight: App.globalData.navHeight,
        navTop: App.globalData.navTop
      })
     }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //回退
    _navBack: function () {
      // wx.navigateBack({
      //   delta: 1
      // })  
      wx.switchTab({
        url: '/pages/home/home',
      }) 
    },
    //回主页
    _toIndex: function () {
      wx.switchTab({
        url: '/pages/tabBar/index/index'
      })
    },
    clickTab: function (e) {
      let dash = e.target.dataset.hash;
      this.triggerEvent("icre", { "dash": dash }, {})
    }
  }
})
