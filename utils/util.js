// const formatTime = date => {
//   const year = date.getFullYear()
//   const month = date.getMonth() + 1
//   const day = date.getDate()
//   const hour = date.getHours()
//   const minute = date.getMinutes()
//   const second = date.getSeconds()
//   return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
// }
// const formatNumber = n => {
//   n = n.toString()
//   return n[1] ? n : '0' + n
// }
// const numberToFixed = n => {
//   n = n.toFixed(2) * 100 + '%'
//   return n
// }

// function errorWarn(error){
//   wx.showToast({
//   // image: '/image/errorIcon.png',
//   duration: 2000,
//   title: error,
//   mask: true
//   })
//  }
 
module.exports = {
  // formatTime: formatTime,
}
