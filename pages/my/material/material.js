// pages/circle_ads/circle_ads.js
var that;
var app = getApp();
var base = require('../../../utils/base.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swipers: [],
    indicatorDots: true,
    indicatorColor: "#8b8b8b",
    indicatorActiveColor: "#333",
    autoplay: true,
    interval: 6000,
    duration: 500,
    circular: true,
    typeAd:18,//广告类型
    typePost:19,  //文章类型
    post:[], //文章列表
    imgsDownload:[],
    isCanClick:true,
    code:'',
    message:'',
    imgLoad:'',
    offset: 1,
    pageCount: 8,
    isLast: false,
    // progress:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    that = this;
    base.loading();
    var param = {
      page_code:'p001',
      type:that.data.typeAd,
    };
    that.getAdList(param,1);

    var param = {
      page_code:'p001',
      type:that.data.typePost,
      offset: (that.data.offset - 1) * that.data.pageCount,
      page: that.data.pageCount
    };
    that.getAdList(param,2);

    setTimeout(function(){
      wx.stopPullDownRefresh();
    },1000);
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
    
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        cricleed: 1
      })
    }
    wx.login({
      success: r => {
        that.setData({
          code:r.code
        });
      }
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
    that.setData({
      post: [],
      isLast: false,
      offset: 1,
      imgLoad:''
    });
    that.onLoad();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (!that.data.isLast) {
      that.setData({
        offset: that.data.offset + 1
      });
      base.loading(1000);
      var param = {
        page_code:'p001',
        type:that.data.typePost,
        offset: (that.data.offset - 1) * that.data.pageCount,
        page: that.data.pageCount
      };
      that.getAdList(param,2);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  imgYu:function(event){
    var src = event.currentTarget.dataset.src;
    var imgList = event.currentTarget.dataset.list;
  //---------如果安卓不能查看大图可以替换一下http
     var imgarr=[]
     for (var i = 0; i<imgList.length;i++){//https 查看大图时不显示，换成http就可以了
         var newimg = imgList[i].url//.replace('https', 'http')
         imgarr.push(newimg)
     }
     imgList = imgarr;
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
          //urls: imgarr // 替换http用这个，需要预览的图片http链接列表
    })   
  },
  search:function(){
    var param = {
      page_code:'p001',
      type:that.data.typePost,
      keyword:that.data.keyword
    };
    that.getAdList(param,2);
  },
  
  getAdList: function(param,num) {
    var params = {
      url: app.globalData.domainUrl,
      data:param,
      sCallback: function (res) {
        var datas = res.data;
        if(num == 1){
          that.setData({
            swipers: datas.data
          });
        }else if(num == 2){
          wx.hideToast();
          that.setData({
            post: that.data.post.concat(datas.data),
            message:'您还没有相关信息',
            imgLoad:'../../img/wu.png',
          });
          if (datas.data.length <= 0 || datas.data.length < that.data.pageCount) {
            that.setData({
              isLast: true
            });
          }
        }
      }
    };
    base.httpRequest(params);
  },

  // 复制
  copy: function (e) {
    let content = e.currentTarget.dataset.content;
    wx.setClipboardData({
      data: content,
      success: function (res) {
        wx.showToast({
          title: "复制成功",
          duration: 3000
        })  
      }
    })
  },
  // 收藏
  collection: function () {
    wx.showToast({
      title: "收藏成功",
      duration: 3000
    })
  },
  getMergePic:function(e){
    let ind = e.currentTarget.dataset.index;//触发函数
    if(!wx.getStorageSync('customerId')){
      wx.showToast({
        title: "请先登录",
        duration: 1000
      })
      return false;
    }
    that.setDownloadClick(false);
    wx.showToast({
      title: "开始保存素材",
      icon: "loading",
      duration: 1000*60
    })
    let param = {
      page_code:'p019',
      img:that.data.post[ind].xz_img_url.toString(),
      code:that.data.code,
      source:"app"
    };
    var params = {
      url: app.globalData.domainUrl,
      data:param,
      method:'GET',
      sCallback: function (res) {
        var datas = res.data;
        that.setData({
          imgsDownload: datas.data.path
        });
        if(datas.data.is_logout == 2){
          wx.hideLoading();
          wx.clearStorage({
            complete: (res) => {
              wx.showToast({
                title: "即将退出登录",
                icon: "loading"
              })
              wx.switchTab({
                url: '/pages/home/home',
              })
            },
          })
        }else{
          that.download();
        }
      }
    };
    base.httpRequest(params);

  },

  // 下载
  download: function () {
    let len = that.data.imgsDownload.length;
    wx.hideLoading();
    for (let i = 0; i < len; i++) {
      wx.showToast({
        title: "保存素材中...",
        icon: "loading",
        duration: 1000*60
      });
      wx.downloadFile({
        url: that.data.imgsDownload[i], // 需下载的每一张图片路径
        success: function (res) {
        var path = res.tempFilePath;
        wx.saveImageToPhotosAlbum({
          filePath: path,
          success(result) {
            if ((i+1) == that.data.imgsDownload.length) {
              wx.hideLoading();
              wx.showToast({
                title: '保存完成',
                duration: 2000,
                mask: true,
              });
            }
            that.setDownloadClick(true);
          },
          fail(result) {
            wx.openSetting({
              success: (res) => {
              }
            })
            that.setDownloadClick(true);
          }
        });
        }
      });
    }
  },
  // 我的
  myads: function (e) {
    wx.navigateTo({
      url: '../circle_ads/my_ads/my_ads',
    })
  },
  setDownloadClick:function(value){
    that.setData({
      isCanClick:value
    });
  },
})