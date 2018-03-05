jQuery(document).ready(function ($) {
    $.ajax({
        type: "GET",
        data: {id: plantId,},
        url: "/api/userPlant/getUserPlant",
        success: function (e) {
            var plantId = e.data[0].id,
                name = e.data[0].name,//蔬菜名称
                plantName = e.data[0].plantName,
                remark = e.data[0].remark,
                imageUrl = e.data[0].imageUrl,
                isDelivery = e.data[0].isDelivery,
                orderInfo = e.data[0].orderInfo,//订单
                info = e.data[0].info;//详情
            var payType = orderInfo.payType == '1' ? '微信' : '支付宝',//支付类型1：微信 2：支付宝
                orderId = orderInfo.orderId,//订单ID
                orderNo = orderInfo.orderNo,//订单编号
                tradeNo = orderInfo.tradeNo,
                unitPrice = orderInfo.unitPrice,//单价
                dealDate = orderInfo.dealDate,//交易时间
                amount = orderInfo.amount,//数量
                acount = orderInfo.acount;//总价
            $(".order_main").append(
                '<div class="buy_box">' +
                '<div class="info">' +
                '<div class="left">' +
                '<img src="' + imageUrl + '" alt=""/>' +
                '</div>' +
                '<div class="right">' +
                '<div class="pro_top">' +
                '<h2 >' + name + '</h2>' +
                '<p><span>' + plantName + '</span></p>' +
                '<p>'+ remark + '</p>' +
                '</div>' +
                '<div class="price">￥<span >' + unitPrice + '元</span></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="total" >总计：￥' + acount + '</div>' +
                '<div class="detail info" style="margin-bottom: 1rem;">' +
                '<h2>详情</h2>' +
                '<div class="show">' +
                '<div class="right">' +
                '<p><span>'+info+'</span></p>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="order_info">' +
                '<ul>' +
                '<li id="orderNo">' + "订单编号：" + orderNo + '</li>' +
                '<li id="tradeNo">' + "交易单号：" + tradeNo + '</li>' +
                '<li id="dealDate">' + "成交时间：" + dealDate + '</li>' +
                '<li id="payType">' + "支付方式：" + payType + '</li>' +
                '</ul>' +
                '</div>'
            );
            $('#plant_info').html(info);
            if (isDelivery == '0') {
                $('.order_bottom').html('<a href="deliverySetting.html?farmId=' + farmId + '&id=' + orderId + '_2' + '">去配送</a>');
            } else {
                $('.order_bottom').html('<a href="deliveryInfo.html?farmId=' + farmId + '&id=' + plantId + '_2' + '">已配送</a>');
            }
        },
        error: function (e) {

        }
    });
});