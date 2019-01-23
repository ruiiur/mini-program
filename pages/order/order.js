var util = require('../../utils/util.js');
var server = require('../../utils/server.js');
Page({
    data: {
        orderList:[],//订单列表接口
        date:'出团日期',
        pageNo:1,//当前页
        totalNum:'',//总共的数据条数
        pageSize:10,//每次请求的个数
        noData:'',//没有更多数据提示
        isList:true,//是否显示列表
        orderType:['全部状态','未发单','已发未收','已签收','已拒收'],//订单列表查找类型
        isShow:false,//图文展示是否展示图片
        headTop:0,//状态栏高度
        signStatus:-1,//订单签收状态
    },
    // 图文切换
    switch:function(){
        this.data.isShow=!this.data.isShow;
        this.setData({
            isShow: this.data.isShow
        });
    },
    // 选择日期
    bindDateChange: function(e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
          date: e.detail.value,
          orderList: [],
          pageNo:1,
          isList:true,
          noData:'',
        })
        this.searchOrder(1);
    },
    // 选择订单类型
    bindPickerChange: function(e) {
        console.log('picker发送选择改变，携带值为', e)
        this.data.signStatus=parseInt(e.detail.value)-1;
        this.setData({
            pageNo:1,
            orderList:[],
            signStatus:this.data.signStatus,
            isList:true,
            noData:''
        })
        this.searchOrder(1);
    },
    // 去订单发单页
    toSendOrder:function(e){
        wx.setStorageSync("orderId",e.currentTarget.dataset.orderid);
        wx.setStorageSync("supplierObj", '');
        wx.setStorageSync("sendPrice", '');
        wx.setStorageSync("sendNote", '');
        wx.navigateTo({ 
             url:"../send-order/send-order"
        })
    },
     // 去订单修改页
    toModifyProduct:function(e){
        wx.navigateTo({ 
            url:"../change-remark/change-remark?id="+e.currentTarget.dataset.orderid+"&state=1"
        })
    },
    // 去提交变更页面
    toAlteration:function(e){
        wx.navigateTo({ 
            url:"../change-remark/change-remark?id="+e.currentTarget.dataset.orderid+"&state=2"
        })
    },
    // 去订单详情页
    toOrderDetails:function(e){
        wx.navigateTo({ 
             url:"../order-details/order-details?id="+e.currentTarget.dataset.orderid
        })
    },
    // 订单取消
    orderCancel:function(e){
        let params={
            "ID":e.currentTarget.dataset.orderid,
            "DataStatus":1
        }
        util.httpRequest(server.orderCancel,params,'post').then(res=>{
            console.log('订单取消',res);
            if(res.ResultCode==1){
                console.log('订单取消成功');
                wx.showToast({
                  title: '取消成功',
                  icon: "none",
                  duration: 1000,
                  mask:true
              })
              this.setData({
                pageNo:1,
                orderList:[],
            })
              this.searchOrder(1);
            }
            else{
              wx.showToast({
                title: '取消失败',
                icon: "none",
                duration: 1000,
                mask:true
              })
              console.log('订单取消失败');
            }
        })
    },
     // 下拉刷新  
     onPullDownRefresh: function () {  
        // 显示顶部刷新图标  
        wx.showNavigationBarLoading();  
        var that = this;  
        that.setData({
            orderList: [],
            noData:'',
            pageNo:1
        });
        that.searchOrder(1);
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
            that.searchOrder(that.data.pageNo);
        }
        // 隐藏加载框  
        wx.hideLoading();  
    },  
    // 查询订单
    searchOrder:function(page){
        // 订单列表
        var params;
        if(this.data.date=="出团日期"){
            params={
                // "orgID":wx.getStorageSync("orgId"),
                "orgID":"C94C21D6-4C6D-4A80-BD19-5341E7014D47",
                "pageIndex": page,
                "pageSize": this.data.pageSize,
                "userID":"110A6516-154D-46E6-8C10-62AC5B1D7D04",
                // "userID": wx.getStorageSync("userId"),
                "Category":8,
                "TourDate":'',
                "SignStatus":this.data.signStatus
            }
        }
        else{
            params={
                "orgID":"C94C21D6-4C6D-4A80-BD19-5341E7014D47",
                // "orgID":wx.getStorageSync("orgId"),
                "pageIndex": page,
                "pageSize": this.data.pageSize,
                "userID":"110A6516-154D-46E6-8C10-62AC5B1D7D04",
                // "userID": wx.getStorageSync("userId"),
                "Category":8,
                "TourDate":this.data.date,
                "SignStatus":this.data.signStatus
            }
        }
        util.httpRequest(server.getOrderPagingList,params,'post').then(res=>{
            console.log('订单列表',res);
            if(res.ResultCode==1){
                console.log('获取订单列表成功');
                if(res.Result.list.length!=0){
                    for(var i=0;i<res.Result.list.length;i++){
                        res.Result.list[i].TourDate=res.Result.list[i].TourDate.substr(0,10);
                        this.data.orderList.push(res.Result.list[i]);
                    }
                    this.setData({
                        orderList: this.data.orderList,
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
                console.log('获取订单列表失败');
            }
        })
    },
    onLoad: function () {
        this.setData({
            orderList: [],
            headTop:getApp().globalData.navHeight
        });
       this.searchOrder(1);
    }
})