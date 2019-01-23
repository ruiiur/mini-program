var util = require('../../utils/util.js');
var server = require('../../utils/server.js');
Page({
    data: {
        proId:'',//产品id
        tourDate:'',//团期管理
        tourId:'',//团期id
        headTop:0,
        priceList:[],//价格相关
        priceStrategies:[
            {
                "TouristType": 1,
                "TouristName": "成人价",
                "DirectPrice": 0,
                "SalesPrice": 0,
                "RebatePrice": 0,
                "SingleRoomPrice": 0
              },
             { 
                "TouristType": 2,
                "TouristName": "儿童价",
                "DirectPrice": 0,
                "SalesPrice": 0,
                "RebatePrice": 0,
                "SingleRoomPrice": 0
              }          
        ],//修改时要传的值
    },
    // 保存一些值
    keepPriceInfo:function(e){
        if(parseFloat(e.detail.value) % 1===0){
            this.data.priceList[e.currentTarget.dataset.index][e.currentTarget.dataset.price]=parseFloat(e.detail.value)
        }
        else{
            this.data.priceList[e.currentTarget.dataset.index][e.currentTarget.dataset.price]=parseFloat(e.detail.value).toFixed(2);
        }
        // this.data.priceList[e.currentTarget.dataset.index][e.currentTarget.dataset.price]=parseInt(e.detail.value);
        if(e.currentTarget.dataset.price!='PlanNum'){
            if(parseFloat(e.detail.value) % 1===0){
                this.data.priceStrategies[e.currentTarget.dataset.index][e.currentTarget.dataset.price]=parseFloat(e.detail.value)
            }
            else{
                this.data.priceStrategies[e.currentTarget.dataset.index][e.currentTarget.dataset.price]=parseFloat(e.detail.value).toFixed(2);
            }
            // this.data.priceStrategies[e.currentTarget.dataset.index][e.currentTarget.dataset.price]=parseFloat(e.detail.value);
        }
        this.setData({
            priceList:this.data.priceList,
            priceStrategies:this.data.priceStrategies
        })
        console.log(this.data.priceList,'priceList');
        console.log(this.data.priceStrategies,'priceStrategies');
    },
    // keepPlanNum:function(e){
    //     if(parseInt(e.detail.value)==''|| isNaN(parseInt(e.detail.value))){
    //         this.setData({
    //             planNum:0
    //         })
    //     }
    //     else{
    //         this.setData({
    //             planNum:parseInt(e.detail.value)
    //         })
    //     }
    // },
    // 修改团期
    massChangeSubmit:function(){
        let params={
            "TourId":this.data.tourId,
            "PlanNum":this.data.priceList[0].PlanNum,
            "PriceStrategies":this.data.priceStrategies,
        }
        util.httpRequest(server.updateTourById ,params,'post').then(res=>{
            console.log('修改团期',res);
            if(res.ResultCode==1){
                console.log('修改团期成功');
                wx.showToast({
                    title: '修改团期成功',
                    icon: 'none',
                })
                setTimeout(()=>{ 
                    wx.navigateTo({ 
                        url:"../mass-management/mass-management"
                    })
                }, 2000);
            }
            else{
                wx.showToast({
                    title: '修改团期失败',
                    icon: 'none',
                    duration: 1000,
                    mask:true
                })
                console.log('修改团期失败');
            }
        })
    },
    onLoad: function () {
        this.setData({
            headTop:getApp().globalData.navHeight,
            proId:wx.getStorageSync("proId") || '',
            tourDate:wx.getStorageSync("tourDate") || '',
            tourId:wx.getStorageSync("tourId") || ''
        });
        let params={
            // "proId":'5C84FE1D-DA00-4D74-A30F-006215BC1524',
            "proId":this.data.proId,
            'tourDate':this.data.tourDate
        }
        util.httpRequest(server.selectTourByDate,params,'get').then(res=>{
            console.log('获取单个团期',res);
            if(res.ResultCode==1){
                console.log('获取单个成功');
                this.data.priceList=[];
                for(var i=0;i<res.Result.TourPriceList.length;i++){
                    this.data.priceList.push(res.Result.TourPriceList[i]);
                    this.data.priceStrategies[i].DirectPrice=res.Result.TourPriceList[i].DirectPrice;//直客价格
                    this.data.priceStrategies[i].SalesPrice=res.Result.TourPriceList[i].SalesPrice;//分销价格
                    this.data.priceStrategies[i].RebatePrice=res.Result.TourPriceList[i].RebatePrice;//返佣
                    this.data.priceStrategies[i].SingleRoomPrice=res.Result.TourPriceList[i].SingleRoomPrice;//单房差
                }
                this.setData({ 
                    priceList:this.data.priceList,
                    priceStrategies:this.data.priceStrategies
                }) 
                console.log(this.data.priceList,'this.data.priceList');
            }
            else{
                console.log('获取单个团期失败');
            }
        })
    }
})