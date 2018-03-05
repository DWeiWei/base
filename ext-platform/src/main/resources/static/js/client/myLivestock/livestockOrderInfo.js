jQuery(document).ready(function ($) {
    $.ajax({
        type:"GET",
        url:"/api/userLivestock/getLivestock",
        data:{id:livestockId},
        success:function(e){
            if(e.success) {
                var userLivestocks = e.data[0];
                $('#livestockOrder_name').html(userLivestocks.name);//禽畜名称
                $("#livestockOrder_img").attr("src",userLivestocks.imageUrl);
                $('#livestockOrder_unitPrice').html(userLivestocks.orderInfo.unitPrice + '元/' + userLivestocks.unit);//
                $('#livestockOrder_amount').html('x'+userLivestocks.orderInfo.amount);//
                $('#livestockOrder_acount').html(' 总计：￥'+ userLivestocks.orderInfo.acount);//
                $('#livestockOrder_remark').html(userLivestocks.remark);//
                var livestockId = userLivestocks.id,
                    info = userLivestocks.info,
                    orderId = userLivestocks.orderInfo.orderId,
                    orderNo = userLivestocks.orderInfo.orderNo,
                    tradeNo = userLivestocks.orderInfo.tradeNo,
                    payType = userLivestocks.orderInfo.payType == '1'? '微信':'支付宝',
                    dealDate = userLivestocks.orderInfo.dealDate;

                $('#livestock_info').html(info);

                $('#livestockOrder_info').append('<ul>' +

                    '<li>订单编号：'+orderNo+'</li>' +
                    '<li>交易单号：'+tradeNo+'</li>' +
                    '<li>成交时间：'+dealDate+'</li>' +
                    '<li>支付方式：'+payType+'</li>' +
                    '</ul>');
                if(userLivestocks.isDelivery == '0'){
                    $('.order_bottom').html('<a href="deliverySetting.html?farmId='+farmId+'&id='+orderId+'_4'+'">去配送</a>');
                }else{
                    $('.order_bottom').html('<a href="deliveryInfo.html?id='+livestockId+'_4'+'">已配送</a>');
                }
            }
        },
        error:function (e) {

        }
    });
});