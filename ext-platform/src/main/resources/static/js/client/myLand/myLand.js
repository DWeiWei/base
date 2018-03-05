jQuery(document).ready(function ($) {
    $.ajax({
        type: "GET",
        url: "/api/userLand/getUserLand",
        data: {},
        success: function (data) {
            if (data.success) {
                var userLands = data.data;
                $('.order_list').empty();
                if (userLands != null && userLands.length > 0) {
                    for (var i = 0; i < userLands.length; i++) {
                        var id = userLands[i].id,
                            orderNo = userLands[i].orderNo,//订单编号
                            isPlant = userLands[i].isPlant == '1' ? '已种植' : '待种植',//是否种植
                            imageUrl = userLands[i].imageUrl,//图片Url
                            greenhousesName = userLands[i].greenhousesName,//大棚名称
                            landName = userLands[i].name;//地块名称
                            plantId = userLands[i].plantId,
                            orderInfo = userLands[i].orderInfo,//订单信息
                            plantInfo = userLands[i].isPlant == '1' ? '种植详情' : '去种植';//是否种植
                        jumpPage = userLands[i].isPlant == '1' ? 'plantOrderInfo.html?farmId=' + farmId + '&id=' + plantId : 'plantVegetable.html?farmId='+farmId+'&id=' + id;//是否种植
                        $('.order_list').append(
                            '<ul>' +
                            '<li>' +
                            '<a href="landOrderInfo.html?farmId=' + farmId + '&id=' + id + '">' +
                            '<div class="title">' + "订单编号：" + orderNo +
                            '<span>' + isPlant + '</span>' +
                            '</div>' +
                            '<div class="buy_box">' +
                            '<div class="info">' +
                            '<div class="left">' +
                            '<img src="' + imageUrl + '" alt=""/>' +
                            '</div>' +
                            '<div class="right">' +
                            '<div class="' + "pro_top" + '">' +
                            '<h2>' + greenhousesName + "&nbsp;&nbsp;" + landName + '</h2>' +
                            '</div>' +
                            '<div class="price">￥' +
                            '<span>' + orderInfo.unitPrice + '</span>元/年' +
                            '<div class="num">x' + orderInfo.amount + '</div>' +
                            '</div>' +
                            '</div>' +
                            '</div>' +
                            '</div>' +
                            '</a>' +
                            '<div class="list_bottom">' +
                            "总计：￥" + orderInfo.acount +
                            '<a href="' + jumpPage + '">' + plantInfo + '</a>' +
                            '</div>' +
                            '</li>' +
                            '</ul>'
                        );

                    }
                } else {
                    $('.order_list').append('<div class="no-data">暂未认领地块！</div>');
                }
            }
        },
        error: function (e) {

        }
    });

    $("#myLand_dark").on("click", function () {
        window.location.href = "selectLand.html?farmId=" + farmId;
    });
});


