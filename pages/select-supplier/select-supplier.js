var util = require('../../utils/util.js');
var server = require('../../utils/server.js');
Page({
    data: {
        headTop:0,
        keyValue:'',//关键词
        supplierList:[],//供应商列表
        pageNo:1,//当前页
        totalNum:'',//总共的数据条数
        pageSize:15,//每次请求的个数
        noData:'',
        isList:true
    },
     // 下拉刷新  
     onPullDownRefresh: function () {  
        // 显示顶部刷新图标  
        wx.showNavigationBarLoading();  
        var that = this;  
        that.setData({
            supplierList: [],
            noData:'',
            pageNo:1,
            isList:true
        });
        that.searchSupp(1);
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
            that.searchSupp(that.data.pageNo);
        }
        // 隐藏加载框  
        wx.hideLoading();  
    },  
    searchSupp:function(page){
        if(this.data.keyValue==''){
            wx.showToast({
                title: '请先输入搜索内容',
                icon: "none",
            })
            return;
        }
         // 搜索供应商
         let params={
            "pageIndex": page,
            "pageSize": this.data.pageSize,  
            "key":this.data.keyValue
        }
        util.httpRequest(server.getExternalSupplierList,params,'post').then(res=>{
            console.log('供应商列表',res);
            if(res.ResultCode==1){
                console.log('获取供应商列表成功');
                if(res.Result.SupplierList.length!=0){
                    for(var i=0;i<res.Result.SupplierList.length;i++){
                        this.data.supplierList.push(res.Result.SupplierList[i]);
                    }
                    this.setData({
                        supplierList:this.data.supplierList,
                        totalNum:res.Result.totalNum,
                        isList:true
                    });
                }
                else{
                    this.setData({
                        isList:false
                    });
                }
            }
            else{
                console.log('获取供应商列表失败');
            }
        })
    },
    // 搜索供应商
    onSearch:function(e){
        console.log('搜索');
        console.log(e.detail);
        this.setData({
            keyValue:e.detail,
            supplierList:[],
            isList:true,
            noData:''
        })
        if(this.data.keyValue==''){
            wx.showToast({
                title: '请先输入搜索内容',
                icon: "none",
            })
            return;
        }
        // 搜索供应商
        let params={
            "pageIndex": 1,
            "pageSize": this.data.pageSize,  
            "key":this.data.keyValue
        }
        util.httpRequest(server.getExternalSupplierList,params,'post').then(res=>{
            console.log('供应商列表',res);
            if(res.ResultCode==1){
                console.log('获取供应商列表成功');
                if(res.Result.SupplierList.length!=0){
                    for(var i=0;i<res.Result.SupplierList.length;i++){
                        this.data.supplierList.push(res.Result.SupplierList[i]);
                    }
                    this.setData({
                        supplierList:this.data.supplierList,
                        totalNum:res.Result.totalNum,
                        isList:true
                    });
                }
                else{
                    this.setData({
                        isList:false
                    });
                }
                console.log(this.data.supplierList,'supplierListsupplierListsupplierListsupplierList');
            }
            else{
                console.log('获取供应商列表失败');
            }
        })
    },
    // 选择供应商
    chooseSupplier:function(e){
        var supplierObj={
            "supplierId":e.currentTarget.dataset.supplierid,
            "supplierName":e.currentTarget.dataset.suppliername
        }
        wx.setStorageSync("supplierObj", supplierObj);
        wx.navigateTo({ 
            url:"../send-order/send-order"
        })
    },
    onLoad: function () {
        this.setData({ 
            headTop:getApp().globalData.navHeight,
        }) 
    }
})