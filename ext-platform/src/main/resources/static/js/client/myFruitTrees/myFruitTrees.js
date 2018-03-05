jQuery(document).ready(function ($) {
    $.ajax({
        type: "GET",
        url: "/api/userFruitTrees/getFruitTrees",
        success: function (e) {
            if (e.success) {
                if (e.data != null && e.data.length > 0) {
                    var myFruitTreess = e.data;
                    $(".order_list").empty();
                    $(".order_list").append('<ul>');
                    for (var i = 0; i < myFruitTreess.length; i++) {
                        var id = myFruitTreess[i].id,
                            orderId = myFruitTreess[i].orderId,
                            orderNo = myFruitTreess[i].orderNo,//订单编号
                            imageUrl = myFruitTreess[i].imageUrl,//图片Url
                            unit = myFruitTreess[i].unit,
                            name = myFruitTreess[i].name,//果树名称
                            orderInfo = myFruitTreess[i].orderInfo;//订单信息
                        var ahtml = myFruitTreess[i].isDelivery == '1' ? '<a href="javascript:void(0);">已配送</a>' : '<a href="javascript:void(0);" data-id="' + orderId + '" class="delivery" >配送设置</a>';//配送设置
                        $(".order_list").append(
                            '<ul>' +
                            '<li>' +
                            '<a href="fruitTreesOrderInfo.html?farmId=' + farmId + '&id=' + id + '">' +
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
                            '<p></p>' +
                            '</div>' +
                            '<div class="price ">￥<span>' + orderInfo.unitPrice + '元/'+ unit +'年</span><div class="num">x' + orderInfo.amount + '</div></div>' +
                            '</div>' +
                            '</div>' +
                            '</div>' +
                            '</a>' +
                            '<div class="list_bottom">总计：￥' + orderInfo.acount + ahtml +
                            '</a>' +
                            '</div>' +
                            '</li>' +
                            '</ul>'
                        );
                    }
                } else {
                    $(".order_list").append('<div class="no-data">暂未认种果树！</div>');
                }
            }
        },
        error: function (e) {

        }
    })

    $(".order_list").on("click", ".delivery", function () {
        var _this = $(this);
        var orderId = _this.data('id');
        window.location.href = "deliverySetting.html?farmId=" + farmId + "&id=" + orderId + '_3';

    })

    $("#myFruit_trees_dark").on("click", function () {
        window.location.href = "adoptFruitTrees.html?farmId=" + farmId;
    });

});