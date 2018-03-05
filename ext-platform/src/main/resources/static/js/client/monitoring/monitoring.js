jQuery(document).ready(function ($) {

    $.ajax({
        type: "GET",
        url: "/api/images/imagesUrl",
        data: {farmId: farmId, resourceId: resourceId, resourceType: resourceType},
        success: function (e) {
            if (e.success) {
                if(e.data != null && e.data.length > 0){
                    $("#monitor").empty();
                    for (var i = 0; i < e.data.length; i++) {
                        $("#monitor").append('<div class="swiper-slide"><a href="#"><img src="'+e.data[i]+'" style="width: 100%;height: 16rem;"/></a></div>');
                    }
                }
            }
        }
    }).done(function () {
        var swiperBanner = new Swiper('.banner_info', {
            pagination: '.swiper-pagination',// 分页器
            loop : true});

        var padding = ($('.monito').outerHeight(true)-$('#monitor').outerHeight(true))/2;
        $(".banner_info").css({"padding-top": padding+'px'});
    });


});