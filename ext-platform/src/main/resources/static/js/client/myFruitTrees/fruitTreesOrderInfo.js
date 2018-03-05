jQuery(document).ready(function ($) {
    $.ajax({
        type:"GET",
        url:"/api/userFruitTrees/getFruitTrees",
        data:{id:fruitTreesId},
        success:function(e){
            if(e.success) {
                var userFruitTrees = e.data[0];
                $('#fruitTreesOrder_name').html(userFruitTrees.name);//地块名称
                $("#fruitTreesOrder_img").attr("src",userFruitTrees.imageUrl);
                $('#fruitTreesOrder_unitPrice').html(userFruitTrees.orderInfo.unitPrice+'元/'+userFruitTrees.unit+'/年');//
                $('#fruitTreesOrder_amount').html('x'+userFruitTrees.orderInfo.amount);//
                $('#fruitTreesOrder_acount').html(' 总计：￥'+ userFruitTrees.orderInfo.acount);//
                $('#fruitTreesOrder_remark').html(userFruitTrees.remark);//
                var userFruitTreeId = userFruitTrees.id,
                    info = userFruitTrees.info,
                    orderId = userFruitTrees.orderInfo.orderId,
                    orderNo = userFruitTrees.orderInfo.orderNo,
                    tradeNo = userFruitTrees.orderInfo.tradeNo,
                    payType = userFruitTrees.orderInfo.payType == '1'? '微信':'支付宝',
                    dealDate = userFruitTrees.orderInfo.dealDate;
                $('#fruitTrees_info').html(userFruitTrees.info);
                $('#fruitTreesOrder_info').append('<ul>' +
                    '<li>订单编号：'+orderNo+'</li>' +
                    '<li>交易单号：'+tradeNo+'</li>' +
                    '<li>成交时间：'+dealDate+'</li>' +
                    '<li>支付方式：'+payType+'</li>' +
                    '</ul>');
                if(userFruitTrees.isDelivery == '0'){
                    $('.order_bottom').html('<a href="deliverySetting.html?farmId='+farmId+'&id='+orderId+'_3'+'">去配送</a>');
                }else{
                    $('.order_bottom').html('<a href="deliveryInfo.html?farmId='+farmId+'&id='+userFruitTreeId+'_3'+'">已配送</a>');
                }
            }
        },
        error:function (e) {

        }
    });
    $(".order_list").on("click", ".delivery", function () {
        var _this = $(this);
        var orderId = _this.data('id');
        window.location.href = "deliverySetting.html?farmId="+farmId+"&id=" + orderId+'_3';
    })
});