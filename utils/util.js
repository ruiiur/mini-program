const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

// 头部配置很重要
var header = {
  'Accept': 'application/json',
  'content-type': 'application/json',
  'Authorization': 'x-www-form-urlencoded',
}
// 封装请求
function httpRequest(url,data,_method) {
  wx.showLoading({
    title: '加载中',
  })
  // console.log("header=="),
  console.log(header);
  return new Promise((resolve,reject)=>{
    wx.request({
      url: url,
      header: header,
      data: data,
      method: _method,
      success: function (res) {
        wx.hideLoading();
        // console.log('api post res',res.data);
        resolve(res.data);
        // if(res.data.ResultCode==1){
        // }
        // else{
        //   reject(res.data);
        //   console.log(res.data);
        // }
      },
      fail: function (error) {
        wx.hideLoading();
        wx.showModal({
          title: '网络错误',
          // title: res.data,
          content: '网络出错，请刷新重试',
          showCancel: false
        })
        reject(error.data);
        console.log(error,'这是报错')
      }
    })
  })
} 

/* api接口promise */
var Promise = require('../lib/es6-promise.min.js'); 
function wxPromisify(fn, scope) {  
  return function (obj = {}) {    
    return new Promise((resolve, reject) => {      
      obj.success = function (res) {        
        resolve(res);      
      }      
      obj.fail = function (res) {        
        reject(res);      
      }
      if(scope){
        //改变this指向
        var newFn = fn.bind(scope);
        newFn(obj);
      }else{
        fn(obj);
      }      
    })  
  }
}
/* store封装 */
function setStorage(key, value, isSync=true){
  if(isSync){
      try {
          wx.setStorageSync(key, value);
      } catch (e) {    
          wx.showToast({
            title: e,
            duration: 2000
          }); 
      }
  }else{
      wx.setStorage({
        key: key,
        data: value
      });
  }
}
function getStorage(key, isSync=true){
  if(isSync){
      try {
        var value = wx.getStorageSync(key);
        if (value) {
          return value;
        }
      } catch (e) {
          wx.showToast({
            title: e,
            duration: 2000
          }); 
      }
  }else{
      wx.getStorage({
        key: key,
        success: function(res) {
            return res.data;
        },
        fail: function(){
            return '';
        } 
      });
  }
}
function removeStorage(key, isSync=true){
  if(isSync){
      try {
        wx.removeStorageSync(key);
      } catch (e) {
        wx.showToast({
          title: e,
          duration: 2000
        }); 
      }
  }else{
      wx.removeStorage({
        key: key,
        success: function(res) {
          console.log(res.data)
        } 
      });
  }
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime,
  getStorage: getStorage,
  removeStorage: removeStorage,
  setStorage: setStorage,
  wxPromisify: wxPromisify,
  httpRequest: httpRequest,
  header: header,
}
