jQuery(document).ready(function ($) {
    var type = "3";
    $.ajax({
        type: "GET",
        url: "/api/farmResourceBind/selectByFarmId/" + farmId + "/" + type,
        success: function (e) {
            if (e.success) {
                var fruitTreess = e.data;
                if (fruitTreess != null && fruitTreess.length > 0) {
                    for (var i = 0; i < fruitTreess.length; i++) {
                        var fruitTreesInfo = fruitTreess[i].fruitTreesInfo,
                            priceConf = fruitTreess[i].priceConf;
                        var name = fruitTreesInfo.name;
                        if(name.length>5){
                            name=name.substring(0,5)+'...';
                        }
                        $('.pro_list').children(0).append(
                            '<li>' +
                            '<a href="fruitTreesInfo.html?farmId='+farmId+'&id=' + fruitTreess[i].id + ' "> '+
                            '<img src="' + fruitTreesInfo.imageAbsUrl + '" alt=""/>' +
                            '<p>' + name + '</p>' +
                            '<p><span>￥'  + priceConf.price + '元/' + priceConf.priceUnit + '</span></p>' +
                            '</a>' +
                            '</li>'
                        );
                    }
                } else {
                    $('.pro_list').children(0).append('<div class="no-data">暂无可选果树！</div>');
                }
            }
        }
    });
});