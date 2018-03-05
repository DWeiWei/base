jQuery(document).ready(function ($) {
    //大棚列表
    $.ajax({
        type: "GET",
        url: "/api/greenhouses/selectByFarmId/" + farmId,
        success: function (e) {
            if (e.success) {
                if (e.data != null && e.data.length > 0) {
                    for (var i = 0; i < e.data.length; i++) {
                        var cla = "";
                        if (i == 0) {
                            var greenhousesId = e.data[i].id;
                            getLand(greenhousesId);
                            cla = "select";
                        } else {
                            cla = "";
                        }
                        var name =e.data[i].name
                        if(name.length>5){
                            name=name.substring(0,5)+'...';
                        }
                        $(".soil_tab").append(
                            '<a class="' + cla + '" href="javascript:void(0);" title="' + e.data[i].name + '" id="' + e.data[i].id + '" >' +
                            '<span>' + name + '</span>' +
                            '</a>'
                        );

                    }
                } else {
                    $(".soil_tab").append('<div class="no-data">暂未可选大棚！</div>');
                    $("#con_main").append('<div class="no-data">暂未可选地块！</div>');
                }
            }
        }
    });

    // tab
    $('#soil_tab').on("click", "a", function () {
        var i = $(this).index();
        $(this).addClass('select').siblings().removeClass('select');
        $('#con .con-main').eq(i).addClass('active').siblings().removeClass('active');
        var greenhousesId = $(this).attr("id")
        //地块列表
        $("#con_main").empty();
        getLand(greenhousesId);
    });

    var getLand = function (greenhousesId) {
        $.ajax({
            type: "GET",
            url: "/api/land/selectByGreenhousesId/" + greenhousesId,
            success: function (e) {
                if (e.success) {
                    if (e.data != null && e.data.length > 0) {
                        for (var i = 0; i < e.data.length; i++) {
                            var id = e.data[i].id,
                                isClaim = e.data[i].isClaim,//是否认领
                                imageAbsUrl = e.data[i].imageAbsUrl ? e.data[i].imageAbsUrl : '/images/xd_kx.png',
                                name = e.data[i].name;
                            if(name.length>5){
                                name=name.substring(0,5)+'...';
                            }
                            var cla = "";
                            if (i == 0) {
                                cla = "select";
                            } else {
                                cla = "";
                            }
                            $("#con_main").append(
                                '<a href="' + (isClaim == "0" ? "landInfo.html?farmId="+farmId+"&id=" + id : "javascript:void(0);"  ) + '" class="' + (e.data[i].isClaim == "0" ? "select" : "disable") + '" id="' + e.data[i].id + '">' +
                                '<div class="' + (isClaim == '0' ? '' : 'unavailable') + '">' +
                                '<img src="' + imageAbsUrl + '" alt=""/>' +
                                '<span>' + (isClaim == "0" ? "可用" : "已租") + '</span>' +
                                '</div>' +
                                '<p>' + name + '</p>' +
                                '</a>'
                            );

                        }
                    } else {
                        $("#con_main").append('<div class="no-data">暂未可选地块！</div>');
                    }
                }
            }
        })
    };
});