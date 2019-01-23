var util = require('../../utils/util.js');
var server = require('../../utils/server.js');
Page({
    data: {
        headTop:0,
        array: ['身份证', '护照', '回乡证', '军官证','其他'],
        // objectArray: [
        //   {
        //     id: 0,
        //     name: '身份证'
        //   },
        //   {
        //     id: 1,
        //     name: '护照'
        //   },
        //   {
        //     id: 2,
        //     name: '回乡证'
        //   },
        //   {
        //     id: 3,
        //     name: '军官证'
        //   },
        //   {
        //     id: 4,
        //     name: '其他'
        //   }
        // ],
        // index: 0,
        proId:'',//产品id
        adultNum:1,//成人数量
        childNum:0,//儿童数量
        trafficNote:'',//大交通备注
        orderTourist:[
          {GuestCardType:0,GuestName:'',GuestCard:'',GuestTelphone:'',GuestSex:''}
        ],//游客信息
        tourDate:'',//团期
        adultSalePrice:0,//成人结算价
        childSalePrice:0,//儿童结算价
        adultPolicyId:'',//成人价格策略id
        childPolicyId:'',//儿童价格策略id
        // salesPrice:'',//分销价
        sumPrice:0,//总价
        note:'',//备注
        tourId:'',//团期id
        proName:'',//产品名称
        touristsType:1,//名单录入还是拍照录入
        tourImgList:[],//游客照片集合
        OrderTraAttach:[],//大交通数据集合
        show:false,//价格明细是否显示
        incomePlus:true,//调账
        priceAdjust:0,//调账金额
        setPrice:0,//调整后结算价
        tipShow:true,//是否显示无格式粘贴提示
        copyNote:'',//粘贴内容
        copyShow:false,//是否显示无格式粘贴
        submitFlag:1,//是否可以提交
    },
    // 上传海报的弹窗
    popupPrice:function(){
      this.setData({ show:!this.data.show })
    },
    onCancel:function() {
      this.setData({ show: false });
    },
    onClose:function(){
      this.setData({ show: false });
    },
    // 录入方式改变时
    tourTypeChange:function(e){
      console.log(e);
      this.setData({
        touristsType:e.detail.index+1
      })
    },
    bindPickerChange: function(e) {
      console.log('picker发送选择改变，携带值为', e)
      this.data.orderTourist[e.currentTarget.dataset.index].GuestCardType=e.detail.value;
      this.setData({
        orderTourist:this.data.orderTourist
      })
    },
    //  保存用户等信息
    keepName:function(e){
      this.data.orderTourist[e.currentTarget.dataset.index].GuestName=e.detail.value;
      this.setData({
        orderTourist:this.data.orderTourist
      })
    },
    keepCard:function(e){
      this.data.orderTourist[e.currentTarget.dataset.index].GuestCard=e.detail.value;
      this.setData({
        orderTourist:this.data.orderTourist
      })
    },
    keepTel:function(e){
      this.data.orderTourist[e.currentTarget.dataset.index].GuestTelphone=e.detail.value;
      this.setData({
        orderTourist:this.data.orderTourist
      })
    },
    keepSex:function(e){
      this.data.orderTourist[e.currentTarget.dataset.index].GuestSex=e.detail.value;
      this.setData({
        orderTourist:this.data.orderTourist
      })
    },
     // 保存调整金额
    priceAdjustFun:function(e){
      if(parseFloat(e.detail.value) % 1===0){
        this.data.priceAdjust=parseFloat(e.detail.value)
      }
      else{
        this.data.priceAdjust=parseFloat(e.detail.value).toFixed(2);
      }
      this.setData({
        priceAdjust:this.data.priceAdjust
      })
      this.computeIncome();
    },
    // 保存大交通的值
    keepTraffic:function(e){
      this.setData({
        trafficNote: e.detail.value
      })
      for(var i=0;i<this.data.OrderTraAttach.length;i++){
        this.data.OrderTraAttach[i].TraFileComment=this.data.trafficNote;
        this.setData({
          OrderTraAttach: this.data.OrderTraAttach
        })
      }
    },
    // 保存备注的值
    keepNote:function(e){
      this.setData({
        note: e.detail.value,
      })
    },
    // 保存粘贴的值
    keepCopyNote:function(e){
      if(e.detail.value!=''){
        this.data.tipShow=false;
      }
      else{
        this.data.tipShow=true;
      }
      this.setData({
        copyNote: e.detail.value,
        tipShow:this.data.tipShow
      })
    },
    // 确定粘贴
    confirmCopy:function(e){
      if(this.data.copyNote==''){
        this.setData({
          copyShow:false
        })
        return;
      }
      var arrCopy=this.data.copyNote.split('\n');
      var a=[];
      for(var i=0;i<arrCopy.length;i++){
        console.log(arrCopy[i].split('      '));
        var s=arrCopy[i];
        if(s!=''){
          s=s.replace(/\s/g,'');
          var arr1=s.split(/[0,1,2,3,4,5,6,7,8,9]/);
          var name=arr1[0];
          var sfId=s.replace(arr1[0],'');
          var json={
            'name':name,
            'sfId':sfId
          }
          a.push(json);
          for(var i=0;i<this.data.orderTourist.length;i++){
            this.data.orderTourist[i].GuestName=a[i].name;
            this.data.orderTourist[i].GuestCard=a[i].sfId;
          }
          this.setData({
            orderTourist:this.data.orderTourist,
            copyShow:false
          })
          // var reg = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/; 
          // if(!reg.test(arrCopy[i].split('  ')[1])){
          //   console.log(arrCopy[i].split('  ')[1])
          //     wx.showToast({
          //       title: '粘贴内容格式不正确',
          //       icon: "none",
          //     })
          //     return;
          // }
        }
      }
      console.log(arrCopy,'arrCopy');
    },
    // 取消粘贴
    cancelCopy:function(e){
      this.setData({
        copyNote:'',
        copyShow:false
      })
    },
    // 无格式粘贴
    pasteFun:function(){
      this.setData({
        copyShow:true
      })
    },
    // 手动输入成人人数时
    checkAdult:function(e){
      console.log(e);
      if(parseInt(e.detail.value)>0){
        this.setData({
          adultNum: parseInt(e.detail.value),
          // sumPrice:e.detail.value*this.data.salePrice
        })
      }
      else{
        this.setData({
          adultNum:1,
          // sumPrice:e.detail.value*this.data.salePrice
        })
      }
      this.computeSum();
      // console.log(this.data.orderTourist.length,'111');
      // console.log(this.data.adultNum,'222');
      // if(this.data.orderTourist.length>this.data.adultNum && this.data.adultNum!='' &&this.data.adultNum>0){
      //   console.log('da');
      //   this.data.orderTourist.splice(this.data.adultNum-1,this.data.orderTourist.length-this.data.adultNum+1);
      //   this.setData({
      //     orderTourist: this.data.orderTourist,
      //   })
      // }
      // if(this.data.orderTourist.length<this.data.adultNum && this.data.adultNum!='' &&this.data.adultNum>0){
      //   console.log('xiao')
      //   console.log(parseInt(this.data.adultNum)-parseInt(this.data.orderTourist.length));
      //   var minLength=parseInt(this.data.adultNum)-parseInt(this.data.orderTourist.length);
      //   for(var i=0;i<minLength;i++){
      //     console.log('1');
      //     this.data.orderTourist.push({GuestCardType:0,GuestName:'',GuestCard:'',GuestTelphone:'',GuestSex:''});
      //     this.setData({
      //       orderTourist: this.data.orderTourist,
      //     })
      //     console.log(this.data.orderTourist);
      //   }
      // }
    },
    // 手动录入儿童数量
    checkChild:function(e){
      if(parseInt(e.detail.value)>0){
        this.setData({
          childNum: parseInt(e.detail.value),
          // sumPrice:e.detail.value*this.data.salePrice
        })
      }
      else{
        this.setData({
          childNum:0,
          // sumPrice:e.detail.value*this.data.salePrice
        })
      }
      this.computeSum();
    },
    // 新增游客
    addTour:function(){
      this.data.orderTourist.push({GuestCardType:0,GuestName:'',GuestCard:'',GuestTelphone:'',GuestSex:''});
      // this.data.adultNum=this.data.adultNum+1;
      this.setData({
        orderTourist: this.data.orderTourist,
        // adultNum:this.data.adultNum,
        // sumPrice:this.data.adultNum*this.data.salePrice
      })
      this.computeSum();
    },
    // 减少游客
    reduceTour:function(e){
      this.data.orderTourist.splice(e.currentTarget.dataset.index,1)
      // this.data.adultNum=this.data.adultNum-1;
      this.setData({
        orderTourist: this.data.orderTourist,
        // adultNum:this.data.adultNum,
        // sumPrice:this.data.adultNum*this.data.salePrice
      })
      this.computeSum();
    },
    // 计算总价
    computeSum:function(){
      this.setData({
        sumPrice:(this.data.adultSalePrice*100)*this.data.adultNum/100+(this.data.childSalePrice*100)*this.data.childNum/100,
        setPrice:(this.data.adultSalePrice*100)*this.data.adultNum/100+(this.data.childSalePrice*100)*this.data.childNum/100+parseInt(this.data.priceAdjust)
      })
    },
    // 调账
    incomeFun:function(e){
      if((e.currentTarget.dataset.num==1&&this.data.incomePlus===true) || (e.currentTarget.dataset.num==4&&this.data.incomePlus===false) || (e.currentTarget.dataset.num==3&&this.data.incomePlus===true) || (e.currentTarget.dataset.num==2&&this.data.incomePlus===false)){
        return;
      }
      this.setData({
        incomePlus:!this.data.incomePlus
      })
      console.log(this.data.incomePlus,'incomePlus');
      this.computeIncome();
    },
     // 计算调账后
     computeIncome:function(){
      if(this.data.priceAdjust!==''){
        if((this.data.incomePlus===false && this.data.priceAdjust>0) || (this.data.incomePlus===true && this.data.priceAdjust<0)){
          this.setData({
            priceAdjust:-this.data.priceAdjust
          })
        }
        console.log(parseFloat(this.data.sumPrice),'sumP')
        console.log(parseFloat(this.data.priceAdjust),'sumA')
        this.data.setPrice=parseFloat(this.data.sumPrice)+parseFloat(this.data.priceAdjust);
        if(parseFloat(this.data.setPrice) % 1===0){
          this.data.setPrice=parseFloat(this.data.setPrice)
        }
        else{
          this.data.setPrice=parseFloat(this.data.setPrice).toFixed(2);
        }
        this.setData({
          setPrice:this.data.setPrice
        })
      }
    },
    // 去团次管理页
    toMassManagement:function(e){
      wx.setStorageSync("isHome",0);
      wx.navigateTo({ 
           url:"../mass-management/mass-management"
      })
    },
    // 上传游客图片
    updateTourImg: function () {  
      var that = this;  
      wx.chooseImage({  
          count: 100,  //最多可以选择的图片总数  
          sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有  
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
          success: function (res) {  
              // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
              var tempFilePaths = res.tempFilePaths;  
              //启动上传等待中...  
              wx.showToast({  
                  title: '正在上传...',  
                  icon: 'loading',  
                  mask: true,
                  duration: 10000  
              })  
              var uploadImgCount = 0;  
              for (var i = 0, h = tempFilePaths.length; i < h; i++) {  
              wx.uploadFile({  
                  url:server.uploadImage,  
                  filePath: tempFilePaths[i],  
                  name: 'uploadfile',  
                  formData: {  
                      'imgIndex': i  
                  },  
                  header: {  
                      "Content-Type": "multipart/form-data"  
                  },  
                  success: function (res) {  
                      uploadImgCount++;  
                      var data = JSON.parse(res.data);  
                      console.log(data,'这是文件信息');
                      that.data.tourImgList.push({
                          "FileName": data.Result.split('|')[0], 
                          "FilePath":  data.Result.split('|')[1],
                      })
                      that.setData({
                        tourImgList:that.data.tourImgList
                      })
                      console.log(that.data.tourImgList,' that.data.tourImgList');
                      //如果是最后一张,则隐藏等待中  
                      if (uploadImgCount == tempFilePaths.length) {  
                          wx.hideToast();  
                      }
                  },  
                  fail: function (res) {  
                      wx.hideToast();  
                      wx.showModal({  
                          title: '错误提示',  
                          content: '上传图片失败',  
                          showCancel: false,  
                      })  
                  },
              })
          }
        }
      })
    },
    // 上传大交通图片
    updateTraffic: function () {  
        var that = this;  
        wx.chooseImage({  
            count: 100,  //最多可以选择的图片总数  
            sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有  
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
            success: function (res) {  
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
                var tempFilePaths = res.tempFilePaths;  
                //启动上传等待中...  
                wx.showToast({  
                    title: '正在上传...',  
                    icon: 'loading',  
                    mask: true,
                    duration: 10000  
                })  
                var uploadImgCount = 0;  
                for (var i = 0, h = tempFilePaths.length; i < h; i++) {  
                wx.uploadFile({  
                    url:server.uploadImage,  
                    filePath: tempFilePaths[i],  
                    name: 'uploadfile',  
                    formData: {  
                        'imgIndex': i  
                    },  
                    header: {  
                        "Content-Type": "multipart/form-data"  
                    },  
                    success: function (res) {  
                        uploadImgCount++;  
                        var data = JSON.parse(res.data);  
                        console.log(data,'这是文件信息');
                        that.data.OrderTraAttach.push({
                            "TraFileName": data.Result.split('|')[0], 
                            "TraFileImg":  data.Result.split('|')[1],
                            "TraFileComment": that.data.trafficNote
                        })
                        that.setData({
                          OrderTraAttach:that.data.OrderTraAttach
                        })
                        console.log(that.data.OrderTraAttach,' that.data.OrderTraAttach');
                        //如果是最后一张,则隐藏等待中  
                        if (uploadImgCount == tempFilePaths.length) {  
                            wx.hideToast();  
                        }
                    },  
                    fail: function (res) {  
                        wx.hideToast();  
                        wx.showModal({  
                            title: '错误提示',  
                            content: '上传图片失败',  
                            showCancel: false,  
                        })  
                    },
                })
            }
          }
        })
    },
     // 验证
    validFun:function(){
      if(this.data.tourDate==''){
          wx.showToast({
              title: '请选择出团日期',
              icon: "none",
              duration: 1000,
              mask:true
          })
          return false;
      }
      if(this.data.OrderTraAttach.length==0){
          wx.showToast({
              title: '请填写大交通相关信息',
              icon: "none",
              duration: 1000,
              mask:true
          })
          return false;
      }
    },
    //游客姓名列表判断
    nameListFun:function(e){
      console.log(this.data.orderTourist[e.currentTarget.dataset.index].GuestName,'游客姓名');
      if(this.data.orderTourist[e.currentTarget.dataset.index].GuestName==''){
        wx.showToast({
          title: '游客姓名不能为空',
          icon: "none",
        })
      }
    },
  //游客联系电话判断
  telListFun:function(e){
      var pattern = /^0{0,1}(1[0-9][0-9]|15[7-9]|153|156|18[7-9])[0-9]{8}$/;
      if(!pattern.test(this.data.orderTourist[e.currentTarget.dataset.index].GuestTelphone)&&this.data.orderTourist[e.currentTarget.dataset.index].GuestTelphone!=''){
        wx.showToast({
          title: '游客联系电话不正确',
          icon: "none",
        })
      }
  },
  //游客身份证列表判断
  cardListFun:function(e){
      var reg = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/; 
      if(!reg.test(this.data.orderTourist[e.currentTarget.dataset.index].GuestCard)&&(this.data.orderTourist[e.currentTarget.dataset.index].GuestCard!=''||this.data.orderTourist[e.currentTarget.dataset.index].GuestCard!=undefined)&&this.data.orderTourist[e.currentTarget.dataset.index].GuestCardType==0){
          wx.showToast({
            title: '游客身份证信息不合法',
            icon: "none",
          })
          return;
      }
      else if(this.data.orderTourist[e.currentTarget.dataset.index].GuestCard==''&&this.data.orderTourist[e.currentTarget.dataset.index].GuestCardType==0){
          wx.showToast({
            title: '游客身份证信息不能为空',
            icon: "none",
          })
          return;
      }
      // 获取性别
      if(this.data.orderTourist[e.currentTarget.dataset.index].GuestCardType==0&& this.data.orderTourist[e.currentTarget.dataset.index].GuestCard!=='' && this.data.orderTourist[e.currentTarget.dataset.index].GuestCard.length==18){
        if (parseInt(this.data.orderTourist[e.currentTarget.dataset.index].GuestCard.substr(16, 1)) % 2 == 1) {
          this.data.orderTourist[e.currentTarget.dataset.index].GuestSex="男";
        } else {
          this.data.orderTourist[e.currentTarget.dataset.index].GuestSex="女";
        }
        this.setData({
          orderTourist: this.data.orderTourist,
        })
      }
  },

  //判断旅客信息的值填写的是否正确
  judgeGuestIsCorrect:function(array) {
      console.log(array);
      let objArr = []; 
      // 如果空的数量=数组的数量   弹出提示填写手机号，
      // 如果空的数量小于数组的数量，则进行手机号码验证。
      // 验证根据，isHave="1" 则进行验证，=0不验证
      let phoneNum = 0;
      array.forEach((item,index) => {
          console.log(item,index);
          let objIndex ={};
          if(item.GuestTelphone==''){
              objIndex['isHave'] = '0';
              objIndex['index'] = index;
              objArr.push(objIndex);
              phoneNum = phoneNum+1;
          } else{
              objIndex['isHave'] = '1';
              objIndex['index'] = index;
              objArr.push(objIndex);
          }
          // console.log(objArr,'11111111111-------------',phoneNum);
      });

      // 对游客信息进行校验
      for(var i = 0;i<array.length;i++){
        //姓名
        if(array[i].GuestName==''){
          wx.showToast({
            title: '游客姓名不能为空',
            icon: "none",
          })
          return false;
        }
        //证件类型
        var reg = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/; 
        if(!reg.test(array[i].GuestCard)&&(array[i].GuestCard!=''||array[i].GuestCard!=undefined)&&array[i].GuestCardType==0){
            wx.showToast({
              title: '游客身份证信息不合法',
              icon: "none",
            })
            return false;
        }
        else if(array[i].GuestCard==''&& array[i].GuestCardType==0){
            wx.showToast({
              title: '游客身份证信息不能为空',
              icon: "none",
            })
            return false;
        }
        else if(array[i].GuestCard!="" && array[i].GuestCard!=undefined){
          if ((parseInt(array[i].GuestCard.substr(16, 1)) % 2 == 1&&array[i].GuestSex=="女") || (parseInt(array[i].GuestCard.substr(16, 1)) % 2 == 0&&array[i].GuestSex=="男")) {
            wx.showToast({
              title: '身份证信息与性别不符',
              icon: "none",
            })
            return false;
          } 
        } 
        // 证件号是否重复验证
        if (i !== array.length - 1) {
          for (var j = i ; j < array.length; j++) {
            if (i!=j && array[i].GuestCard == array[j].GuestCard) {
            wx.showToast({
              title: '证件号不能重复',
              icon: "none",
            })
            return false;
            } 
          }
        }
        //手机号码
        if(phoneNum<array.length){
              if(objArr[i].isHave=='1'){
                  console.log('判断手机号码');
                  let pattern = /^0{0,1}(1[0-9][0-9]|15[7-9]|153|156|18[7-9])[0-9]{8}$/;
                  if(!pattern.test(array[i].GuestTelphone)){
                    wx.showToast({
                      title: '请输入正确的联系电话',
                      icon: "none",
                    })
                    return false;
                  }
              }
          }else{
            wx.showToast({
              title: '请您填写任意游客的联系电话',
              icon: "none",
            })
            return false;
          }
      }
  },
  // 产品下单
  orderSubmit(){
    if(this.data.touristsType==1&&this.judgeGuestIsCorrect(this.data.orderTourist)==false){
      return;
    }
    if(this.data.touristsType==2&&this.data.tourImgList.length==0){
      wx.showToast({
        title: '请先拍照录入游客图片',
        icon: "none",
      })
      return;
    }
    if(this.validFun()==false){
      return;
    }
    if(this.data.submitFlag==0){
      wx.showToast({
        title: '不能重复提交哦~',
        icon: "none",
      })
      return;
    }
    if(this.data.submitFlag==1){
      this.setData({
        submitFlag:0
      })
      let params={
        'productID':this.data.proId,
        // 'productID':'5d08752d-3cee-47a7-bf91-ec4fce16700d',
        'ProName':this.data.proName,
        'TourID':this.data.tourId,
        'TourDate':this.data.tourDate,
        'AdultNum':this.data.adultNum,
        'ChildNum':this.data.childNum,
        'GuideNum':0,//全陪数量，以后可能用的到
        // 'ItemPrice':this.data.salePrice,
        'TouristsType':this.data.touristsType,
        'OrderTourAttach':this.data.tourImgList,
        'OrderTourist':this.data.orderTourist,
        // 'TraFileComment':this.data.trafficNote,//大交通备注
        // 'TraFileName':'',
        // 'TraFileImg':'',
        "OrderTraAttach":this.data.OrderTraAttach,
        'Comment':this.data.note,
        'ReceivableAmt':this.data.setPrice,
        'ReceivableAmtUnit':this.data.adlutSalePrice,
        'ReceivableAmtUnitChild':this.data.childSalePrice,
        // 'userID':"110A6516-154D-46E6-8C10-62AC5B1D7D04",
        'userID': wx.getStorageSync("userId"),
        'AdjustAmt':this.data.priceAdjust,
        'TourPriceAdultList':{
          'PepNumAdult':this.data.adultNum,
          'PricePolicyID':this.data.adultPolicyId
        },
        'TourPriceChildList':{
          'PepNumChild':this.data.childNum,
          'PricePolicyID':this.data.childPolicyId
        }
      }
      util.httpRequest(server.saveOrderInfo,params,'post').then(res=>{
        console.log('产品下单',res);
        if(res.ResultCode==1){
            console.log('产品下单成功');
            wx.showToast({
              title: '下单成功',
              icon: "none",
              duration: 1000,
              mask:true
          })
          setTimeout(()=>{ 
            wx.reLaunch({ 
                url:"../home/home"
            })
          }, 2000);
        }
        else{
          wx.showToast({
            title: '下单失败',
            icon: "none",
            duration: 1000,
            mask:true
          })
          this.setData({
            submitFlag:1
          })
          console.log('订单取消失败');
        }
      })
    }
  },
  onLoad: function (options) {
    console.log(options);
    this.setData({
      headTop:getApp().globalData.navHeight,
      proId:wx.getStorageSync("proId") || '',
      proName:wx.getStorageSync("proName") || '',
      tourDate:wx.getStorageSync("tourDate"),
      adultSalePrice:wx.getStorageSync("adultSalePrice")||0,
      childSalePrice:wx.getStorageSync("childSalePrice")||0,
      adultPolicyId:wx.getStorageSync("adultPolicyId")||'',
      childPolicyId:wx.getStorageSync("childPolicyId")||'',
      tourId:wx.getStorageSync("tourId"),
      setPrice:wx.getStorageSync("adultSalePrice")*this.data.adultNum+wx.getStorageSync("childSalePrice")*this.data.childNum || 0,
      sumPrice:wx.getStorageSync("adultSalePrice")*this.data.adultNum+wx.getStorageSync("childSalePrice")*this.data.childNum || 0
    });
  }
})