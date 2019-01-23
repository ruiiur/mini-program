var util = require('../../utils/util.js');
var server = require('../../utils/server.js');
Page({
    data: {
        headTop:0,
        // planNum:0,//库存
        // directPrice:0,//直客价格
        // salesPrice:0,//分销价格
        // rebatePrice:0,//返佣
        // singleRoomPrice:0,//单房差
        // salePrice:0,//销售价格
        //  日历相关
        month: 0, 
        date: ['日', '一', '二', '三', '四', '五', '六'], 
        dateArr: [], 
        isToday: 0, 
        isTodayWeek: false, 
        todayIndex: 0 ,
        monthArr:[],
        tourDate:'',//选择的团期
        lowestPrice:[],//最低价格
        tourPriceList:[],//团期价格数组
        monthIndex:0,//选择的月份
        proId:'',//产品id
        priceList:[
            {
                PlanNum:0,
                RebatePrice:0,
                SalePrice:0,
                SalesPrice:0,
                SingleRoomPrice:0,
                DirectPrice:0
            },
            {
                PlanNum:0,
                RebatePrice:0,
                SalePrice:0,
                SalesPrice:0,
                SingleRoomPrice:0,
                DirectPrice:0
            }
        ],//单个团期对应的默认值
        isHome:0,//是否从首页跳转过来，1是 0否
        isDetail:0,//是否从产品详情跳转过来，1是，0否
    },
    // 选择月份
    chooseMonth:function(e){
        console.log(e);
        console.log(this.data.monthIndex);
        console.log(e.currentTarget.dataset.index);
        if (this.data.monthIndex === e.currentTarget.dataset.index) {
            return false;
        } else {
            this.setData({
                monthIndex: e.currentTarget.dataset.index
            })
            var yearC= this.data.monthArr[this.data.monthIndex].month.split('-')[0];
            var monthC= parseInt(this.data.monthArr[this.data.monthIndex].month.split('-')[1]);
            // console.log(yearC,monthC)
            this.dateInit(yearC,monthC-1);
            if(this.data.tourPriceList.length!=0){
                for(var i=0;i<this.data.dateArr.length;i++){
                    var Year=this.data.dateArr[i].isToday.split('-')[0];
                    var Month=parseInt(this.data.dateArr[i].isToday.split('-')[1]);
                    var Day=parseInt(this.data.dateArr[i].isToday.split('-')[2]);
                    for(var j=0;j<this.data.tourPriceList.length;j++){
                        if(Year==this.data.tourPriceList[j].Year&&Month==this.data.tourPriceList[j].Month&&Day==this.data.tourPriceList[j].Day){
                            this.data.dateArr[i].price='￥'+this.data.tourPriceList[j].SalesPrice;
                            this.setData({ 
                                dateArr: this.data.dateArr, 
                            }) 
                        }
                    }
                }
            }
        }
    },
    dateInit: function(setYear,setMonth){ 
        //全部时间的月份都是按0~11基准，显示月份才+1 
        let dateArr = [];            //需要遍历的日历数组数据 
        let arrLen = 0;             //dateArr的数组长度 
        let now = setYear ? new Date(setYear,setMonth) : new Date(); 
        let year = setYear || now.getFullYear(); 
        let nextYear = 0; 
        let month = setMonth || now.getMonth();         //没有+1方便后面计算当月总天数 
        let nextMonth = (month + 1) > 11 ? 1 : (month + 1);    
        let startWeek = new Date( year+','+(month + 1)+','+1).getDay();             //目标月1号对应的星期 
        let dayNums = new Date(year,nextMonth,0).getDate();       //获取目标月有多少天 
        let obj = {};     
        let num = 0; 
          
        if(month + 1 > 11){ 
          nextYear = year + 1; 
          dayNums = new Date(nextYear,nextMonth,0).getDate(); 
        } 
        arrLen = startWeek + dayNums; 
        for(let i = 0; i < arrLen; i++){ 
          if(i >= startWeek){ 
            num = i - startWeek + 1; 
            if(num<10 && parseInt((month + 1))>10){
              obj = { 
                isToday: '' + year +'-' + (month + 1)+'-0' + num, 
                dateNum: num, 
                selected:false,
                price:''
              } 
            }
            else if(num>10 && parseInt((month + 1))<10){
              obj = { 
                isToday: '' + year +'-0' + (month + 1)+'-' + num, 
                dateNum: num, 
                selected:false,
                price:''
              } 
            }
            else if(num<10 && parseInt((month + 1))<10){
              obj = { 
                isToday: '' + year +'-0' + (month + 1)+'-0' + num, 
                dateNum: num, 
                selected:false,
                price:''
              } 
            }
            else{
              obj = { 
                isToday: '' + year +'-' + (month + 1)+'-' + num, 
                dateNum: num, 
                selected:false,
                price: '' 
              } 
            }
          }else{ 
            obj = {
              isToday:'',
              dateNum:'',
              selected:false,
              price:''
            }; 
          } 
          dateArr[i] = obj; 
        }
        this.setData({ 
          dateArr: dateArr 
        }) 
        
        let nowDate = new Date(); 
        let nowYear = nowDate.getFullYear(); 
        let nowMonth = nowDate.getMonth() + 1; 
        let nowWeek = nowDate.getDay(); 
        let getYear = setYear || nowYear; 
        let getMonth = setMonth >= 0 ? (setMonth + 1) : nowMonth; 
      
        if (nowYear == getYear && nowMonth == getMonth){ 
          this.setData({ 
            isTodayWeek: true, 
            todayIndex: nowWeek 
          }) 
        }else{ 
          this.setData({ 
            isTodayWeek: false, 
            todayIndex: -1 
          }) 
        } 
    }, 
    nextMonth: function(){ 
        //全部时间的月份都是按0~11基准，显示月份才+1 
        for(var i=0;i<4;i++){
            if(this.data.month<10){
                this.data.monthArr.push({month:this.data.year+'-0'+this.data.month,price:'暂无团期'});
            }
            else{
                this.data.monthArr.push({month:this.data.year+'-'+this.data.month,price:"暂无团期"});
            }
            let year = this.data.month > 11 ? this.data.year + 1 : this.data.year; 
            let month = this.data.month > 11 ? 0 : this.data.month;
            this.setData({ 
                monthArr: this.data.monthArr, 
                year: year, 
                month: (month + 1) 
            }) 
        }
        console.log(this.data.monthArr);
        let params={
            "proId":this.data.proId
        }
        util.httpRequest(server.selectTourAll,params,'get').then(res=>{
            console.log('选择团期',res);
            if(res.ResultCode==1){
                console.log('选择团期成功');
                if(res.Result.LowestPrice!=null){
                    this.data.lowestPrice=res.Result.LowestPrice;
                }
                if(res.Result.TourPriceList.length!=0){
                    this.data.tourPriceList=res.Result.TourPriceList;
                }
                this.setData({ 
                    lowestPrice: this.data.lowestPrice, 
                    tourPriceList: this.data.tourPriceList
                }) 
                if(this.data.lowestPrice.length!=0){
                    console.log('hhhhhhh');
                    for(var i=0;i<this.data.lowestPrice.length;i++){
                        for(var j=0;j<this.data.monthArr.length;j++)
                        if(this.data.lowestPrice[i].YearMonth==this.data.monthArr[j].month){
                            this.data.monthArr[j].price="￥"+this.data.lowestPrice[i].Price+"起";
                        }
                    }
                    this.setData({ 
                        monthArr: this.data.monthArr, 
                    }) 
                }
                if(this.data.tourPriceList.length!=0){
                    for(var i=0;i<this.data.dateArr.length;i++){
                        var Year=this.data.dateArr[i].isToday.split('-')[0];
                        var Month=parseInt(this.data.dateArr[i].isToday.split('-')[1]);
                        var Day=parseInt(this.data.dateArr[i].isToday.split('-')[2]);
                        // console.log(Year);
                        // console.log(Month);
                        // console.log(Day);
                        for(var j=0;j<this.data.tourPriceList.length;j++){
                           
                            if(Year==this.data.tourPriceList[j].Year&&Month==this.data.tourPriceList[j].Month&&Day==this.data.tourPriceList[j].Day){
                                this.data.dateArr[i].price='￥'+this.data.tourPriceList[j].SalesPrice;
                                this.setData({ 
                                    dateArr: this.data.dateArr, 
                                }) 
                            }
                        }
                    }
                }
            }
            else{
                console.log('选择团期失败');
            }
        })
        console.log(this.data.monthArr);
        console.log(this.data.lowestPrice);
        console.log(this.data.tourPriceList);
    },
    // 查看选择的团期
    clickDate:function(e){
        console.log(e);
        this.setData({ 
            tourDate:e.currentTarget.dataset.date
        }) 
        if(this.data.dateArr[e.currentTarget.dataset.index].price==""){
            return;
        }
        let params={
            // "proId":'5C84FE1D-DA00-4D74-A30F-006215BC1524',
            "proId":this.data.proId,
            'tourDate':this.data.tourDate
        }
        util.httpRequest(server.selectTourByDate,params,'get').then(res=>{
            console.log('选择单个团期',res);
            if(res.ResultCode==1){
                console.log('选择单个团期成功');
                for(var i=0;i<res.Result.TourPriceList.length;i++){
                   this.data.priceList[i].DirectPrice=res.Result.TourPriceList[i].DirectPrice;//直客价格
                   this.data.priceList[i].SalesPrice=res.Result.TourPriceList[i].SalesPrice;//分销价格
                   this.data.priceList[i].SalePrice=res.Result.TourPriceList[i].SalePrice;//销售价格
                   this.data.priceList[i].RebatePrice=res.Result.TourPriceList[i].RebatePrice;//返佣
                   this.data.priceList[i].SingleRoomPrice=res.Result.TourPriceList[i].SingleRoomPrice;//单房差
                   this.data.priceList[i].PlanNum=res.Result.TourPriceList[i].PlanNum;//库存
                   this.data.priceList[i].PolicyId=res.Result.TourPriceList[i].PolicyId;//价格策略id
                }
                this.setData({ 
                    priceList:this.data.priceList,//库存
                }) 
                wx.setStorageSync("tourId",res.Result.TourPriceList[0].TourId);
            }
            else{
                console.log('选择单个团期失败');
            }
        })
    },
    // 去修改团期页
    toMassChange:function(){
        wx.setStorageSync("tourDate",this.data.tourDate);
        wx.navigateTo({
            url:"../mass-change/mass-change"
        })
    },
    // 去下单页面
    toOrderPro: function(){
        wx.setStorageSync("tourDate",this.data.tourDate);
        console.log(this.data.priceList,'priceList');
        wx.setStorageSync("adultSalePrice",this.data.priceList[0].SalePrice);
        wx.setStorageSync("childSalePrice",this.data.priceList[1].SalePrice);
        wx.setStorageSync("adultPolicyId",this.data.priceList[0].PolicyId);
        wx.setStorageSync("childPolicyId",this.data.priceList[1].PolicyId);
        // wx.setStorageSync("salesPrice",this.data.salesPrice);
        // console.log(this.data.priceList[0].PolicyId,'this.data.priceList[0].PolicyId');
        wx.navigateTo({
            url:"../product-order/product-order"
        })
    },
    onLoad: function () {
        let now = new Date(); 
        let year = now.getFullYear(); 
        let month = now.getMonth() + 1; 
        this.dateInit(); 
        this.setData({ 
            headTop:getApp().globalData.navHeight,
            year: year, 
            month: month, 
            isToday: '' + year + month + now.getDate(),
            proId:wx.getStorageSync("proId") || '',
            isHome:wx.getStorageSync("isHome") || 0,
            isDetail:wx.getStorageSync("isDetail") || 0,
        }) 
        this.nextMonth();
    }
})