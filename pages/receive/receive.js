var util = require('../../utils/util.js');
var server = require('../../utils/server.js');
Page({
    data: {
        receiveType:[
            {name:'全部'},
            {name:'待签收'},
            {name:'已签收'},
            {name:'已拒收'},
            {name:'已取消'},
            {name:'变更申请'}
        ],//签收列表查找类型
        receiveIndex:0,//类型默认值
        orderSignList:[],//订单签收列表
        pageNo:1,//当前页
        totalNum:'',//总共的数据条数
        pageSize:10,//每次请求的个数
        noData:'',//没有更多数据提示
        isList:true,//是否显示列表
        isShow:false,//图文展示是否展示图片
        headTop:0,//状态栏高度
        status:-100,//
    },
    // 图文切换
    switch:function(){
        this.data.isShow=!this.data.isShow;
        this.setData({
            isShow: this.data.isShow
        });
    },
    // 选择搜索类型
    selectType:function(e){
        this.data.receiveIndex=e.currentTarget.dataset.index;
        this.setData({
            pageNo:1,
            orderSignList:[],
            receiveIndex:this.data.receiveIndex,
            isList:true,
            noData:''
        });
        if(e.currentTarget.dataset.index==0){
            this.data.status=-100;
            this.receiveInit(1);
        }
        if(e.currentTarget.dataset.index==1){
            this.data.status=1;
            this.receiveInit(1);
        }
        if(e.currentTarget.dataset.index==2){
            this.data.status=2;
            this.receiveInit(1);
        }
        if(e.currentTarget.dataset.index==3){
            this.data.status=3;
            this.receiveInit(1);
        }
        if(e.currentTarget.dataset.index==4){
            this.data.status=-1;
            this.receiveInit(1);
        }
        if(e.currentTarget.dataset.index==5){
            this.changeOrderCheck(1);
        }
    },
    // 去签收详情页
    toOrderDetails:function(e){
        wx.navigateTo({ 
             url:"../receive-details/receive-details?id="+e.currentTarget.dataset.orderid+"&state="+e.currentTarget.dataset.state
        })
    },
    // 去变更订单审核页面
    toChangeOrder:function(e){
        wx.navigateTo({ 
            url:"../change-order/change-order?id="+e.currentTarget.dataset.orderid
       })
    },
    // 签收或拒收
    signOrder:function(e){
        console.log(e,'e');
        let params={
            "ID":e.currentTarget.dataset.orderid,
            "SignStatus":e.currentTarget.dataset.status
        }
        util.httpRequest(server.orderSign,params,'post').then(res=>{
            console.log('订单签收或拒收',res);
            if(res.ResultCode==1){
                console.log('订单签收或拒收成功');
                wx.showToast({
                    title: '操作成功',
                    icon: "none",
                    duration: 1000,
                    mask:true
                })
                this.setData({
                    pageNo:1,
                    orderSignList:[],
                });
                this.receiveInit(1);
            }
            else{
                wx.showToast({
                    title: '操作失败',
                    icon: "none",
                    duration: 1000,
                    mask:true
                })
                console.log('订单签收或拒收失败');
            }
        })
    },
    // 下拉刷新  
    onPullDownRefresh: function () {  
        // 显示顶部刷新图标  
        wx.showNavigationBarLoading();  
        var that = this;  
        that.setData({
            orderSignList: [],
            noData:'',
            pageNo:1
        });
        that.receiveInit(1);
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
            that.receiveInit(that.data.pageNo);
        }
        // 隐藏加载框  
        wx.hideLoading();  
    },  
    receiveInit:function(page){
        // 订单签收列表
        let params={
            "orgID":wx.getStorageSync("orgId"),
            // "orgID":"C94C21D6-4C6D-4A80-BD19-5341E7014D47",
            "pageIndex": page,
            "pageSize": this.data.pageSize,
            "userID": wx.getStorageSync("userId"),
            "Status":this.data.status
            // "userID":"110A6516-154D-46E6-8C10-62AC5B1D7D04"
        }
        util.httpRequest(server.orderSignPagingList,params,'post').then(res=>{
            console.log('订单签收列表',res);
            if(res.ResultCode==1){
                console.log('获取订单签收列表成功');
                if(res.Result.list.length!=0){
                    for(var i=0;i<res.Result.list.length;i++){
                        res.Result.list[i].TourDate=res.Result.list[i].TourDate.substr(0,10);
                        this.data.orderSignList.push(res.Result.list[i]);
                    }
                    this.setData({
                        orderSignList: this.data.orderSignList,
                        totalNum:res.Result.totalNum,
                        isList:true
                    });
                    console.log(this.data.orderSignList);
                }
                else{
                    this.setData({
                        isList:false
                    });
                }
            }
            else{
                console.log('获取订单签收列表失败');
            }
        })
    },
    //变更审核的签收列表
    changeOrderCheck:function(page){
        let params={
            "orgID":wx.getStorageSync("orgId"),
            // "orgID":"C94C21D6-4C6D-4A80-BD19-5341E7014D47",
            "pageIndex": page,
            "pageSize": this.data.pageSize,
            "userID": wx.getStorageSync("userId"),
            // "userID":"110A6516-154D-46E6-8C10-62AC5B1D7D04"
        }
        util.httpRequest(server.orderAuditSignPagingList,params,'post').then(res=>{
            console.log('变更审核订单签收列表',res);
            if(res.ResultCode==1){
                console.log('获取变更审核订单签收列表成功');
                if(res.Result.list.length!=0){
                    for(var i=0;i<res.Result.list.length;i++){
                        res.Result.list[i].TourDate=res.Result.list[i].TourDate.substr(0,10);
                        this.data.orderSignList.push(res.Result.list[i]);
                    }
                    this.setData({
                        orderSignList: this.data.orderSignList,
                        totalNum:res.Result.totalNum,
                        isList:true
                    });
                    console.log(this.data.orderSignList);
                }
                else{
                    this.setData({
                        isList:false
                    });
                }
            }
            else{
                console.log('获取变更审核订单签收列表失败');
            }
        })
    },
    onLoad: function () {
        this.receiveInit(1);
        this.setData({
            headTop:getApp().globalData.navHeight
        })
        // console.log(getApp().globalData.navHeight);
    }
})