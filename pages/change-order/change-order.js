var util = require('../../utils/util.js');
var server = require('../../utils/server.js');
Page({
    data: {
        headTop:0,
        orderId:'',//订单id
        changeList:[],//变更单列表
        isList:true,//
    },
    // 通过还是拒绝
    auditBtn:function(e){
        let params={
            "ID":e.currentTarget.dataset.orderid,
            "SignStatus":e.currentTarget.dataset.status,
            "userID":wx.getStorageSync("userId") 
        }
        util.httpRequest(server.auditOrderChange,params,'post').then(res=>{
            console.log('变更通过还是拒绝',res);
            if(res.ResultCode==1){
                console.log('通过或拒绝成功');
                wx.showToast({
                    title: '操作成功',
                    icon: "none",
                    duration: 1000,
                    mask:true
                })
                this.setData({
                    changeList:[]
                })
                this.searchChangeOrder();
            }
            else{
                wx.showToast({
                    title: res.Result,
                    icon: "none",
                    duration: 1000,
                    mask:true
                })
                console.log('通过或拒绝失败');
            }
        })
    },
    // 搜索变更列表
    searchChangeOrder:function(){
        // 获取变更单详情
        let params={
            // "OrderID":'1174066e-e09c-444d-8c07-f205dede28a3',
            "OrderID":this.data.orderId,
            'Status':0
        }
        util.httpRequest(server.getOrderChangeByOrderID,params,'get').then(res=>{
            console.log('变更单列表',res);
            if(res.ResultCode==1){
                console.log('获取变更单列表成功');
                if(res.Result.length!=0){
                    for(var i=0;i<res.Result.length;i++){
                        res.Result[i].RevisedDate=res.Result[i].RevisedDate.substr(0,10)+'   '+ res.Result[i].RevisedDate.substr(11,5);
                    }
                    this.setData({
                        changeList: res.Result,
                    });
                }
                else{
                    this.setData({
                        isList:false
                    });
                }
            }
            else{
                console.log('获取变更单列表失败');
            }
        })
    },
    onLoad: function (options) {
        console.log(options);
        this.setData({
            headTop:getApp().globalData.navHeight,
            orderId: options.id,
        });
        this.searchChangeOrder();
    }
})