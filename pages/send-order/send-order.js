var util = require('../../utils/util.js');
var server = require('../../utils/server.js');
Page({
    data: {
        headTop:0,
        orderId:'',//订单id
        note:'',//备注
        price:'',//成本价格
        supplierObj:{},//供应商对象
    },
    // 去选择供应商页面
    toSelectSupplier:function(e){
        wx.navigateTo({ 
            url:"../select-supplier/select-supplier"
        })
    },
    // 去邀请供应商页面
    toInviteSupplier:function(){
        wx.navigateTo({ 
            url:"../invite-supplier/invite-supplier"
       })
    },
    // 保存一些值
    keepPrice:function(e){
        if(parseFloat(e.detail.value) % 1===0){
            this.data.price=parseFloat(e.detail.value)
          }
        else{
            this.data.price=parseFloat(e.detail.value).toFixed(2);
        }
        this.setData({
            price:this.data.price
        })
        wx.setStorageSync("sendPrice",this.data.price);
    },
    keepNote:function(e){
        this.setData({
            note:e.detail.value
        })
        wx.setStorageSync("sendNote",this.data.note);
    },
    // 订单发单
    sendOrder:function(){
        if(this.data.price==''){
            wx.showToast({
                title: '请输入成本金额',
                icon: "none",
            })
            return;
        }
        if(this.data.supplierObj.supplierId=='' || this.data.supplierObj.supplierName==''){
            wx.showToast({
                title: '请选择供应商',
                icon: "none",
            })
            return;
        }
        if(this.data.note==''){
            wx.showToast({
                title: '请输入备注内容',
                icon: "none",
            })
            return;
        }
        let params={
            "OrderID": this.data.orderId,
            "Price": this.data.price,
            "SupplierID": this.data.supplierObj.supplierId,
            "SupplierName": this.data.supplierObj.supplierName,
            "Remark":this.data.note,
            // "OrgID": "C94C21D6-4C6D-4A80-BD19-5341E7014D47",
            "OrgID": wx.getStorageSync("orgId"),
            "UserID": wx.getStorageSync("userId")          
            // "UserID": "110A6516-154D-46E6-8C10-62AC5B1D7D04"          
        }
        util.httpRequest(server.insideOrderSend,params,'post').then(res=>{
            console.log('订单发单',res);
            if(res.ResultCode==1){
                console.log('订单发单成功');
                wx.showToast({
                    title: '发单成功',
                    icon: "none",
                    duration: 1000,
                    mask:true
                })
                setTimeout(()=>{ 
                    wx.reLaunch({ 
                      url:"../order/order"
                    })
                }, 2000);
            }
            else{
                wx.showToast({
                    title: '发单失败',
                    icon: "none",
                    duration: 1000,
                    mask:true
                })
                console.log('订单发单失败');
            }
        })
    },
    onLoad: function (options) {
        console.log(options);
        console.log(wx.getStorageSync("supplierObj"),'wx.getStorageSync("supplierObj")');
        this.setData({
            headTop:getApp().globalData.navHeight,
            orderId:wx.getStorageSync("orderId") || '',
            supplierObj:wx.getStorageSync("supplierObj") || '',
            price:wx.getStorageSync("sendPrice") || '',
            note:wx.getStorageSync("sendNote") || ''
        });
        console.log(this.data.supplierObj,'supplierObj');
    }
})