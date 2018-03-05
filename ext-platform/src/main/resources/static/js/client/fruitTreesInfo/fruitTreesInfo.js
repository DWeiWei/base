jQuery(document).ready(function ($) {
    $.ajax({
        type: "GET",
        url: "/api/farmResourceBind/selectFarmResourceBind/" + fruitTreesId,
        success: function (e) {
            var fruitTreess = e.data;
            var fruitTreesInfo = fruitTreess.fruitTreesInfo,
                priceConf = fruitTreess.priceConf;

            if(fruitTreesInfo.imageAbsUrl!=''&&fruitTreesInfo.imageAbsUrl!=null){
            $('#fruitTreesInfoImg').attr("src",fruitTreesInfo.imageAbsUrl);
            }
            $('#detail').append('<h2><span >' + fruitTreesInfo.name + '</span></h2>' +
                '<p>' + priceConf.remark + '</p>' +
                '<div class="price">' + "￥" + priceConf.price + "元/" + priceConf.priceUnit + "/年" + '</div>' +
                '</div>');
            $('#detail_info').append('<h2>详情</h2>' +
                '<div class="show">' +
                '<div class="right">' +
                '<p><span>' + fruitTreesInfo.info + '</span></p>' +
                '</div>');
        }
    });

    $(document).ajaxComplete(function (event) {
        // banner
        var swiper = new Swiper('.banner_info', {
            pagination: '.swiper-pagination' // 分页器
        });

    });

    $(".dark").on("click", function () {
        window.location.href = "immediatelyRecognize.html?farmId=" + farmId + "&id=" + fruitTreesId;
    })

    $(".monitor_btn").on("click", function () {
        window.location.href = "monitoring.html?farmId=" + farmId + "&id=" + fruitTreesId + "_" + 3;

    });
});