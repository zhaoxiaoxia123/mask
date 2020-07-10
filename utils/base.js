
// 当noRefech为true时，不做未授权重试机制
function httpRequest(params, noRefetch) {
  let header = {};
  // console.log(wx.getStorageSync('token'));
  if(params.method == 'get' || params.method == 'GET'){
    header = {
      'content-type': "application/json",
      'Authorization':'Bearer ' + wx.getStorageSync('token')
    }
  }else if(params.method == 'post' || params.method == 'POST'){
    header = {
      'content-type': "application/x-www-form-urlencoded",
      'Authorization':'Bearer ' + wx.getStorageSync('token')
    }
  }else{
    header = {
      'content-type': "application/json"
    }
  }
  if (!params.method) {
      params.method = 'GET';
  }
  wx.request({
    url: params.url,
    data: params.data,
    method: params.method,
    header: header,
    success: function (res) {
      console.log(res);
      var code = res.data.code ? res.data.code.toString():'';
      var startChar = code.charAt(0);
      // console.log('startChar:-----');
      // console.log(startChar);
      if (startChar == '2') {
        params.sCallback && params.sCallback(res);
      } else {
        if (code == '404' || code == '400') {
          wx.clearStorage();
          wx.clearStorageSync();
          if(code == '400'){
            wx.navigateTo({
              url: "/pages/my/login/login",
            })
          }
        }
        //AOP
        if (code == '401') {
          if (!noRefetch) {
            _refetch(params);
          }
        }else{
          wx.showToast({
            title: res.data.message
          })
        }
        if (noRefetch) {
          params.eCallback && params.eCallback(res);
        }
      }
    },
    fail: function (err) {
      console.log(err);
    }
  })
}

function _refetch(params) {
  getTokenFromServer(params,(token) => {
    wx.setStorageSync('token',token);
    httpRequest(params, true);
  });
}
/**
 * 请求API接口，获取新的token
 */
function getTokenFromServer(params,callBack) {
  wx.login({
    success: function (res) {
      // 既然时一个工具类，就应该存粹一点，不要用 base.js 里的 request(params) 方法发起网络请求了
      // 这一点很重要
      wx.getUserInfo({
        withCredentials:true,
        success: function (res) {
          wx.request({
            url: params.url,
            method: 'POST',
            data: {
              page_code:'p010',
              code: r.code,
              type:'refresh',
              encryptedData:res.encryptedData, 
              iv:res.iv,
              share_by:wx.getStorageSync('shareBy')?wx.getStorageSync('shareBy'):''
            },
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
              // wx.setStorageSync('token', res.data.data.token);
              callBack && callBack(res.data.data.token);
            }
          });
        }
      });
      
    }
  });
}

module.exports = {
  httpRequest:httpRequest,
  _refetch:_refetch
};