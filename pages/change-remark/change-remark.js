var util = require('../../utils/util.js');
var server = require('../../utils/server.js');
Page({
    data: {
      headTop:0,
      orderId:'',//订单id
      state:'',//判断从哪个页面过来
      incomePrice:'',//收入金额
      incomePriceSet:'',//调整后收入金额
      costPrice:'',//成本金额
      costPriceSet:'',//调整后成本金额
      incomeNote:'',//收入备注
      costNote:'',//成本备注
      content:'',//内容
      incomeAdjust:'',//收入调整金额
      costAdjust:'',//成本调整金额
      incomePlus:true,//收入正负,默认正
      costPlus:true,//成本正负,默认正
    },
    // 记住备注框的值
    keepValue:function(e){
      console.log(e);
      this.setData({
        note:e.detail.value
      })
    },
    // 收入调账
    incomeFun:function(e){
      console.log(e);
      if((e.currentTarget.dataset.num==1&&this.data.incomePlus===true) || (e.currentTarget.dataset.num==4&&this.data.incomePlus===false) || (e.currentTarget.dataset.num==3&&this.data.incomePlus===true) || (e.currentTarget.dataset.num==2&&this.data.incomePlus===false)){
        return;
      }
      this.setData({
        incomePlus:!this.data.incomePlus
      })
      console.log(this.data.incomePlus,'incomePlus');
      this.computeIncome();
    },
    // 成本调账
    costFun:function(e){
      if((e.currentTarget.dataset.num==1&&this.data.costPlus===true) || (e.currentTarget.dataset.num==4&&this.data.costPlus===false) || (e.currentTarget.dataset.num==3&&this.data.costPlus===true) || (e.currentTarget.dataset.num==2&&this.data.costPlus===false)){
        return;
      }
      this.setData({
        costPlus:!this.data.costPlus
      })
      this.computeCost();
    },
    // 收入调整金额
    incomeAdjustFun:function(e){
      console.log(parseFloat(e.detail.value));
      if(parseFloat(e.detail.value) % 1===0){
        console.log(1)
        this.data.incomeAdjust=parseFloat(e.detail.value)
      }
      else{
        console.log(2)
        this.data.incomeAdjust=parseFloat(e.detail.value).toFixed(2);
      }
      this.setData({
        incomeAdjust:this.data.incomeAdjust
      })
      this.computeIncome();
    },
    // 计算收入
    computeIncome:function(){
      if(this.data.incomeAdjust!==''){
        if((this.data.incomePlus===false && this.data.incomeAdjust>0) || (this.data.incomePlus===true && this.data.incomeAdjust<0)){
          this.setData({
            incomeAdjust:-this.data.incomeAdjust
          })
        }
        // console.log(parseFloat(this.data.incomePrice),'incomeP')
        // console.log(parseFloat(this.data.incomeAdjust),'incomeA')
        this.data.incomePriceSet=parseFloat(this.data.incomePrice)+parseFloat(this.data.incomeAdjust);
        if( parseFloat(this.data.incomePriceSet) % 1===0){
          this.setData({
            incomePriceSet:parseFloat(this.data.incomePriceSet)
          })
        }
        else{
          this.setData({
            incomePriceSet:parseFloat(this.data.incomePriceSet).toFixed(2)
          })
        }
        // this.setData({
        //   incomePriceSet:this.data.incomePriceSet
        // })
      }
    },
    // 成本调整金额
    costAdjustFun:function(e){
      if(parseFloat(e.detail.value) % 1===0){
        this.data.costAdjust=parseFloat(e.detail.value)
      }
      else{
        this.data.costAdjust=parseFloat(e.detail.value).toFixed(2);
      }
      this.setData({
        costAdjust: this.data.costAdjust
      })
      this.computeCost();
    },
    // 计算成本
    computeCost:function(){
      if(this.data.costAdjust!==''){
        if((this.data.costPlus===false && this.data.costAdjust>0) || (this.data.costPlus===true && this.data.costAdjust<0)){
          this.setData({
            costAdjust:-this.data.costAdjust
          })
        }
        this.data.costPriceSet=parseFloat(this.data.costPrice)+parseFloat(this.data.costAdjust);
        if( parseFloat(this.data.costPriceSet) % 1===0){
          this.setData({
            costPriceSet:parseFloat(this.data.costPriceSet)
          })
        }
        else{
          this.setData({
            costPriceSet:parseFloat(this.data.costPriceSet).toFixed(2)
          })
        }
        // this.setData({
        //   costPriceSet:this.data.costPriceSet
        // })
      }
    },
    // 保存备注
    incomeNoteFun:function(e){
      this.setData({
        incomeNote:e.detail.value
      })
    },
    costNoteFun:function(e){
      this.setData({
        costNote:e.detail.value
      })
    },
    keepContent:function(e){
      this.setData({
        content:e.detail.value
      })
    },
    // 订单修改提交
    // changeSubmit:function(){
    //   let params={
    //     "ID":this.data.orderId,
    //     "Comment":this.data.note
    //   }
    //   util.httpRequest(server.upateOrderInfo,params,'post').then(res=>{
    //       console.log('订单修改',res);
    //       if(res.ResultCode==1){
    //           console.log('订单修改成功');
    //           wx.showToast({
    //             title: '订单修改成功',
    //             icon: "none",
    //             duration: 1000,
    //             mask:true
    //         })
    //         if(this.data.state==1){
    //           setTimeout(()=>{ 
    //             wx.reLaunch({ 
    //               url:"../order/order"
    //             })
    //           }, 2000);
    //         }
    //         if(this.data.state==3){
    //           setTimeout(()=>{ 
    //             wx.navigateTo({ 
    //               url:"../order-details/order-details?id="+this.data.orderId
    //             })
    //           }, 2000);
    //         }
    //       }
    //       else{
    //         wx.showToast({
    //           title: '订单修改失败',
    //           icon: "none",
    //           duration: 1000,
    //           mask:true
    //         })
    //           console.log('订单修改失败');
    //       }
    //   })
    // },
    // 订单变更或修改
    alterationSubmit:function(){
      if(this.data.content==''){
        if(this.data.state==1){
          wx.showToast({
            title: '请填写修改备注',
            icon: "none"
          })
        }
        if(this.data.state==2){
          wx.showToast({
            title: '请填写变更备注',
            icon: "none"
          })
        }
        return;
      }
      let params={
        // "userID": "110A6516-154D-46E6-8C10-62AC5B1D7D04",
        "userID": wx.getStorageSync("userId"),
        // "orgID": "C94C21D6-4C6D-4A80-BD19-5341E7014D47",
        "orgID":wx.getStorageSync("orgId"),
        "orderID": this.data.orderId,
        "Remark": this.data.content,
        "BeforeIncomeAmount": this.data.incomePrice,
        "IncomeAdjustAmount": this.data.incomeAdjust,
        "IncomeAdjustComment": this.data.incomeNote,
        "BeforeCostAmount": this.data.costPrice,
        "CostAdjustAmount": this.data.costAdjust,
        "CostAdjustComment": this.data.costNote      
      }
      util.httpRequest(server.addOrderChange,params,'post').then(res=>{
        console.log('订单变更或修改',res);
        if(res.ResultCode==1){
            console.log('订单变更或修改成功');
            wx.showToast({
              title: '提交成功',
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
            title: '提交失败',
            icon: "none",
            duration: 1000,
            mask:true
          })
          console.log('订单变更失败');
        }
      })
    },
    onLoad: function (options) {
      // console.log(options);
      this.setData({
        headTop:getApp().globalData.navHeight,
        // orderId:"11DE36DD-DC0E-408D-BF72-E7EA8140BB2B",
        orderId: options.id,
        state: options.state
        // state: 1
      });
      // console.log(this.data.orderId);
      // 查询应收应付
      let params={
        "OrderID":this.data.orderId
      }
      util.httpRequest(server.getAmountByOrderId,params,'get').then(res=>{
        console.log('应收应付',res);
        if(res.ResultCode==1){
            console.log('获取应收应付成功');
            this.setData({
              incomePrice:parseFloat(res.Result.split('|')[0]),
              costPrice:parseFloat(res.Result.split('|')[1]),
            })
            console.log(this.data.incomePrice,'incomePrice');
            console.log(this.data.costPrice,'costPrice');
        }
        else{
          console.log('获取应收应付失败');
        }
      })
    }
})