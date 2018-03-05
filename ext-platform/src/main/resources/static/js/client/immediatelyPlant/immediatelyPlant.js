jQuery(document).ready(function ($) {

    $.ajax({
        type: "GET",
        url: "/api/farmResourceBind/selectFarmResourceBind/" + vegetableId,
        success: function (e) {
            var vegetable = e.data;
            var vegetableInfo = vegetable.vegetableInfo,
                priceConf = vegetable.priceConf;
            $('.buy_box').append(
                '<div class="buy_box">' +
                '<div class="info vegetable">' +
                '<div class="left">' +
                '<img src="' + vegetableInfo.imageAbsUrl + '" alt=""/>' +
                '</div>' +
                '<div class="right">' +
                '<div class="pro_top">' +
                '<h2 class="name">' + vegetableInfo.name + '</h2>' +
                '<p><span id="remark">' + priceConf.remark + '</span></p>' + '</div>' +
                '<div class="price">￥<span id="plant_price">' + priceConf.price + '</span>元</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>'
            );
            $('.total').append(
                '合计：<span>￥<b id="price">' + parseFloat(priceConf.price).toFixed(2) + '</b></span>'
            )
        }
    });
    $(".dark").on("click", function () {
        var params = {};
        params.acount = $("#price").text();
        params.unitPrice = $("#plant_price").text();
        params.amount = "1";
        params.name = $(".name").text();
        params.remark = $("#remark").text();
        params.farmId = farmId;
        params.resourceType = "2";
        params.resourceId = vegetableId;
        params.orderNo = createOrderNO();
        params.landId = landId;
        params.resourceName = $(".name").text();
        var payParams = {
            payId: 4,
            openid: openId,
            price:params.acount,
            title:params.name,
            outTradeNo:params.orderNo
        };

       util.callPay('/pay/jsapi', payParams, function onBridgeReady(data) {
            data.timeStamp = data.timeStamp + '';
            WeixinJSBridge.invoke('getBrandWCPayRequest', data,
                function (res) {
                    if (res.err_msg == "get_brand_wcpay_request:ok") {
                        Request.post('api/order/', params,
                            function (e) {
                                if (e.success) {
                                    setInterval(function () {
                                        window.location.href = "index.html?farmId="+farmId;
                                    }, 3000);
                                    $.toast("种植成功", 3000);
                                } else {
                                    $.alert("请重试");
                                }
                            });
                    } else {

                    }
                }
            );
        });


    });

    //订单编号
    var createOrderNO = function () {
        var date = new Date().Format("yyyyMMddhhmmss");
        var Num="";
        for(var i=0;i<6;i++)
        {
            Num+=Math.floor(Math.random()*10);
        }
        return date+Num;
    }
    //后退
    /* $("#back").on("click", function () {
         window.location.href = "vegetableInfo.html?id=" + landId + '_' + vegetableId;
     })*/

});