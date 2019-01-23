var util = require('../../utils/util.js');
var server = require('../../utils/server.js');
Page({
    data: {
        headTop:0,
        orderInfo:{},//订单详情
        changeList:[],//变更单列表
        orderId:'',//订单id
        state:'',//订单状态
    },
     // 去订单修改页
    toModifyProduct:function(e){
        wx.navigateTo({ 
            url:"../change-remark/change-remark?id="+this.data.orderId+"&state=3"
        })
    },
    // 签收或拒收
    signOrder:function(e){
        console.log(e,'e');
        let params={
            "ID":this.data.orderId,
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
                // this.setData({
                //     pageNo:1,
                //     orderSignList:[],
                // });
                // this.receiveInit(1);
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
    onLoad: function (options) {
        console.log(options);
        this.setData({
            headTop:getApp().globalData.navHeight,
            orderId: options.id,
            state:options.state
        });
        // 获取订单签收详情
        let params={
            "ID":this.data.orderId,
        }
        util.httpRequest(server.getSendOrderDetailByID,params,'get').then(res=>{
            console.log('订单签收详情',res);
            if(res.ResultCode==1){
                console.log('获取订单签收详情成功');
                res.Result.TourDate=res.Result.TourDate.substr(0,10);
                this.setData({
                    orderInfo: res.Result,
                });
            }
            else{
                console.log('获取订单签收详情失败');
            }
        })

       // 获取变更单详情
       let paramsChange={
            // "OrderID":'1174066e-e09c-444d-8c07-f205dede28a3',
            "OrderID":this.data.orderId,
            'Status':-100
        }
        util.httpRequest(server.getOrderChangeByOrderID,paramsChange,'get').then(res=>{
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
    }
})