var util = require('../../utils/util.js');
var server = require('../../utils/server.js');
Page({
    data: {
        productList:[],//产品列表
        proId:'',//产品id
        pageNo:1,//当前页
        totalNum:'',//总共的数据条数
        pageSize:10,//每次请求的个数
        noData:'',//没有更多数据提示
        isList:true,//是否显示列表
        isShow:false,//图文展示是否展示图片
    },
    // 图文切换
    switch:function(){
        this.data.isShow=!this.data.isShow;
        this.setData({
            isShow: this.data.isShow
        });
    },
    // 去产品详情页
    toDetails:function(e){
        wx.navigateTo({ 
            url:"../product-details/product-details?id="+e.currentTarget.dataset.proid
        })
    },
    // 去产品下单页
    toProductOrder:function(e){
        wx.setStorageSync("proId",e.currentTarget.dataset.proid);
        wx.setStorageSync("proName",e.currentTarget.dataset.proname);
        wx.setStorageSync("tourDate",'');
        wx.setStorageSync("adultSalePrice",'');
        wx.setStorageSync("childSalePrice",'');
        wx.setStorageSync("adultPolicyId",'');
        wx.setStorageSync("childPolicyId",'');
        wx.navigateTo({ 
             url:"../product-order/product-order"
        })
    },
    // 去产品修改页
    toModifyProduct:function(e){
        wx.setStorageSync("proId",e.currentTarget.dataset.proid);
        wx.setStorageSync("fileName",''),
        wx.setStorageSync("filePath",''),
        wx.setStorageSync("attachmentType",''),
        wx.setStorageSync("posterID",''),
        wx.setStorageSync("picPosterImage",''),
        wx.setStorageSync("attachmentID",''),
        wx.setStorageSync("picImage",''),
        wx.setStorageSync("productName",''),
        wx.setStorageSync("posterType",''),
        wx.navigateTo({ 
             url:"../modify-product/modify-product"
        })
    },
    // 去产品开班页面
    toOpenClass:function(e){
        wx.setStorageSync("proId",e.currentTarget.dataset.proid);
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
    // 去上产品页面
    toUpdateProduct:function(){
        wx.setStorageSync("fileName",''),
        wx.setStorageSync("filePath",''),
        wx.setStorageSync("attachmentType",''),
        wx.setStorageSync("posterID",''),
        wx.setStorageSync("picPosterImage",''),
        wx.setStorageSync("attachmentID",''),
        wx.setStorageSync("picImage",''),
        wx.setStorageSync("productName",''),
        wx.setStorageSync("posterType",''),
        wx.navigateTo({ 
            url:"../update-product/update-product"
       })
    },
    // 去团次管理页
    toMassManagement:function(e){
        wx.setStorageSync("proId",e.currentTarget.dataset.proid);
        wx.setStorageSync("isHome",1);
        wx.setStorageSync("isDetail",0);
        wx.navigateTo({ 
             url:"../mass-management/mass-management"
        })
    },
    // 下拉刷新  
    onPullDownRefresh: function () {  
        // 显示顶部刷新图标  
        wx.showNavigationBarLoading();  
        var that = this;  
        that.setData({
            productList: [],
            noData:'',
            pageNo:1
        });
        that.homeInit(1);
        console.log(this.data.noData,'ggggggggg');
        //  隐藏导航栏加载框  
        wx.hideNavigationBarLoading();  
        // 停止下拉动作  
        wx.stopPullDownRefresh();  
    },  
    //页面上拉触底事件的处理函数 
    onReachBottom: function () {  
        var that = this;  
        // 显示加载图标  
        wx.showLoading({  
        title: '玩命加载中',  
        })  
        // 页数+1  
        that.setData({
            pageNo:that.data.pageNo+1 
        })
        if(that.data.pageNo>=that.data.totalNum/that.data.pageSize){
            that.data.noData = "没有更多数据啦";
            that.setData({
                noData: that.data.noData 
            })
        }
        else{
            that.homeInit(that.data.pageNo);
        }
        // 隐藏加载框  
        wx.hideLoading();  
    }, 
    homeInit:function(page){
        // 获取产品列表
        let params={
            "orgID":wx.getStorageSync("orgId"),
            // "orgID":"C94C21D6-4C6D-4A80-BD19-5341E7014D47",
            "pageIndex": page,
            "pageSize": this.data.pageSize,
            // "userID":"110A6516-154D-46E6-8C10-62AC5B1D7D04"
            "userID": wx.getStorageSync("userId")
        }
        util.httpRequest(server.productPagingListByOrgId,params,'post').then(res=>{
            console.log('产品列表',res);
            if(res.ResultCode==1){
                console.log('获取产品列表成功');
                if(res.Result.list.length!=0){
                    for(var i=0;i<res.Result.list.length;i++){
                        this.data.productList.push(res.Result.list[i]);
                    }
                    this.setData({
                        productList: this.data.productList,
                        totalNum:res.Result.totalNum,
                        isList:true
                    });
                }
                else{
                    this.setData({
                        isList:false
                    });
                }
            }
            else{
                console.log('获取产品列表失败');
            }
        })
    },
    onLoad: function () {
       this.homeInit(1)
    },
    // onShow:function(e){
    //     this.onLoad();
    // },
})