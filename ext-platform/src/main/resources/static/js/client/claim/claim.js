jQuery(document).ready(function ($) {
    $.ajax({
        type: "GET",
        url: "/api/land/selectLandInfo/" + landId,
        success: function (e) {
            $(".buy_box").append(
                '<div class="info" >' +
                '<div class="left">' +
                '<img src="' + e.data.imageAbsUrl + '" alt=""/>' +
                '</div>' +
                '<div class="right">' +
                '<div class="pro_top">' +
                '<h2 id="name">' + e.data.name + '</h2>' +
                '<p><span id="remark">'+e.data.remark+'</span></p>' +
                '</div>' +
                '<div class="price">￥<span id="claim_price">' + e.data.priceConf.price + '</span>元/<span id="priceUnit">'+e.data.priceConf.priceUnit + '</span></div>' +
                '</div>' +
                '</div>' +
                '<div class="add_num">' +
                '<input class="min btn" name="" type="button" />' +
                '<p class="text_box">' + 1 + '</p>' +
                '<input class="add btn" name="" type="button" />' + e.data.priceConf.priceUnit +
                '</div>'
            )
        }
    });
    //订单编号
    var  createOrderNO = function () {
        var date = new Date().Format("yyyyMMddhhmmss");
        var Num="";
        for(var i=0;i<6;i++)
        {
            Num+=Math.floor(Math.random()*10);
        }
        return date+Num;
    }
    $(".dark").on("click", function () {

        var params = {};
        params.acount = $(".total span b").text();
        params.unitPrice = $("#claim_price").text();
        params.amount = $(".text_box").text();
        params.remark = $("#remark").text();
        params.name = $(".pro_top").children(0).text();
        params.farmId = farmId;
        params.unit = $("#priceUnit").text();
        params.resourceType = "1";
        params.orderNo = createOrderNO();
        params.resourceId = landId;
        params.resourceName = $("#name").text();
         var payParams = {
            payId: 4,
            openid: openId,
            price: params.acount,
            title: params.name,
            outTradeNo: params.orderNo
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
                                        window.location.href = "index.html?farmId=" + farmId;
                                    }, 3000);
                                    $.toast("认领成功", 3000);
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

    $(document).ajaxComplete(function (event) {
        // 数字输入按钮
        $(".add").off('click').on('click', function(){
            //alert();
            var num = $(this).parent().find('.text_box');
            num.text(parseInt(num.text()) + 1);
            setTotal();
        });
        $(".min").off('click').on('click', function(){
            var num = $(this).parent().find('.text_box');
            var n = $('.text_box').text()
            if(n!=1){
            num.text(parseInt(num.text()) - 1);
            if (parseInt(num.text()) < 0) {
                num.text(0);
            }
            setTotal();
            }
        });
        // 合计
        function setTotal() {
            var t = 0;
            $(".buy_box").each(function () {
                t += parseInt($(this).find('.text_box').text()) * parseFloat($(this).find('.price span').text());
            });
            $(".total span b").text(t.toFixed(2));
        }
        setTotal();
    });
});
