jQuery(document).ready(function ($) {
    $.ajax({
        type: "GET",
        url: "/api/userAddress",
        success: function (e) {
            var flag = "";
            //alert(e.data[0].id)
            var str ='';
            for (var i = 0; i < e.data.length; i++) {
                var flag = '<div class="flag">' + "默认地址" + '</div>';
                str+= '<div class="address">' +
                    '<a href="javascript:void(0);" class="' + (e.data[i].isDefault == "1" ? "active aaaaa" : "aaaaa") + '"id="' + e.data[i].id + '" >' +
                    '<div class="left">' +
                    '<span></span>' +
                    '</div>' +
                    '<div class="right">' +
                    '<div class="title">' +
                    '<div class="name" >' + "收货人：" + e.data[i].linkName + '</div>' +
                    '<div class="tel">' + "电话：" + e.data[i].linkTel + '</div>' +
                    '</div>' +
                    '<div class="info">' + "收货地址：" + e.data[i].linkProvince + e.data[i].linkCity + e.data[i].linkArea + e.data[i].linkAddress +
                    '</div>' +
                    '<div class="' + (e.data[i].isDefault == "1" ? "flag" : "") + '">' + (e.data[i].isDefault == "1" ? "默认地址" : "") + '</div>' +
                    '</div>' +
                    '</a>' +
                    '</div>';
                $('.my_address').html(str);
            }
        },
        error: function (e) {

        }
    });

   // 地址选择
    $(".my_address").off('click', '.aaaaa').on("click", ".aaaaa", function () {
        $(this).parents().parent().find('a').removeClass('active');
        $(this).toggleClass("active");
        var id = $(".active").attr("id");
        window.location.href = "deliverySetting.html?farmId="+farmId+"&id=" + orderId+"_"+type+"_"+id;
    });

    $("#address").on("click", function () {
        window.location.href = "myAddress.html?farmId="+farmId+"&id="+orderId+"_"+type;
    });
   /* $(".back").on("click", function () {
        window.location.href = "deliverySetting.html?id=" + orderId+"_"+type;
    })*/

    // $(".back").on("click", function () {
    //     window.location.href = "deliverySetting.html?id=" + orderId+"_"+type;
    // })
});