jQuery(document).ready(function ($) {
    $.ajax({
        type: "GET",
        url: "/api/userPlant/getUserPlant",
        success: function (e) {
            if (e.success) {
                var userPlants = e.data;
                $(".order_list").empty();
                if (userPlants != null && userPlants.length > 0) {
                    for (var i = 0; i < userPlants.length; i++) {
                        var id = userPlants[i].id,
                            orderId = userPlants[i].orderId,
                            orderNo = userPlants[i].orderNo,//订单编号
                            imageUrl = userPlants[i].imageUrl,//图片Url
                            plantName = userPlants[i].name,//地块名称
                            orderInfo = userPlants[i].orderInfo;//订单信息
                        var ahtml = userPlants[i].isDelivery == '1' ? '<a href="javascript:void(0);">已配送</a>' : '<a href="javascript:void(0);" data-id="' + orderId + '" class="delivery" >配送设置</a>';//配送设置
                        $(".order_list").append(
                            '<ul>' +
                            '<li>' +
                            '<a href="plantOrderInfo.html?farmId=' + farmId + '&id=' + id + '">' +
                            '<div class="title">订单编号:' + orderNo +
                            '</div>' +
                            '<div class="buy_box">' +
                            '<div class="info">' +
                            '<div class="left">' +
                            '<img src="' + imageUrl + '" alt="">' +
                            '</div>' +
                            '<div class="right">' +
                            '<div class="pro_top">' +
                            '<h2>' + plantName + '</h2>' +
                            '<p></p>' +
                            '</div>' +
                            '<div class="price ">￥' +
                            '<span>' + orderInfo.unitPrice + '元</span>' +
                            '</div>' +
                            '</div>' +
                            '</div>' +
                            '</div>' +
                            '</a>' +
                            '<div class="list_bottom">总计：￥' + orderInfo.acount + ahtml +
                            '</div>' +
                            '</li></ul>'
                        );
                    }
                } else {
                    $('.order_list').append('<div class="no-data">暂未种植蔬菜！</div>');
                }
            }
        },
        error: function (e) {

        }
    });

    $(".order_list").on("click", ".delivery", function () {
        var _this = $(this)
        var orderId = _this.data('id');
        window.location.href = "deliverySetting.html?farmId=" + farmId + "&id=" + orderId + '_2'
    });
});