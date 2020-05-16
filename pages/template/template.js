var temp = {
  ftservice: function (e) {
    var ftserviceflexwindow = e.currentTarget.dataset.item;
    if (ftserviceflexwindow) {
      ftserviceflexwindow = false;
    }else {
      ftserviceflexwindow = true;
    }
    return ftserviceflexwindow;
  },
  ftserviceq: function (e) {
    let ftserviceflexwindow = false;
    return ftserviceflexwindow;
  },
  calling: function (e) {
    wx.makePhoneCall({
      phoneNumber: '400 002 8767',
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  },
}
//导出，供外部使用
export default temp