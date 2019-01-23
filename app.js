//app.js
App({
  globalData:{
    // appid:'wxbebd9560777432aa',//appid需自己提供，此处的appid我随机编写
    // secret:'16dce2477574220ac2c527734984992a',//secret需自己提供，此处的secret我随机编写
    appid:'wx165c5db881bfab5d',//appid需自己提供，此处的appid我随机编写
    secret:'222d908c70c1f2d42647e40ef0a3c52d',//secret需自己提供，此处的secret我随机编写
    navHeight:'',
  },
  onLaunch: function () {
    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
    // 登录
    var that=this;
    console.log('11111111111111');
    wx.login({
      success: function(res) {
        console.log('获取登录 Code：' + res.code)
        var d=that.globalData;//这里存储了appid、secret、token串 
        console.log(d.appid,'appid');
        console.log(d.secret,'secret');
        var loginUrl='https://api.weixin.qq.com/sns/jscode2session?appid='+d.appid+'&secret='+d.secret+'&js_code='+res.code+'&grant_type=authorization_code';
        // var loginUrl='https://api.weixin.qq.com/sns/jscode2session?appid=wxbebd9560777432aa&secret=16dce2477574220ac2c527734984992a&js_code='+res.code+'&grant_type=authorization_code';
        wx.request({
          url: loginUrl,
          data: {},
          method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          header: {
            'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
          success: function(res) {
              //回调处理
              // console.log(res,'hhhhhhhhhhhhhhhhhh');
              var obj={};
              obj.openid=res.data.openid;  
              obj.expires_in=Date.now()+res.data.expires_in;  
              console.log(obj);
              wx.setStorageSync('openId', res.data.openid);//存储openid  
          },
          fail: function(error) {
            console.log('获取用户登录态失败！',error);
          }
        })
      },
      fail: function() {
        console('登录获取Code失败！');
      }
    })

    // 获取导航高度
    wx.getSystemInfo({
      success: res => {
        //导航高度
        that.globalData.navHeight = res.statusBarHeight;
        console.log( that.globalData.navHeight,' that.globalData.navHeight');
      }, fail(err) {
        console.log(err);
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
})