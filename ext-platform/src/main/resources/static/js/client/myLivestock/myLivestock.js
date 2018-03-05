jQuery(document).ready(function ($) {
    $.ajax({
        type: "GET",
        url: "/api/userLivestock/getLivestock",
        success: function (e) {
            if (e.success) {
                var myLivestocks = e.data;
                $(".order_list").empty();
                if (myLivestocks != null && myLivestocks.length > 0) {
                    for (var i = 0; i < myLivestocks.length; i++) {
                        var id = myLivestocks[i].id,
                            orderId = myLivestocks[i].orderId,
                            orderNo = myLivestocks[i].orderNo,//订单编号
                            imageUrl = myLivestocks[i].imageUrl,//图片Url
                            name = myLivestocks[i].name,//禽畜名称
                            remark =  myLivestocks[i].remark,
                            orderInfo = myLivestocks[i].orderInfo;//订单信息
                        var ahtml = myLivestocks[i].isDelivery == '1' ? '<a href="javascript:void(0);">已配送</a>' : '<a href="javascript:void(0);" data-id="' + orderId + '" class="delivery" >配送设置</a>';//配送设置
                        $(".order_list").append('<ul>' +
                            '<li>' +
                            '<a href="livestockOrderInfo.html?farmId=' + farmId + '&id=' + id + '">' +
                            '<div class="title">订单编号：' + orderNo +
                            '</div>' +
                            '<div class="buy_box">' +
                            '<div class="info">' +
                            '<div class="left">' +
                            '<img src="' + imageUrl + '" alt=""/>' +
                            '</div>' +
                            '<div class="right">' +
                            '<div class="pro_top">' +
                            '<h2>' + name + '</h2>' +
                            '<p><span>'+remark+'</span></p>' +
                            '</div>' +
                            '<div class="price">' + "￥" + '<span>' + orderInfo.unitPrice + '元/</span>' + myLivestocks[i].unit +
                            '<div class="num">x' + orderInfo.amount + '</div></div>' +
                            '</div>' +
                            '</div>' +
                            '</div>' +
                            '</a>' +
                            '<div class="list_bottom">总计：￥' + orderInfo.acount + ahtml +
                            '</div>' +
                            '</li></ul>');
                    }
                } else {
                    $('.order_list').append('<div class="no-data">暂未认养禽畜！</div>');
                }
            }
        },
        error: function (e) {

        }
    });
    //配送设置
    $(".order_list").on("click", ".delivery", function () {
        var _this = $(this)
        var orderId = _this.data('id');
        window.location.href = "deliverySetting.html?farmId=" + farmId + "&id=" + orderId + '_4';
    });

    $("#myLivestock_dark").on("click", function () {
        window.location.href = "adoptLivestock.html?farmId=" + farmId;
    });
});