jQuery(document).ready(function ($) {
    //请求蔬菜资源
    $.ajax({
        type: "GET",
        url: "/api/vegetable/getVegetable",
        data: {farmId: farmId},
        success: function (data) {
            if (data.success) {
                var ulVegetable = $('#ul_vegetable');
                ulVegetable.empty();
                if (data.data != null && data.data.length > 0) {
                    for (var i = 0; i < data.data.length; i++) {
                        var vegetables = data.data[i];
                        var vegetableInfo = vegetables.vegetableInfo;
                        var priceConf = vegetables.priceConf;
                        var name = vegetableInfo.name,
                            imageUrl = vegetableInfo.imageAbsUrl;
                        if(name.length>5){
                            name=name.substring(0,5)+'...';
                        }
                        ulVegetable.append('<li>' +
                            '<a href="vegetableInfo.html?farmId='+farmId+'&id=' + landId + '_' + vegetables.id + '" >' +
                            '<img src="' + imageUrl + '" alt=""/>' +
                            '<p>' + name + '</p>' +
                            // '<p><span>￥'  + priceConf.price + "元/" + priceConf.priceUnit + '</span></p>' +
                            '</a>' +
                            '</li>');
                    }
                } else {
                    ulVegetable.append('<div class="no-data">暂无可选蔬菜！</div>');
                }
            }
        },
        error: function (e) {
        }
    });

})