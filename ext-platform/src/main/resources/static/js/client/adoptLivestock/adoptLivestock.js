jQuery(document).ready(function ($) {
    var type = "4";
    $.ajax({
        type: "GET",
        url: "/api/farmResourceBind/selectByFarmId/" + farmId + "/" + type,
        success: function (e) {
            if(e.success){
                var livestocks = e.data;
                if(livestocks !=null && livestocks.length>0){
                    for (var i = 0; i < livestocks.length; i++) {
                        var livestockInfo = livestocks[i].livestockInfo,
                            priceConf = livestocks[i].priceConf;
                        var name =livestockInfo.name;
                        if(name.length>5){
                            name=name.substring(0,5)+'...';
                        }
                        $('.pro_list').children(0).append(
                            '<li>' +
                            '<a href="livestockInfo.html?farmId='+farmId+'&id='+ livestocks[i].id +'" >' +
                            '<img src="' + livestockInfo.imageAbsUrl + '" alt=""/>' +
                            '<p>' + name + '</p>' +
                            '<p><span>' + "￥" + priceConf.price + "元/" + priceConf.priceUnit + '</span></p>' +
                            '</a>' +
                            '</li>'
                        );
                    }
                }else{
                    $('.pro_list').append('<div class="no-data">暂无可选禽畜！</div>');
                }
            }
        }
    });
});