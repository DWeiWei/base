jQuery(document).ready(function ($) {

    $.ajax({
        type: "GET",
        url: "/api/land/selectLandInfo/" + landId,
        success: function (e) {
            if (e.data.imageAbsUrl != '' && e.data.imageAbsUrl != null) {
                $("#landInfoImg").attr("src", e.data.imageAbsUrl);
            }
            $("#detail").append(
                '<h2><span>' + e.data.greenhousesName + "&nbsp;&nbsp;" + e.data.name + '</span></h2>' +
                '<div class="price">￥' + e.data.priceConf.price + '元/' + e.data.priceConf.priceUnit + '</div>'
            );
            $("#detail_info").append('<h2>详情</h2><div class="show"><div class="right">' +
                '<p><span id="plant_info">' + e.data.info + '</span></p>' +
                '</div></div></div>');

        }
    });


    $(".dark").on("click", function () {
        window.location.href = "claim.html?farmId=" + farmId + "&id=" + landId;
    });

    $(".monitor_btn").on("click", function () {
        window.location.href = "monitoring.html?farmId=" + farmId + "&id=" + landId + "_" + "1";
    });

});