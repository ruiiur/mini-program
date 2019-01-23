var util = require('../../utils/util.js');
var server = require('../../utils/server.js');
Page({
    data: {

    },
    onLoad: function (query) {
        // scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
        const scene = decodeURIComponent(query.scene)
        // 获取地区信息 
        var couTime=setInterval(function(){
            if(wx.getStorageSync("openId")){
                clearInterval(couTime);
                let params={
                    // 'userId':'7430C105-348C-4F27-8B2F-7F805C11B7F3',
                    'userId':"110A6516-154D-46E6-8C10-62AC5B1D7D04",
                    'openId':wx.getStorageSync("openId")
                }
                util.httpRequest(server.userLogin,params,'get').then(res=>{
                    console.log('登陆',res);
                    if(res.ResultCode==1){
                        wx.setStorageSync('userId', res.Result.UserID);//存储userid  
                        wx.setStorageSync('orgId', res.Result.OrgID);//存储orgid  
                        wx.switchTab({ 
                            url:"../home/home"
                        })
                    }
                })
            }
        },1000)
    }
})