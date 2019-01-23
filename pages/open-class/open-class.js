var util = require('../../utils/util.js');
var server = require('../../utils/server.js');
Page({
    data: {
        headTop:0,
        startDate: '开始日期',
        endDate: '结束日期',
        proId:'',//产品id
        proName:'',//产品名称
        planNum:'',//产品库存
        ruleInfo:'',//开班信息
        ruleType:'',//开班类型
        isToday:'',//今天的日期
        priceStrategies:[
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
        ],//价格策略
    },
    // 开始日期
    bindStartDateChange: function(e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            startDate: e.detail.value
        })
        wx.setStorageSync("startDate",this.data.startDate); 
    },
    // 绑定结束日期
    bindEndDateChange: function(e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        if(this.data.startDate=="开始日期"){
            wx.showToast({
                title: '请先选择开始日期',
                icon: "none",
                duration: 1000,
                mask:true
            })
            return;
        }
        if(this.tab(this.data.startDate,e.detail.value)==false){
            return;
        }
        this.setData({
            endDate: e.detail.value
        })
        wx.setStorageSync("endDate",this.data.endDate);
    },
    // 日期比较大小
    tab:function(date1,date2){
        var oDate1 = new Date(date1);
        var oDate2 = new Date(date2);
        if(oDate1.getTime() > oDate2.getTime()){
            console.log('第一个大');
            wx.showToast({
                title: '结束日期不可早于开始日期',
                icon: "none",
                duration: 1000,
                mask:true
            })
            return false;
        } else {
            console.log('第二个大');
        }
    },
    // 保存input值
    keepPlanNum:function(e){
        this.setData({
          planNum:parseInt(e.detail.value)
        })
        wx.setStorageSync("planNum",this.data.planNum);
    },
    keepPriceInfo:function(e){
        if(parseFloat(e.detail.value) % 1===0){
            this.data.priceStrategies[e.currentTarget.dataset.index][e.currentTarget.dataset.price]=parseFloat(e.detail.value)
        }
        else{
            this.data.priceStrategies[e.currentTarget.dataset.index][e.currentTarget.dataset.price]=parseFloat(e.detail.value).toFixed(2);
        }
        this.setData({
            priceStrategies:this.data.priceStrategies
        })
        wx.setStorageSync("priceStrategies",this.data.priceStrategies);
    },
    // 选择月
    chooseMonth:function(e){
        var nextMonth=parseInt(this.data.isToday.split('-')[1])+parseInt(e.currentTarget.dataset.index);
        if(nextMonth<10){
            this.setData({
                startDate:this.data.isToday,
                endDate:this.data.isToday.split('-')[0]+'-0'+nextMonth+'-'+this.data.isToday.split('-')[2],
            })
        }
        else if(nextMonth>12){
            this.setData({
                startDate:this.data.isToday,
                endDate:(parseInt(this.data.isToday.split('-')[0])+1)+'-01'+'-'+this.data.isToday.split('-')[2],
            })
        }
        else{
            this.setData({
                startDate:this.data.isToday,
                endDate:this.data.isToday.split('-')[0]+'-'+nextMonth+'-'+this.data.isToday.split('-')[2],
            })
        }
        wx.setStorageSync("endDate",this.data.endDate);
        wx.setStorageSync("startDate",this.data.startDate); 
    },
    // 去开班规则页
    toClassRules:function(e){
        wx.navigateTo({ 
             url:"../class-rules/class-rules"
        })
    },
    // 验证
    validFun:function(){
        if(this.data.startDate=="开始日期"){
            wx.showToast({
                title: '请选择开始日期',
                icon: "none",
                duration: 1000,
                mask:true
            })
            return false;
        }
        if(this.data.endDate=="结束日期"){
            wx.showToast({
                title: '请选择结束日期',
                icon: "none",
                duration: 1000,
                mask:true
            })
            return false;
        }
        if(this.data.planNum==""|| isNaN(this.data.planNum)){
            wx.showToast({
                title: '请填写产品库存',
                icon: "none",
                duration: 1000,
                mask:true
            })
            return false;
        }
        if(this.data.ruleInfo===""){
            wx.showToast({
                title: '请选择开班规则',
                icon: "none",
                duration: 1000,
                mask:true
            })
            return false;
        }
        for(var i=0;i<this.data.priceStrategies.length;i++){
            if(this.data.priceStrategies[i].DirectPrice===''&&i==0){
                wx.showToast({title: '请填写成人直客价',icon: "none",})
                return false;
            }
            if(this.data.priceStrategies[i].DirectPrice===''&&i==1){
                wx.showToast({title: '请填写儿童直客价',icon: "none",})
                return false;
            }
            if(this.data.priceStrategies[i].SalesPrice===''&&i==0){
                wx.showToast({title: '请填写成人分销价',icon: "none",})
                return false;
            }
            if(this.data.priceStrategies[i].SalesPrice===''&&i==1){
                wx.showToast({title: '请填写儿童分销价',icon: "none",})
                return false;
            }
            if(this.data.priceStrategies[i].RebatePrice===''&&i==0){
                wx.showToast({title: '请填写成人返佣价',icon: "none",})
                return false;
            }
            if(this.data.priceStrategies[i].RebatePrice===''&&i==1){
                wx.showToast({title: '请填写儿童返佣价',icon: "none",})
                return false;
            }
            if(this.data.priceStrategies[i].SingleRoomPrice===''&&i==0){
                wx.showToast({title: '请填写成人单房差',icon: "none",})
                return false;
            }
            if(this.data.priceStrategies[i].SingleRoomPrice===''&&i==1){
                wx.showToast({title: '请填写儿童单房差',icon: "none",})
                return false;
            }
        }      
    },
    // 产品开班
    openClassSubmit:function(e){
        if(this.validFun()==false){
            return;
        }
        let params={
            "StartTime": this.data.startDate,
            "EndTime":  this.data.endDate,
            "PlanNum": this.data.planNum,
            "PriceStrategies":this.data.priceStrategies,
            "ProID": this.data.proId,
            "ProName":  this.data.proName,
            "OrgID": wx.getStorageSync("orgId"),
            // "OrgID": "C94C21D6-4C6D-4A80-BD19-5341E7014D47",
            "UserID": wx.getStorageSync("userId"),
            // "UserID": "110A6516-154D-46E6-8C10-62AC5B1D7D04",
            "DateType": this.data.ruleType,
            "DateInfo": this.data.ruleInfo
        }
        util.httpRequest(server.addTour,params,'post').then(res=>{
            console.log('开班',res);
            if(res.ResultCode==1){
                console.log('开班成功');
                wx.showToast({
                    title: '开班成功',
                    icon: 'none',
                    duration: 1000,
                    mask:true
                })
                setTimeout(()=>{ 
                    wx.reLaunch({ 
                        url:"../home/home",
                    })
                }, 2000);
            }
            else{
                wx.showToast({
                    title: '开班失败',
                    icon: 'none',
                    duration: 1000,
                    mask:true
                })
                console.log('开班失败');
            }
        })
    },
    onLoad: function (options) {
        console.log(options);
        let now = new Date(); 
        let year = now.getFullYear(); 
        let month = now.getMonth() + 1; 
        var today;
        if(month>10 && parseInt(now.getDate())<10){
            today= '' + year +'-' + month +'-0' + now.getDate()
        }
        else if(month<10 && parseInt(now.getDate())>10){
            today= '' + year +'-0' + month+'-' + now.getDate()
        }
        else if(month<10 && parseInt(now.getDate())<10){
            today= '' + year +'-0' + month+'-0' + now.getDate()  
        }
        else{
            today= '' + year +'-' + month + '-' + now.getDate()
        }
        // console.log(wx.getStorageSync("ruleInfo"));
        // console.log(wx.getStorageSync("ruleType"));
        this.setData({
            headTop:getApp().globalData.navHeight,
            proId:wx.getStorageSync("proId") || '',
            proName:wx.getStorageSync("proName") || '',
            ruleInfo:wx.getStorageSync("ruleInfo"),
            ruleType:wx.getStorageSync("ruleType"),
            startDate:wx.getStorageSync("startDate"),
            endDate:wx.getStorageSync("endDate"),
            planNum:wx.getStorageSync("planNum"),
            priceStrategies:wx.getStorageSync("priceStrategies"),
            // directPrice:wx.getStorageSync("directPrice"),
            // salesPrice:wx.getStorageSync("salesPrice"),
            // rebatePrice:wx.getStorageSync("rebatePrice"),
            // singleRoomPrice:wx.getStorageSync("singleRoomPrice"),
            isToday:today
        });
        console.log(this.data.ruleInfo);
        console.log(this.data.ruleType);
        console.log(this.data.isToday);
    }
})