jQuery(document).ready(function ($) {
    $.ajax({
        type: "GET",
        url: "/api/farmResourceBind/selectFarmResourceBind/" + fruitTreesId,
        success: function (e) {
            var fruitTreess = e.data;
            var fruitTreesInfo = fruitTreess.fruitTreesInfo,
                priceConf = fruitTreess.priceConf;
            $('.buy_box').append(
                '<div class="info" id="' + fruitTreesInfo.id + '">' +
                '<div class="left" id="' + fruitTreess.farmId + '">' +
                '<img src="' + fruitTreesInfo.imageAbsUrl + '" alt=""/>' +
                '</div>' +
                '<div class="right">' +
                '<div class="pro_top">' +
                '<h2 class="name">' + fruitTreesInfo.name + '</h2>' +
                '<p><span id="remark">'+priceConf.remark+'</span></p>' +
                '</div>' +
                '<div class="price">￥<span id="recognize_price">' + priceConf.price + '</span>/<span id="unit">'+ priceConf.priceUnit +'</span>/年</div>' +
                '</div>' +
                '</div>' +
                '<div class="add_num">' +
                '<input class="min btn" name="" type="button" />' +
                '<p class="text_box">' + 1 + '</p>' +
                '<input class="add btn" name="" type="button" />' + priceConf.priceUnit +
                '</div>'
            );
        }
    });

    //确认种植
    $('.dark').on('click', function () {
        var params = {};
        params.acount = $(".total span b").text();
        params.unitPrice = $("#recognize_price").text();
        params.amount = $(".text_box").text();
        params.name = $(".name").text();
        params.unit = $("#unit").text();
        params.remark = $("#remark").text();
        params.farmId = farmId;
        params.resourceType = "3";
        params.orderNo = createOrderNO();
        params.resourceId = fruitTreesId;
        params.resourceName = $(".name").text();
        var payParams = {
            payId: 4,
            openid: openId,
            price: params.acount,
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
                                    $.toast("认种成功", 3000);
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
            var num = $(this).parent().find('.text_box');
            num.text(parseInt(num.text()) + 1);
            setTotal();
        });

        $(".min").off('click').on('click', function(){
                var num = $(this).parent().find('.text_box');
            var n = $('.text_box').text()
            if(n!=1) {
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
});