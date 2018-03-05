jQuery(document).ready(function ($) {

    $.ajax({
        type: "GET",
        url: "/api/farmResourceBind/selectFarmResourceBind/" + vegetableId,
        success: function (e) {
            var vegetable = e.data;
            var vegetableInfo = vegetable.vegetableInfo,
                priceConf = vegetable.priceConf;
            if(vegetableInfo.imageAbsUrl!=''&&vegetableInfo.imageAbsUrl!=null){
                $("#vegetableInfoImg").attr("src",vegetableInfo.imageAbsUrl);
            }
            $("#detail").append(
                '<h2><span id="name">' + vegetableInfo.name + '</span></h2>' +
                '<p id="remark">' + priceConf.remark + '</p>' +
                '<div  class="price">￥' + priceConf.price + '元' + priceConf.priceUnit + '</div>')
            $("#detail_info").append(
                '<h2>详情</h2>' +
                '<div class="show">' +
                '<div id="info" class="right">' +
                '<p><span>' + vegetableInfo.info + '</span></p>' +
                '</div>' +
                '</div>')

        }
    });

    $(".bottom_btn").on("click", function () {
        window.location.href = "immediatelyPlant.html?farmId="+farmId+"&id=" + landIdAndVegetableId;
    });

    /* $(".back").on("click",function(){
         window.location.href ="plantVegetable.html?id="+landId;
     })*/
})