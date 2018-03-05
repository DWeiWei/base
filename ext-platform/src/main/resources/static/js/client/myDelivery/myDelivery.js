jQuery(document).ready(function ($) {

    var urlPlant = '/api/userPlant/getUserPlant',
        urlFruitTrees = '/api/userFruitTrees/getFruitTrees',
        urlLivestock = '/api/userLivestock/getLivestock';

    var initTabData = function (url, idStr, type) {
        $.ajax({
            type: "GET",
            url: url,
            data: {isDelivery: '1'},
            success: function (e) {
                if (e.success) {
                    var ulPlant = $('#' + idStr);
                    ulPlant.empty();
                    if (e.data != null && e.data.length > 0) {
                        var flag = true;
                        for (var i = 0; i < e.data.length; i++) {
                            var id = e.data[i].id, //资源id
                                name = e.data[i].name,//名称
                                imageUrl = e.data[i].imageUrl,
                                remark =  e.data[i].remark,
                                unit = type == '3'? ('/'+e.data[i].unit+'/年'): (type == '2'? e.data[i].unit:'/'+ e.data[i].unit),
                                orderInfo = e.data[i].orderInfo,//订单
                                delivery = e.data[i].delivery;//配送信息
                            var orderId = orderInfo.orderId,//订单ID
                                orderNo = orderInfo.orderNo,//订单编号
                                tradeNo = orderInfo.tradeNo,
                                unitPrice = orderInfo.unitPrice,//单价
                                dealDate = orderInfo.dealDate,//交易时间
                                amount = orderInfo.amount ? 'x' + orderInfo.amount : '',//数量
                                acount = orderInfo.acount;//总价
                            if (delivery != null) {

                                var receiver = delivery.receiver,//收货人
                                    linkTel = delivery.linkTel,//联系电话
                                    address = delivery.address,//配送地址
                                    deliveryInfo = delivery.deliveryInfo;//配送描述
                                ulPlant.append('<li>' +
                                    '<a href="deliveryInfo.html?farmId='+farmId+'&id=' + id + '_' + type + '"   >' +
                                    '<div class="title">' + "订单编号：" + orderNo + ' </div>' +
                                    '<div class="buy_box">' +
                                    '<div class="info">' +
                                    '<div class="left">' +
                                    '<img src="' + imageUrl + '" alt=""/>' +
                                    '</div>' +
                                    '<div class="right">' +
                                    '<div class="pro_top"><h2>' + name + '</h2><p>' + remark + '</p></div>' +
                                    '<div class="price">￥<span>' + unitPrice + '元</span>' + unit + '<div class="num">' + amount + '</div></div>' +
                                    '</div>' +
                                    '</div>' +
                                    '</div>' +
                                    '</a>' +
                                    '<div class="address">' +
                                    '<div class="left">' +
                                    '<img src="/images/ps_dw.png" alt=""/>' +
                                    '</div>' +
                                    '<div class="right">' +
                                    '<div class="title">' +
                                    '<div class="name">收货人：' + receiver + '</div>' +
                                    '<div class="tel">电话：' + linkTel + '</div>' +
                                    '</div>' +
                                    '<div class="info">收货地址：' + address +
                                    '</div>' +
                                    '</div>' +
                                    '</div>' +
                                    '<div class="describe">配送描述：' + deliveryInfo +
                                    '</div>' +
                                    '</li>'
                                );
                            }
                        }
                    } else {
                        ulPlant.append('<div class="no-data">暂无设置配送信息的订单!</div>');
                    }
                }
            },
            error: function (e) {

            }
        });
    };
    // tab
    $('#delivery_tab a').click(function () {
        var i = $(this).index();
        $(this).addClass('select').siblings().removeClass('select');
        $('#con .con-main').eq(i).addClass('active').siblings().removeClass('active');
        //getType = $(this).attr("id")
    });
    //配送成功初始化tab
    var initTab = function (getType){
        if(getType!=null){
            var i = getType-2
            $('#delivery_tab a').eq(i).addClass('select').siblings().removeClass('select');
            $('#con .con-main').eq(i).addClass('active').siblings().removeClass('active');
        }
    }

   /* $("#myDelivery_back").on("click",function(){
        window.location.href="personal.html?farmId="+farmId;
    });*/

    initTabData(urlPlant, 'ul_plant', '2');
    initTabData(urlFruitTrees, 'ul_fruitTrees', '3');
    initTabData(urlLivestock, 'ul_livestock', '4');
    initTab(getType);
});