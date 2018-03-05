jQuery(document).ready(function ($) {

    $.ajax({
        type: "GET",
        url: "/api/farmResourceBind/selectFarmResourceBind/" + livestockId,
        success: function (e) {
            var livestock = e.data;
            var livestockInfo = livestock.livestockInfo,
                priceConf = livestock.priceConf;
            if(livestockInfo.imageAbsUrl!=''&&livestockInfo.imageAbsUrl!=null){
                $('#livestockInfoImg').attr("src",livestockInfo.imageAbsUrl);
            }
            $('#detail').append('<h2><span>' + livestockInfo.name + '</span></h2>' +
                '<p>' + priceConf.remark + '</p>' +
                '<div class="price" id="' + livestock.id + '">￥' + priceConf.price + '元/'+priceConf.priceUnit + '</div>' +
                '</div>')
            $('#detail_info').append('<h2>详情</h2>' +
                '<div class="show">' +
                '<div class="right">' +
                '<p><span>' + livestockInfo.info + '</span></p>' +
                '</div>');
        }
    });

    $(document).ajaxComplete(function (event) {
        // banner
        var swiper = new Swiper('.banner_info', {
            pagination: '.swiper-pagination' // 分页器
        });
    });

    $(".bottom_btn").on("click", function () {
        window.location.href = "immediatelyAdopt.html?farmId=" + farmId + "&id=" + livestockId;
    })

    $(".monitor_btn").on("click", function () {
        window.location.href = "monitoring.html?farmId=" + farmId + "&id=" + livestockId + "_" + 4;
    })
});