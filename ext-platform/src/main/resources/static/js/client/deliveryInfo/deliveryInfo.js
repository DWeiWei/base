jQuery(document).ready(function ($) {
    var url = "";
    if (type == 2) {
        url = '/api/userPlant/getUserPlant';
    } else if (type == 3) {
        url = '/api/userFruitTrees/getFruitTrees';
    } else if (type == 4) {
        url = '/api/userLivestock/getLivestock';
    }
    $.ajax({
        type: "GET",
        url: url,
        data: {isDelivery: '1', id: id},
        success: function (e) {
            if (e.success) {
                var id = e.data[0].id, //资源id
                    name = e.data[0].name,//蔬菜名称
                    unit = e.data[0].unit? '/'+e.data[0].unit:'',
                    imageUrl = e.data[0].imageUrl,
                    orderInfo = e.data[0].orderInfo,//订单
                    delivery = e.data[0].delivery;//配送信息
                var orderId = orderInfo.orderId,//订单ID
                    orderNo = orderInfo.orderNo,//订单编号
                    tradeNo = orderInfo.tradeNo,
                    unitPrice = orderInfo.unitPrice,//单价
                    dealDate = orderInfo.dealDate,//交易时间
                    amount = orderInfo.amount ? 'x' + orderInfo.amount : '',//数量
                    acount = orderInfo.acount;//总价
                var receiver = delivery.receiver,//收货人
                    linkTel = delivery.linkTel,//联系电话
                    address = delivery.address,//配送地址
                    deliveryInfo = delivery.deliveryInfo;//配送描述
                if (type == '3') {
                    unit += '/年';
                }
                $("#delivery_info").append('<div class="buy_box">' +
                    '<div class="info"> ' +
                    '<div class="left"> ' +
                    '<img src="' + imageUrl + '" alt=""/>' +
                    '</div>' +
                    '<div class="right"> ' +
                    '<div class="pro_top"> ' +
                    '<h2 >' + name + '</h2>' +
                    '<p></p>' +
                    '</div>' +
                    '<div class="price">￥<span >' + unitPrice +'元'+ unit+'</span></div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '<div class="address">' +
                    '<div class="left">' +
                    '<img src="/images/ps_dw.png" alt=""/>' +
                    '</div>' +
                    '<div class="right">' +
                    '<div class="title">' +
                    '<div class="name">收货人：' + receiver + '</div>' +
                    '<div class="tel">电话：' + linkTel + '</div>' +
                    '</div>' +
                    '<div class="info">收货地址：' + address + '</div>' +
                    '</div>' +
                    '</div>' +
                    '<div class="describe">配送描述：' + deliveryInfo + '</div>');
                $("#delivery_order").append('<div class="total" >' + amount + '</div>' +
                    '<div class="total" >总计：￥' + acount + '</div>' +
                    '<div class="order_info">' +
                    '<ul>' +
                    '<li id="orderNo">订单编号：' + orderNo + '</li>' +
                    '<li id="tradeNo">交易单号：' + tradeNo + '</li>' +
                    '<li id="dealDate">成交时间：' + dealDate + '</li>' +
                    '</ul>' +
                    '</div>');
            }
        },
        error: function (e) {

        }
    });


});
