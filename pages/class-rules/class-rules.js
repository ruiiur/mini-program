Page({
    data: {
        headTop:0,
        currentTab: 0,
        valueDay:'0',
        weekList:[
            {name:'周一',selected:false},
            {name:'周二',selected:false},
            {name:'周三',selected:false},
            {name:'周四',selected:false},
            {name:'周五',selected:false},
            {name:'周六',selected:false},
            {name:'周日',selected:false},
        ],
        selectedWeek:[],//选中的周
        //  日历相关
        month: 0, 
        date: ['日', '一', '二', '三', '四', '五', '六'], 
        dateArr: [], 
        isToday: 0, 
        isTodayWeek: false, 
        todayIndex: 0 ,
        selectedDate:[],//选中的日期
    },
    //滑动切换
    swiperTab: function (e) {
        var that = this;
        that.setData({
          currentTab: e.detail.current
        });
    },
    //点击切换
    clickTab: function (e) {
        var that = this;
        if (this.data.currentTab === e.target.dataset.current) {
          return false;
        } else {
          this.data.selectedDate=[];
          this.data.selectedWeek=[];
          this.data.valueDay='0';
          for(var i=0;i<this.data.weekList.length;i++){
            this.data.weekList[i].selected=false;
          }
          for(var i=0;i<this.data.dateArr.length;i++){
            this.data.dateArr[i].selected=false;
          }
          that.setData({
              currentTab: e.target.dataset.current,
              weekList:this.data.weekList,
              dateArr:this.data.dateArr,
          })
        }
    },
    //点击切换周几
    clickWeek: function (e) {
      var index=e.target.dataset.index;
      this.data.weekList[index].selected=!this.data.weekList[index].selected;
      if(this.data.weekList[index].selected){
        this.data.selectedWeek.push(index+1);
        this.setData({
          selectedWeek: this.data.selectedWeek
        })
      }
      else{
        for(var i=0;i<this.data.weekList.length;i++){
          if(this.data.selectedWeek[i]==index+1){
            this.data.selectedWeek.splice(i,1);
            this.setData({
              selectedWeek:this.data.selectedWeek
            })
          }
        }
      }
      console.log(this.data.selectedWeek);
      this.setData({
        weekList: this.data.weekList
      })
    },
    // 点击选择日期
    clickDate: function (e) {
      console.log(e);
      var index=e.currentTarget.dataset.index;
      this.data.dateArr[index].selected=!this.data.dateArr[index].selected;
      if(this.data.dateArr[index].selected){
        this.data.selectedDate.push(this.data.dateArr[index].isToday);
        this.setData({
          selectedDate: this.data.selectedDate
        })
      }
      else{
        for(var i=0;i<this.data.selectedDate.length;i++){
          if(this.data.selectedDate[i]==this.data.dateArr[index].isToday){
            this.data.selectedDate.splice(i,1);
            this.setData({
              selectedDate:this.data.selectedDate
            })
          }
        }
      }
      // console.log( this.data.dateArr[index].isToday);
      // console.log( this.data.dateArr[index].dateNum);
      console.log( this.data.selectedDate);
      this.setData({
        dateArr: this.data.dateArr
      })
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
                selected:false
              //   weight: 5 
              } 
            }
            else if(num>10 && parseInt((month + 1))<10){
              obj = { 
                isToday: '' + year +'-0' + (month + 1)+'-' + num, 
                dateNum: num, 
                selected:false
              //   weight: 5 
              } 
            }
            else if(num<10 && parseInt((month + 1))<10){
              obj = { 
                isToday: '' + year +'-0' + (month + 1)+'-0' + num, 
                dateNum: num, 
                selected:false
              //   weight: 5 
              } 
            }
            else{
              obj = { 
                isToday: '' + year +'-' + (month + 1)+'-' + num, 
                dateNum: num, 
                selected:false
              //   weight: 5 
              } 
            }
          }else{ 
            obj = {
              isToday:'',
              dateNum:'',
              selected:false
            }; 
          } 
          dateArr[i] = obj; 
        }
        //高亮
        if(this.data.selectedDate.length!=0){
          for(var i=0;i<this.data.selectedDate.length;i++){
            for(var j=0;j<dateArr.length;j++){
              if(this.data.selectedDate[i]==dateArr[j].isToday){
                dateArr[j].selected=true;
              }
            }
          }
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
    lastMonth: function(){ 
        //全部时间的月份都是按0~11基准，显示月份才+1 
        let year = this.data.month - 2 < 0 ? this.data.year - 1 : this.data.year; 
        let month = this.data.month - 2 < 0 ? 11 : this.data.month - 2; 
        this.setData({ 
          year: year, 
          month: (month + 1) 
        }) 
        this.dateInit(year,month); 
    }, 
    nextMonth: function(){ 
        //全部时间的月份都是按0~11基准，显示月份才+1 
        let year = this.data.month > 11 ? this.data.year + 1 : this.data.year; 
        let month = this.data.month > 11 ? 0 : this.data.month; 
        this.setData({ 
          year: year, 
          month: (month + 1) 
        }) 
        this.dateInit(year, month); 
    },
    // 选择的日期
    keepDay:function(e){
      console.log(parseInt(e.detail.value),'llllllllllllllllll');
      if(parseInt(e.detail.value)==''|| isNaN(parseInt(e.detail.value))){
        this.setData({
          valueDay:0
        })
      }
      else{
        this.setData({
          valueDay:parseInt(e.detail.value)
        })
      }
    },
    // 规则提交
    ruleSubmit:function(){
      if(this.data.currentTab==0){
        wx.setStorageSync("ruleInfo",this.data.valueDay);
        wx.setStorageSync("ruleType",1);
      }
      if(this.data.currentTab==1){
        wx.setStorageSync("ruleInfo",this.data.selectedWeek.join(','));
        wx.setStorageSync("ruleType",2);
      }
      if(this.data.currentTab==2){
        wx.setStorageSync("ruleInfo",this.data.selectedDate.join(','));
        wx.setStorageSync("ruleType",3);
      }
      wx.showToast({
        title: '开班规则选择成功',
        icon: "none",
        duration: 1000,
        mask:true
      })
      setTimeout(()=>{ 
        wx.navigateTo({ 
          url:"../open-class/open-class"
        })
      }, 2000);
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
          isToday: '' + year + month + now.getDate() 
        }) 
    }
})