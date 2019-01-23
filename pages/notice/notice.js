Page({
    data: {
        headTop:0,
    },
    // 去公告通知
    toNotice:function(){
        wx.navigateTo({
            // url:
        })
    },
    onLoad: function () {
        this.setData({
            headTop:getApp().globalData.navHeight,
        });
    }
})