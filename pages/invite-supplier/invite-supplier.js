var util = require('../../utils/util.js');
var server = require('../../utils/server.js');
Page({
    data: {
        headTop:0,
        array: ['请选择'],
        messageNote:'',//短信内容
        tel:'',//手机号
        index:0,//模板名称
        messageList:[],//短信模板
        orderId:'',//订单id
    },
    // 选择短信模板,后期可能有用
    // bindPickerChange: function(e) {
    //     console.log('picker发送选择改变，携带值为', e)
    //     this.data.index=e.detail.value;
    //     this.setData({
    //         index:this.data.index,
    //     })
    //     if(e.detail.value!=0){
    //         this.setData({
    //             messageNote:this.data.messageList[parseInt(e.detail.value)-1].TemContent
    //         })
    //     }
    //     else{
    //         this.setData({
    //             messageNote:''
    //         })
    //     }
    // },
    // 保存一些值
    keepTel:function(e){
        this.setData({
            tel:e.detail.value
        })
    },
    keepMessage:function(e){
        console.log(e);
        this.setData({
            messageNote:e.detail.value
        })
    },
    //邀请供应商
    sendInvite:function(){
        console.log(this.data.tel,'tel');
        if(this.data.tel==''){
            wx.showToast({
                title: '手机号不能为空',
                icon: "none",
            })
            return;
        }
        var pattern = /^0{0,1}(1[0-9][0-9]|15[7-9]|153|156|18[7-9])[0-9]{8}$/;
        if(!pattern.test(this.data.tel)&&this.data.tel!=''){
            wx.showToast({
                title: '手机号不正确',
                icon: "none",
            })
            return;
        }
        if(this.data.messageNote==''){
            wx.showToast({
                title: '短信内容不能为空',
                icon: "none",
            })
            return;
        }
        let params={
            "CellPhone":this.data.tel,
            "Content":this.data.messageNote,
            // "UserID":"110A6516-154D-46E6-8C10-62AC5B1D7D04",
            "UserID": wx.getStorageSync("userId"),
            "OrderID":this.data.orderId
        }
        util.httpRequest(server.invitationSupplier,params,'post').then(res=>{
            console.log('邀请供应商',res);
            if(res.ResultCode==1){
                console.log('邀请供应商成功');
                wx.showToast({
                  title: '邀请成功',
                  icon: "none",
                  duration: 1000,
                  mask:true
                })
                setTimeout(()=>{ 
                    wx.reLaunch({
                        url:'../order/order'
                    })
                  }, 2000);
            }
            else{
                wx.showToast({
                    title: '邀请失败',
                    icon: "none",
                    duration: 1000,
                    mask:true
                })
                console.log('邀请供应商失败');
            }
        })
    },
    onLoad: function () {
        this.setData({
            headTop:getApp().globalData.navHeight,
            orderId:wx.getStorageSync("orderId")
        });
        // 后期可能有用
        // let params;
        // util.httpRequest(server.messageTemplateList,params,'get').then(res=>{
        //     console.log('短信模板',res);
        //     if(res.ResultCode==1){
        //         console.log('获取短信模板成功');
        //         console.log(res.Result,'获取短信模板成功');
        //         for(var i=0;i<res.Result.length;i++){
        //             this.data.array.push(res.Result[i].TemTitle)
        //         }
        //         this.setData({
        //             messageList:res.Result,
        //             array:this.data.array
        //         })
        //     }
        //     else{
        //         console.log('获取短信模板失败');
        //     }
        // })

        // 获取订单详情
        let params={
            "ID":this.data.orderId,
            // "ID":'1174066e-e09c-444d-8c07-f205dede28a3',
        }
        util.httpRequest(server.getOrderDetails,params,'get').then(res=>{
            console.log('订单详情',res);
            if(res.ResultCode==1){
                console.log('获取订单详情成功');
                this.data.messageNote='订单编号【'+res.Result.OrderNo+'】'+res.Result.OrderName+'！！！共'+res.Result.AdultNum+'成人'+res.Result.ChildNum+'儿童等待签收'
                this.setData({
                    messageNote: this.data.messageNote,
                });
            }
            else{
                console.log('获取订单详情失败');
            }
        })
    }
})