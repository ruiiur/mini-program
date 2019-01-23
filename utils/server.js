/* 接口api */
var wdomain = "https://api.xiaoboli.com";
    // mdomain = "https://m.wzhouhui.com";

module.exports = {
    // 登录模块 login
    userLogin: wdomain + '/api/SimpleErp/UserLogin',
    // 获取产品列表
    productPagingListByOrgId: wdomain + '/api/SimpleErp/GetProductPagingListByOrgId',
    // 图片及文件上传
    uploadImage: wdomain + '/api/SimpleErp/UploadImageAndFileByProduct',
    // 获取产品详情
    getProductDetails: wdomain + '/api/SimpleErp/GetProductDetailByID',
    // 添加或修改产品
    addOrUpdateProduct: wdomain + '/api/SimpleErp/AddOrUpdateProduct',
    // 获取订单列表
    getOrderPagingList: wdomain + '/api/SimpleErp/GetOrderPagingListByOrgId',
    // 获取订单详情
    getOrderDetails: wdomain + '/api/SimpleErp/GetOrderDetailByID',
    // 提交变更申请
    addOrderChange: wdomain + '/api/SimpleErp/AddOrderChange',
    // 根据订单查看变更单申请
    getOrderChangeByOrderID: wdomain + '/api/SimpleErp/GetOrderChangeByOrderID',
    // 审核变更信息
    auditOrderChange: wdomain + '/api/SimpleErp/AuditOrderChange',
    // 获取地区信息
    findChild: wdomain + '/api/destination/FindChild',
    // 订单签收列表
    orderSignPagingList: wdomain + '/api/SimpleErp/OrderSignPagingList',
    // 订单签收/拒收
    orderSign: wdomain + '/api/SimpleErp/OrderSign',
    // 订单发单
    insideOrderSend: wdomain + '/api/SimpleErp/InsideOrderSend',
    // 获取外发供应商
    getExternalSupplierList: wdomain + '/api/SimpleErp/GetExternalSupplierList',
    // 订单修改
    upateOrderInfo: wdomain + '/api/SimpleErp/UpateOrderInfo',
    // 订单取消
    orderCancel: wdomain + '/api/SimpleErp/OrderCancel',
    // 产品开班
    addTour: wdomain + '/api/SimpleErp/addTour',
    //产品所有团期查询
    selectTourAll: wdomain + '/api/SimpleErp/SelectTourAll',
    // 单个团期查询
    selectTourByDate: wdomain + '/api/SimpleErp/SelectTourByDate',
    // 修改单个团期价格策略
    updateTourById: wdomain + '/api/SimpleErp/UpdateTourById',
    // 产品下单
    saveOrderInfo: wdomain + '/api/SimpleErp/SaveOrderInfo',
    // 查看产品附件
    queryAttachmentProductPagingList: wdomain + '/api/SimpleErp/QueryAttachmentProductPagingList',
    // 获取海报秀图库
    getPicGalleryPagingListByOrgId: wdomain + '/api/SimpleErp/GetPicGalleryPagingListByOrgId',
    // 获取海报秀产品图库
    getPicGalleryBindProductPagingListByOrgId: wdomain + '/api/SimpleErp/GetPicGalleryBindProductPagingListByOrgId',
    // 查看变更单审核的签收列表
    orderAuditSignPagingList: wdomain + '/api/SimpleErp/OrderAuditSignPagingList',
    // 邀请供应商
    invitationSupplier: wdomain + '/api/SimpleErp/InvitationSupplier',
    // 获取短信模板
    messageTemplateList: wdomain + '/api/SimpleErp/MessageTemplateList',
    // 应收应付
    getAmountByOrderId: wdomain + '/api/SimpleErp/GetAmountByOrderId',
    // 订单签收详情
    getSendOrderDetailByID: wdomain + '/api/SimpleErp/GetSendOrderDetailByID',
}