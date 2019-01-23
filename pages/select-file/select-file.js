var util = require('../../utils/util.js');
var server = require('../../utils/server.js');
Page({
    data: {
        headTop:0,
        pageNo:1,//当前页
        totalNum:'',//总共的数据条数
        pageSize:15,//每次请求的个数
        noData:'',
        fileList:[],//文件列表
    },
     // 下拉刷新  
     onPullDownRefresh: function () {  
        // 显示顶部刷新图标  
        wx.showNavigationBarLoading();  
        var that = this;  
        that.setData({
            fileList: [],
            noData:'',
            pageNo:1
        });
        that.searchFile(1);
        //  隐藏导航栏加载框  
        wx.hideNavigationBarLoading();  
        // 停止下拉动作  
        wx.stopPullDownRefresh();  
    },  
    //页面上拉触底事件的处理函数 
    onReachBottom: function () {  
        var that = this;  
        // 显示加载图标  
        wx.showLoading({  
        title: '玩命加载中',  
        })  
        // 页数+1  
        that.setData({
           pageNo:that.data.pageNo+1 
        })
        if(that.data.pageNo>=that.data.totalNum/that.data.pageSize){
            that.data.noData = "没有更多数据啦";
            that.setData({
                noData: that.data.noData 
            })
        }
        else{
            that.searchFile(that.data.pageNo);
        }
        // 隐藏加载框  
        wx.hideLoading();  
    },  
    // 搜索文件
    searchFile:function(page){
        // 获取产品附件
        let params={
            'pageIndex':page,
            "pageSize":this.data.pageSize,
        }
        util.httpRequest(server.queryAttachmentProductPagingList,params,'post').then(res=>{
            console.log('产品附件',res);
            if(res.ResultCode==1){
                console.log('获取产品附件成功');
                if(res.Result.list.length!=0){
                    for(var i=0;i<res.Result.list.length;i++){
                        res.Result.list[i].CreatedDate= res.Result.list[i].CreatedDate.substr(0,10);
                        this.data.fileList.push(res.Result.list[i]);
                    }
                    this.setData({
                        fileList:this.data.fileList,
                        totalNum:res.Result.totalNum
                    });
                }
            }
            else{
                console.log('获取产品附件失败');
            }
        })
    },
    // 选择文件
    chooseFlieSrc:function(e){
        wx.setStorageSync("fileName",e.currentTarget.dataset.name);
        wx.setStorageSync("filePath",e.currentTarget.dataset.src);
        wx.setStorageSync("attachmentType",2);
        wx.setStorageSync("attachmentID",e.currentTarget.dataset.id);
        console.log(e.currentTarget.dataset.id,'ddddddddddddd');
        wx.navigateBack({
            delta:1
        })
        // wx.navigateTo({
        //     url:'../update-product/update-product'
        // })
    },
    onLoad: function () {
        this.setData({
            headTop:getApp().globalData.navHeight,
        });
        this.searchFile(1);
    }
})