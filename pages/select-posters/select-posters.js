var util = require('../../utils/util.js');
var server = require('../../utils/server.js');
Page({
    data: {
        headTop:0,
        pageNo:1,//当前页
        totalNum:'',//总共的数据条数
        pageSize:20,//每次请求的个数
        noData:'',
        posterList:[],//文件列表
    },
     // 下拉刷新  
     onPullDownRefresh: function () {  
        // 显示顶部刷新图标  
        wx.showNavigationBarLoading();  
        var that = this;  
        that.setData({
            posterList: [],
            noData:'',
            pageNo:1
        });
        that.searchPoster(1);
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
            that.searchPoster(that.data.pageNo);
        }
        // 隐藏加载框  
        wx.hideLoading();  
    },  
    // 选择海报
    chooseFlieSrc:function(e){
        this.data.posterList[e.currentTarget.dataset.index].selected=!this.data.posterList[e.currentTarget.dataset.index].selected;
        for(var i=0;i<this.data.posterList.length;i++){
            if(i!=e.currentTarget.dataset.index){
                this.data.posterList[i].selected=false;
            }
        }
        this.setData({
            posterList:this.data.posterList,
        });
    },
     // 确定海报
     selectPoster:function(){
        for(var i=0;i<this.data.posterList.length;i++){
            if(this.data.posterList[i].selected==true){
                wx.setStorageSync("posterID",this.data.posterList[i].ID);
                wx.setStorageSync("picPosterImage",this.data.posterList[i].MoveImg);
            }
        }
        wx.navigateBack({
            delta:1
        })
        // wx.navigateTo({
        //     url:'../update-product/update-product'
        // })
    },
    // 获取海报
    searchPoster:function(page){
         let params={
            "orgID": "C94C21D6-4C6D-4A80-BD19-5341E7014D47",
            'pageIndex':page,
            "pageSize":this.data.pageSize,
        }
        util.httpRequest(server.getPicGalleryPagingListByOrgId,params,'post').then(res=>{
            console.log('产品海报',res);
            if(res.ResultCode==1){
                console.log('获取产品海报成功');
                if(res.Result.list.length!=0){
                    for(var i=0;i<res.Result.list.length;i++){
                        res.Result.list[i].selected=false;
                        this.data.posterList.push(res.Result.list[i]);
                    }
                    this.setData({
                        posterList:this.data.posterList,
                        totalNum:res.Result.totalNum
                    });
                    // console.log(this.data.posterList,'posterList');
                }
            }
            else{
                console.log('获取产品海报失败');
            }
        })
    },
    onLoad: function () {
        this.setData({
            headTop:getApp().globalData.navHeight,
        });
        this.searchPoster(1);
    }
})