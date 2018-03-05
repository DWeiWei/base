jQuery(document).ready(function ($) {

    $.ajax({
        type: "GET",
        url: "/api/userAddress/"+(id!=null?id:''),
        success: function (e) {
            if (e.data != null && e.data.length != 0) {

                   var linkName = '',
                       linkTel = '',
                       addressInfo ='';
                   if(id!=null){
                       linkName=  e.data.linkName; //选中联系人
                       linkTel = e.data.linkTel; //选中联系电话
                       addressInfo = e.data.linkProvince+e.data.linkCity+e.data.linkArea+e.data.linkAddress; //选中详细地址

                   }else {
                       linkName=  e.data[0].linkName;//默认联系人
                       linkTel = e.data[0].linkTel;//默认联系电话
                       addressInfo = e.data[0].linkProvince+e.data[0].linkCity+e.data[0].linkArea+e.data[0].linkAddress;//默认详细地址
                   }
                   var str = '<div class="address">' +
                       '<a href="javascript:void(0);" class="receiveAddress">' +
                       '<div class="left">' +
                       '<img src="/images/ps_dw.png" alt=""/>' +
                       '</div>' +
                       '<div class="right">' +
                       '<div class="title">' +
                       '<div class="name">' + "收货人:" + linkName + '</div>' +
                       '<div class="tel">' + "电话:" + linkTel + '</div>' +
                       '</div>' +
                       '<div class="info">收货地址:' + '<span id="address">' + addressInfo +'</span>'+
                       '</div>' +
                       '</div>' +
                       '</a>' +
                       '</div>' +
                       '<div class="describe">' +
                       '<h2>' + "请填写意向配送信息" + '</h2>' +
                       '<div class="info">' +
                       '<div class="title">' + "配送描述：" +
                       '<p id="' + e.data.id + '">' + '</p>' +
                       '</div>' +
                       '<textarea placeholder="请输入满足配送的条件" class="deliveryInfo"  onfocus="" ></textarea>' +
                       '</div>' +
                       '</div>'+
                       '<div class="bottom_btn">' +
                       '<a href="javascript:void(0);" class="dark" id="btn">确定</a>' +
                       '</div>';
                    $(".delivery").html(str);

                    // $(".delivery").html(
                    //
                    // );

            } else {
               $.toast("您还未创建配送地址", "text");
                $(".delivery").html(
                    '<footer>' +
                    '<div class="bottom_btn">' +
                    '<a href="editAddress.html?farmId='+farmId+'&id=' + orderIdAndType + '"  class="dark" id="add"><img src="/images/dz_xj.png" class="add_img" alt=""/>创建配送地址</a>' +
                    '</div>' +
                    '</footer>'
                );
            }
        },
        error: function (e) {

        }


    });


    $(document).ajaxComplete(function (event) {
        $(".delivery").on("click", ".receiveAddress", function () {
            window.location.href = "receiveAddress.html?farmId="+farmId+"&id=" + orderId + "_" + type;
        })

        //收货地址地址editAddress
        //提交配送信息
        $("#btn").on("click", function () {
            var params = {};
            var receiver = $(".name").text().split(':')[1];
            var linkTel = $(".tel").text().split(':')[1];
            var address = $("#address").html();
            var deliveryInfo = $(".deliveryInfo").val();

            params.receiver = receiver;
            params.linkTel = linkTel;
            params.address = address;
            params.deliveryInfo = deliveryInfo;
            params.orderId = orderId;
            params.type = type;
            params.farmId = farmId;
            if (deliveryInfo.length > 100) {
                $.alert('收货地址限定100个字节');
                return false;
            }

            Request.post('api/delivery/', params, function (e) {
                if(e.data==false){
                    setInterval(function () {
                        window.location.href = "index.html?farmId="+farmId+"&id=" + type;
                    }, 1000);
                    $.toast("订单已配送", 1000);
                }else {
                if (e.success) {
                    setInterval(function () {
                        window.location.href = "myDelivery.html?farmId="+farmId+"&id=" + type;
                    }, 3000);
                    $.toast("保存成功", 3000);

                } else {
                    $.toast("请重试", 1000);
                }
                }
            });
        })
    });

});