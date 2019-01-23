var util = require('../../utils/util.js');
var server = require('../../utils/server.js');
Page({
    data: {
        isOpenClass:false,//是否开班
        proId:'',// 产品id
        proInfo:{},//产品对象
        proName:'',//产品名称
        headTop:0,
    },
    onClickLeft() {
        wx.showToast({ title: '点击返回', icon: 'none' });
    },
     // 去产品开班页
     toOpenClass:function(e){
        wx.setStorageSync("proId",this.data.proId);
        wx.setStorageSync("proName",e.currentTarget.dataset.proname);
        wx.setStorageSync("ruleInfo",'');
        wx.setStorageSync("ruleType",'');
        wx.setStorageSync("startDate",'开始日期'),
        wx.setStorageSync("endDate",'结束日期'),
        wx.setStorageSync("planNum",''),
        wx.setStorageSync("priceStrategies",[
            {
                "TouristType": 1,
                "TouristName": "成人价",
                "DirectPrice": '',
                "SalesPrice": '',
                "RebatePrice": '',
                "SingleRoomPrice": ''
            },
            { 
                "TouristType": 2,
                "TouristName": "儿童价",
                "DirectPrice": '',
                "SalesPrice": '',
                "RebatePrice": '',
                "SingleRoomPrice": ''
            }
        ]),
        // wx.setStorageSync("directPrice",''),
        // wx.setStorageSync("salesPrice",''),
        // wx.setStorageSync("rebatePrice",''),
        // wx.setStorageSync("singleRoomPrice",''),
        wx.navigateTo({ 
             url:"../open-class/open-class"
        })
    },
     // 去产品下单页
     toProductOrder:function(e){
        wx.setStorageSync("isDetail",0);
        wx.navigateTo({ 
             url:"../product-order/product-order"
        })
    },
    // 和开班有关
    // bindDateChange: function(e) {
    //     console.log('picker发送选择改变，携带值为', e.detail.value)
    //     this.setData({
    //       date: e.detail.value
    //     })
    // },
    // 去团期管理页
    checkTour:function(e){
        wx.setStorageSync("proId",e.currentTarget.dataset.proid);
        wx.setStorageSync("isDetail",1);
        wx.navigateTo({ 
             url:"../mass-management/mass-management"
        })
    },
    onLoad: function (options) {
        console.log(options);
        this.setData({
            proId: options.id,
            headTop:getApp().globalData.navHeight
        });
        // 获取产品详情
        let params={
            "ID":this.data.proId,
            // "ID":'5d08752d-3cee-47a7-bf91-ec4fce16700d',
        }
        util.httpRequest(server.getProductDetails,params,'get').then(res=>{
            console.log('产品详情',res);
            if(res.ResultCode==1){
                console.log('获取产品详情成功');
                this.setData({
                    proInfo: res.Result,
                    proName:res.Result.productName
                });
            }
            else{
                console.log('获取产品详情失败');
            }
        })
    }
})