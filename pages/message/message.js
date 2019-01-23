Page({
    data: {
        headTop:0,
    },
    // 去公告通知
    toNotice:function(){
        wx.navigateTo({
            url:"../notice/notice"
        })
    },
    onLoad: function () {
        this.setData({
            headTop:getApp().globalData.navHeight,
        });
    }
})