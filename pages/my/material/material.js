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
    cricleShow: false,//控制下拉列表的显示隐藏，false隐藏、true显示
    cricleData: ['无创水光礼盒装（8+1）', '精华液3支装', '表皮电子3片装', '导入仪单个装', '混合整箱装'],//下拉列表的数据
    index: 0,//选择的下拉列表下标
    typeAd:18,//广告类型
    typePost:19,  //文章类型
    post:[], //文章列表
    keyword:'',
    imgsDownload:[],
    isCanClick:true,
    code:'',
    message:'',
    imgLoad:'',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    base.loading();
    that = this;
    var param = {
      page_code:'p001',
      type:that.data.typeAd,
    };
    that.getAdList(param,1);
    
    var param = {
      page_code:'p001',
      type:that.data.typePost,
      keyword:that.data.keyword
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

    base.loading();
    that.onLoad();
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
  imgYu:function(event){
    var src = event.currentTarget.dataset.src;//获取data-src,(自动识别data-后面的 如果是data-aaa这边就直接写aaa)
    var imgList = event.currentTarget.dataset.list;//获取data-list  是一个图片地址数据
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
  setKeywordInput:function(e){
    var value = e.detail.value;
    that.setData({
      keyword: value
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
      // method:'GET',
      sCallback: function (res) {
        var datas = res.data;
        console.log(datas);
        if(num == 1){
          that.setData({
            swipers: datas.data
          });
        }else if(num == 2){
          that.setData({
            post: datas.data,
            message:'您还没有相关信息',
            imgLoad:'../../img/wu.png',
          });
        }
      }
    };
    base.httpRequest(params);


  },

  // 点击下拉显示框
  cricleTap() {
    this.setData({
      cricleShow: !this.data.cricleShow
    });
  },
  // 点击下拉列表
  optionTap(e) {
    let Index = e.currentTarget.dataset.index;//获取点击的下拉列表的下标
    this.setData({
      index: Index,
      cricleShow: !this.data.cricleShow
    });
  },
  // 复制
  copy: function (e) {
    let content = e.currentTarget.dataset.content;
    wx.setClipboardData({
      data: content,
      success: function (res) {
        console.log(res);
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
    let ind = e.currentTarget.dataset.index;　　　　　　//触发函数
    console.log(!wx.getStorageSync('customerId'));

    if(!wx.getStorageSync('customerId')){
      wx.showToast({
        title: "请先登录",
        duration: 1000
      })
      return false;
    }
    that.setDownloadClick(false);
    console.log(that.data.post[ind].xz_img_url.toString());
    
    wx.showToast({
      title: "开始保存素材",
      icon: "loading",
      duration: 2000
    })
    
    let param = {
      page_code:'p019',
      img:that.data.post[ind].xz_img_url.toString(),
      code:that.data.code,
      source:"app"
      // customer_id: wx.getStorageSync('customerId') ? wx.getStorageSync('customerId') : 0,
    };
    var params = {
      url: app.globalData.domainUrl,
      data:param,
      method:'GET',
      sCallback: function (res) {
        var datas = res.data;
        console.log(datas);
        wx.showToast({
          title: datas.message,
          duration: 2000
        });
        that.setData({
          imgsDownload: datas.data.path
        });
        console.log('datas.data.customer_code:-----');
        console.log(datas.data.customer_code);
        // if(datas.data.customer_code != ''){
        //   that.addStorage(datas.data.customer_code);
        // }
        if(datas.data.is_logout == 2){
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

  // addStorage: function(datas){
  //   wx.setStorageSync('customerId', datas.c_id);
  //   wx.setStorageSync('unionid', datas.frozeno_unionid);
  //   wx.setStorageSync('sessionKey', datas.session_id);
  //   wx.setStorageSync('memberNo', datas.c_number);  //会员号
  //   wx.setStorageSync('level', datas.frozeno_level);  //等级
  //   wx.setStorageSync('phone', datas.c_phone);  //手机号
  //   wx.setStorageSync('token', datas.token);
  // },
  // 下载
  download: function () {
    console.log(that.data.imgsDownload);
    for (let i = 0; i < that.data.imgsDownload.length; i++) {
      wx.hideLoading();
      wx.showToast({
        title: "保存第"+(i==0?1:i)+"张素材中",
        icon: "loading",
        duration: 5000
      })
      wx.downloadFile({
        url: that.data.imgsDownload[i], // 需下载的每一张图片路径
        success: function (res) {
        var path = res.tempFilePath;
        wx.saveImageToPhotosAlbum({
          filePath: path,
          success(result) {
            console.log("成功");
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
              console.log(res);
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
    console.log(e)
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