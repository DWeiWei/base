jQuery(document).ready(function ($) {
    $.ajax({
        type:"GET",
        url:"/api/userLand/getUserLand",
        data:{id:landId},
        success:function(e){
            if(e.success) {
                var userLand = e.data[0];
                $('#landOrder_title').html(userLand.isPlant == '1'?'已种植':'待种植');//
                $('#landOrder_name').html(userLand.name);//地块名称
                $("#landOrder_img").attr("src",userLand.imageUrl);
                $('#landOrder_greenhousesName').html(userLand.greenhousesName);//大棚名称
                $('#landOrder_unitPrice').html(userLand.orderInfo.unitPrice);//
                $('#landOrder_amount').html('x'+userLand.orderInfo.amount);//
                $('#landOrder_acount').html(' 总计：￥'+ userLand.orderInfo.acount);//
                var orderNo = userLand.orderInfo.orderNo,
                    tradeNo = userLand.orderInfo.tradeNo,
                    payType = userLand.orderInfo.payType == '1'? '微信':'支付宝',
                    dealDate = userLand.orderInfo.dealDate;
                $('#landOrder_info').append('<ul>' +
                    '<li>订单编号：'+orderNo+'</li>' +
                    '<li>交易单号：'+tradeNo+'</li>' +
                    '<li>成交时间：'+dealDate+'</li>' +
                    '<li>支付方式：'+payType+'</li>' +
                    '</ul>');
                $('#land_info').html(userLand.info);
                if(userLand.isPlant == '0'){
                    $('.order_bottom').html('<a href="plantVegetable.html?farmId='+farmId+'&id='+userLand.id+'">去种植</a>');
                }else{
                    $('.order_bottom').html('<a href="plantOrderInfo.html?farmId='+farmId+'&id='+userLand.plantId+'">种植详情</a>');
                }

            }
        },
        error:function (e) {

        }
    });

});