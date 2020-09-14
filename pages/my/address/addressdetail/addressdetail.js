// pages/info/info.js
var that;
var app = getApp();
var base = require('../../../../utils/base.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    addressId: 0,
    name: '',
    phone: '',
    zip: '',
    address: '',
    is_default: false,
    region: ['', '', ''],
    isClick:false,
    isHasSubmit:false,//判断是否提交过一次
    isShowNameTip:false,
    isShowPhoneTip:false,
    isShowRegionTip:false,
    isShowAddressTip:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this; 
    var id = options.id;
    that.setData({
      addressId: id ? id : 0
    });

    if (that.data.addressId){
      let param = {
        page_code: "p002",
        customer_addr_id: that.data.addressId
      };
      var params = {
        url: app.globalData.domainUrl,
        data:param,
        method:'GET',
        sCallback: function (res) {
          var datas = res.data.data;
          that.setData({
            name: datas.name,
            phone: datas.phone,
            zip: (datas.zip===null)?"":datas.zip,
            address: datas.address,
            is_default: datas.is_default==1?true:false,
            region:[datas.province,datas.city,datas.area]
          });
        }
      };
      base.httpRequest(params);

    }
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
  setNameInput: function(e) {
    that.setData({
      name: e.detail.value
    })
    that.isShowTip('name');
  },
  setPhoneInput: function (e) {
    let value = this.validateNumber(e.detail.value)
      this.setData({
        phone:value
      })
    that.isShowTip('phone');
  },
  setZipInput: function (e) {
    let value = that.validateNumber(e.detail.value)
    that.setData({
      zip:value
    })
  },
  bindRegionChange: function(e) {
    that.setData({
      region: e.detail.value
    })
    that.isShowTip('region');
  },
  setAddressInput: function (e) {
    that.setData({
      address: e.detail.value
    })
    that.isShowTip('address');
  },
  radiocon: function (e) {
    // var is_default = that.data.is_default;
    that.setData({
      is_default: !that.data.is_default
    });
  },
  
  //是否显示提示
  isShowTip:function(type,value=0){
    if(type == 'name'){
      if((that.data.name.length < 2 || that.data.name.length > 10) && that.data.isHasSubmit){
        that.setData({isShowNameTip:true});
      }else{
        that.setData({isShowNameTip:false});
      }
    }else if(type == 'phone'){
      var myreg = /^1(3|4|5|7|8)\d{9}$/;///^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
      if(((!myreg.test(that.data.phone)) || that.data.phone.length < 11) && that.data.isHasSubmit){
        that.setData({isShowPhoneTip:true});
      }else{
        that.setData({isShowPhoneTip:false});
      }
    }else if(type == 'region'){
      if((that.data.region[0] == '' || that.data.region[1] == '' || that.data.region[2] == '') && that.data.isHasSubmit){
        that.setData({isShowRegionTip:true});
      }else{
        that.setData({isShowRegionTip:false});
      }
    }else if(type == 'address'){
      if((that.data.address.length < 5 || that.data.address.length > 50) && that.data.isHasSubmit){
        that.setData({isShowAddressTip:true});
      }else{
        that.setData({isShowAddressTip:false});
      }
    }else if(type == 'submit'){
      that.setData({
        isHasSubmit:value
      });
    }
  },
  validateNumber(val) {
    return val.replace(/\D/g, '')
  },
  //删除地址信息
  deleteAddress: function () {
    if (wx.getStorageSync('customerId') && !wx.getStorageSync('get_user_info') && !wx.getStorageSync('get_phone_info')) {
      wx.showModal({
        title: '提示',
        content: '你确定要删除该地址信息？',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定');
            var param = {
              page_code: 'p002',
              type: "del",
              customer_addr_id: that.data.addressId
            };
            var params = {
              url: app.globalData.domainUrl,
              data:param,
              method:'GET',
              sCallback: function (res) {
                var datas = res.data.data;
                if (datas) {
                  wx.navigateBack({
                    delta: 1
                  });
                }
              }
            };
            base.httpRequest(params);
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })

    } else {
      wx.showModal({
        title: '提示',
        content: '请完成授权后再编辑信息。',
        showCancel: false
      });
    }
  },
  // 提示消息
  // 姓名：收货人姓名长度需要在2-25个字符之间，不能包含非法字符
  // 手机号码：手机号码为十一位，格式不对，请重新输入
  // 所在地区：请选择所在地区
  // 详细地址：详细地址长度需要在5-120个字符之间，不能包含非法字符
  // 保存成功
  //提交地址信息
  submitAddress: function(){
    if (wx.getStorageSync('customerId') && !wx.getStorageSync('get_user_info') && !wx.getStorageSync('get_phone_info')){
        that.isShowTip('submit',true);
      var myreg = /^1(3|4|5|7|8)\d{9}$/;
      if (that.data.name.length < 2 || that.data.name.length > 10){
        wx.showModal({
          title: '提示',
          content: '请输入姓名长度在2-10位之间，不能包含非法字符.',
          showCancel: false
        });
        return false;
      } else if ((!myreg.test(that.data.phone)) || that.data.phone.length < 11){
        wx.showModal({
          title: '提示',
          content: '手机号码为十一位，格式不对，请重新输入.',
          showCancel: false
        });
        return false;
      } else if (that.data.region[0] == '' || that.data.region[1] == '' || that.data.region[2] == ''){
        wx.showModal({
          title: '提示',
          content: '请选择所在地区.',
          showCancel: false
        });
        return false;
      } else if (that.data.address.length < 5 || that.data.address.length > 50){
        wx.showModal({
          title: '提示',
          content: '请输入详细地址长度在5-50位之间，不能包含非法字符.',
          showCancel: false
        });
        return false;
      }
      var param = {
        page_code:'p002',
        type:"editAddress",
        name: that.data.name,
        phone: that.data.phone,
        zip: that.data.zip,
        province: that.data.region[0],
        city: that.data.region[1],
        area: that.data.region[2],
        address: that.data.address,
        is_default: that.data.is_default?1:0,
        // customer_id:wx.getStorageSync('customerId'),
        customer_addr_id: that.data.addressId
      };
      var params = {
        url: app.globalData.domainUrl,
        data:param,
        method:'POST',
        sCallback: function (res) {
          var datas = res.data.data;
          if (datas){
            wx.navigateBack({
              delta:1
            });
          }
        }
      };
      base.httpRequest(params);
    }else{
      wx.showModal({
        title: '提示',
        content: '请完成授权后再编辑信息。',
        showCancel: false
      });
    }
  },
})
