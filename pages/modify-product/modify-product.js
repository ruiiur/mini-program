var util = require('../../utils/util.js');
var server = require('../../utils/server.js');
Page({
    data: {
        headTop:0,
        destinationType:0,
        picImage:'',//产品封面
        fileName:'',//文件名称
        filePath:'',//文件路径
        posterType:'',//上传海报方式
        posterId:'',//海报id
        picPosterImage:'',//海报url
        attachmentType:'',//附件类型
        attachmentID:'',//关联的附件id
        productName:'',//产品名称
        destinationList:[],//目的地列表
        proId:'',//产品id
        show:false,//海报上传方式选择
    },
    // 保存产品名
    keepValue:function(e){
        this.setData({
            productName:e.detail.value 
        })
        wx.setStorageSync("productName",this.data.productName);
    },
    //点击切换
     clickTab: function(e) {
        var that = this;
        if (this.data.destinationType === e.target.dataset.current) {
          return false;
        } else {
            that.setData({
                destinationType: e.target.dataset.current
            })
        }
    },
    // 上传海报的弹窗
    popupWindow:function(){
        this.setData({ show:true })
    },
    onCancel:function() {
        this.setData({ show: false });
    },
    onClose:function(){
        this.setData({ show: false });
    },
    // 去选择文件页面
    toSelectFile:function(){
        wx.navigateTo({
            url:'../select-file/select-file'
        })
    },
    // 海报秀图库选择
    updatePosterOne:function(){
        this.setData({ posterType:2 })
        wx.navigateTo({
            url:'../select-posters/select-posters'
        })
        wx.setStorageSync("posterType",this.data.posterType);
    },
    // 海报秀产品选择
    updatePosterTwo:function(){
        this.setData({ posterType:3 })
        wx.navigateTo({
            url:'../posters-pro/posters-pro'
        })
        wx.setStorageSync("posterType",this.data.posterType);
    },
    // 删除文件
    cancelFile:function(){
        this.setData({
            fileName:'',
            filePath:'',
            attachmentType:'',
            attachmentID:'',
        })
        wx.setStorageSync("fileName",'');
        wx.setStorageSync("filePath",'');
        wx.setStorageSync("attachmentType",'');
        wx.setStorageSync("attachmentID",'');
    },
    // 上传封面
    updateCover: function () {  
        var that = this;  
        wx.chooseImage({  
            count: 1,  //最多可以选择的图片总数  
            sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有  
            sourceType: ['album','camera'], // 可以指定来源是相册还是相机，默认二者都有  
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
                        console.log(data,'这是封面文件');
                        that.setData({
                            picImage:data.Result.split('|')[1]
                        })
                        wx.setStorageSync("picImage",that.data.picImage);
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
    // 上传海报
    updatePoster: function () {  
        var that = this;  
        wx.chooseImage({  
            count: 1,  //最多可以选择的图片总数  
            sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有  
            sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有  
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
                        console.log(data,'这是海报文件');
                        that.setData({
                            picPosterImage:data.Result.split('|')[1],
                            posterType:1,
                            posterId:"00000000-0000-0000-0000-000000000000"
                        })
                        wx.setStorageSync("posterType",that.data.posterType);
                        wx.setStorageSync("picPosterImage",that.data.picPosterImage);
                        wx.setStorageSync("posterID",that.data.posterId);
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
    // 修改产品
    changeProduct:function(){
        if(this.data.productName==''){
            wx.showToast({
                title: '产品名称不能为空',
                icon: "none",
            })
            return;
        }
        if(this.data.picImage==''){
            wx.showToast({
                title: '请上传产品封面',
                icon: "none",
            })
            return;
        }
        if(this.data.picPosterImage==''){
            wx.showToast({
                title: '请上传海报',
                icon: "none",
            })
            return;
        }
        if(this.data.filePath=='' || this.data.fileName==''){
            wx.showToast({
                title: '请上传产品附件',
                icon: "none",
            })
            return;
        }
        let params={
            'ProductName':this.data.productName,
            "ProductID":this.data.proId,
            "PicImage": this.data.picImage,
            "FileName": this.data.fileName,
            "FilePath": this.data.filePath,
            "UserID":  wx.getStorageSync("userId"),
            // "UserID": "110A6516-154D-46E6-8C10-62AC5B1D7D04",
            "Destination": "国内",
            "DestinationID": "4faefaef-e178-4926-9f23-37366605f54c",
            "PosterType":this.data.posterType,
            "PosterID":this.data.posterId,
            "PicPosterImage":this.data.picPosterImage,
            "AttachmentType":this.data.attachmentType,
            "AttachmentID":this.data.attachmentID,
        }
        util.httpRequest(server.addOrUpdateProduct,params,'post').then(res=>{
            console.log('修改产品',res);
            if(res.ResultCode==1){
                console.log('修改产品成功');
                wx.showToast({
                    title: '修改成功',
                    icon: 'none',
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
                console.log('修改产品失败');
                wx.showToast({
                    title: '修改失败',
                    icon: 'none',
                    duration: 1000,
                    mask:true
                })
            }
        })
    },
    // 图片预览大图
    imgBig:function(e){
        var src = e.currentTarget.dataset.src;//获取data-src
        //图片预览
        wx.previewImage({
            current: src, // 当前显示图片的http链接
            urls: [src] // 需要预览的图片http链接列表
        })
    },
    onShow: function (options) {
       // 页面初始化 options为页面跳转所带来的参数
        this.setData({
            proId: wx.getStorageSync("proId"),
            headTop:getApp().globalData.navHeight,
            show:false,
        });
        // 获取地区信息 
        let params={
            'pid':'00000000-0000-0000-0000-000000000000'
        }
        util.httpRequest(server.findChild,params,'get').then(res=>{
            console.log('地区信息',res);
            if(res.length!=0){
                this.setData({
                    destinationList: res,
                });
            }
            console.log(this.data.destinationList);
        })

         // 获取产品详情
         let paramsDetails={
            "ID":this.data.proId,
        }
        util.httpRequest(server.getProductDetails,paramsDetails,'get').then(res=>{
            console.log('产品详情',res);
            if(res.ResultCode==1){
                console.log('获取产品详情成功');
                this.setData({
                    picImage:wx.getStorageSync("picImage")||res.Result.PicImage,//封面路径
                    picPosterImage:wx.getStorageSync("picPosterImage")||res.Result.PicPosterImage,//海报路径
                    posterId:wx.getStorageSync("posterID")||res.Result.PosterID,//海报id
                    filePath:wx.getStorageSync("filePath")||res.Result.filePath,//文件路径
                    fileName:wx.getStorageSync("fileName")||res.Result.fileName,//文件名称
                    productName:wx.getStorageSync("productName")||res.Result.productName,//产品名称
                    attachmentType:wx.getStorageSync("attachmentType")||res.Result.AttachmentType,
                    posterType:wx.getStorageSync("posterType")||res.Result.PosterType,
                    attachmentID:wx.getStorageSync("attachmentID")||res.Result.AttachmentID,
                });
            }
            else{
                console.log('获取产品详情失败');
            }
        })
    }
})