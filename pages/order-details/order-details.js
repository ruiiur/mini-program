var util = require('../../utils/util.js');
var server = require('../../utils/server.js');
Page({
    data: {
        orderInfo:{},//订单详情
        changeList:[],//变更单列表
        orderId:'',//订单id
        headTop:0,
        audltPrice:'',//成人价格
        childPrice:'',//儿童价格
    },
     // 去订单修改页
    toModifyProduct:function(e){
        wx.navigateTo({ 
            url:"../change-remark/change-remark?id="+this.data.orderId+"&state=3"
        })
    },
    onLoad: function (options) {
        console.log(options);
        this.setData({
            orderId: options.id,
            // orderId:'f4237a52-0661-4aed-bacd-34fa91257f03',
            headTop:getApp().globalData.navHeight
        });
        // 获取订单详情
        let params={
            "ID":this.data.orderId,
            // "ID":'f4237a52-0661-4aed-bacd-34fa91257f03',
        }
        util.httpRequest(server.getOrderDetails,params,'get').then(res=>{
            console.log('订单详情',res);
            if(res.ResultCode==1){
                console.log('获取订单详情成功');
                res.Result.TourDate=res.Result.TourDate.substr(0,10);
                this.setData({
                    orderInfo: res.Result,
                });
                for(var i=0;i<res.Result.TourPriceList.length;i++){
                    if(res.Result.TourPriceList[i].PriceName=="成人价"){
                        this.setData({
                            audltPrice: res.Result.TourPriceList[i].SalePrice,
                        });
                    }
                    if(res.Result.TourPriceList[i].PriceName=="儿童价"){
                        this.setData({
                            childPrice: res.Result.TourPriceList[i].SalePrice,
                        });
                    }
                }
            }
            else{
                console.log('获取订单详情失败');
            }
        })

        // 获取变更单详情
        let paramsChange={
            // "OrderID":'46ac5d63-d938-4b53-877b-f0e888e4c593',
            "OrderID":this.data.orderId,
            'Status':0
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