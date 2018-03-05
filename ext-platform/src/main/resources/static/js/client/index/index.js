jQuery(document).ready(function ($) {


    //获取基地下的所有土地
    var getUserLand = function (farmId) {
        $.ajax({
            type: "GET",
            url: "/api/userLand/getUserLand",
            data: {farmId: farmId},
            success: function (data) {
                var userLand = $('#user_land');
                userLand.empty();
                if (data.success) {
                    var userLands = data.data,
                        htmlStr = '';
                    if (userLands != null && userLands.length > 0) {
                        for (var i = 0; i < userLands.length; i++) {
                            var id = userLands[i].id,
                                farmId = userLands[i].farmId,//基地ID
                                landId = userLands[i].farmId,//基地地块ID
                                name = userLands[i].name,//地块名称
                                imageUrl = userLands[i].imageUrl,//图片
                                isPlant = userLands[i].isPlant;//是否已种植
                            htmlStr += '<div class="swiper-slide"><a href="landOrderInfo.html?farmId=' + farmId + '&id=' + id + '">';
                            if (isPlant == '0') {
                                htmlStr += '<img src="' + imageUrl + '"/><p>待种植</p></div>';
                            } else {
                                var userPlant = userLands[i].userPlant;
                                htmlStr += '<img src="' + userPlant.imageUrl+ '"/><p>' + userPlant.name + '</p></div>';
                            }
                        }
                    } else {
                        htmlStr += '<div class="no-data">暂未认领地块！</div>';
                    }
                    userLand.append(htmlStr);
                }
            }
        });
    };
    //获取基地下的所有果树
    var getUserFruitTrees = function (farmId) {
        $.ajax({
            type: "GET",
            url: "/api/userFruitTrees/getFruitTrees",
            data: {farmId: farmId},
            success: function (data) {
                var userFruitTrees = $('#user_fruit_trees');
                userFruitTrees.empty();
                if (data.success) {
                    var userFruitTreess = data.data,
                        htmlStr = '';
                    if (userFruitTreess != null && userFruitTreess.length > 0) {
                        for (var i = 0; i < userFruitTreess.length; i++) {
                            var id = userFruitTreess[i].id,
                                farmId = userFruitTreess[i].farmId,//基地ID
                                fruitTreesId = userFruitTreess[i].fruitTreesId,//基地禽畜ID
                                name = userFruitTreess[i].name,//果树名称
                                imageUrl = userFruitTreess[i].imageUrl;//订单ID
                            htmlStr += '<div class="swiper-slide"><a href="fruitTreesOrderInfo.html?farmId=' + farmId + '&id=' + id + '"><img src="' + imageUrl + '"/><p>' + name + '</p></div>';
                        }
                    } else {
                        htmlStr += '<div class="no-data">暂未认种果树！</div>';
                    }
                    userFruitTrees.append(htmlStr);
                }
            }
        });
    }
    //获取基地下的所有禽畜
    var getUserLivestocks = function (farmId) {
        $.ajax({
            type: "GET",
            url: "/api/userLivestock/getLivestock",
            data: {farmId: farmId},
            success: function (data) {
                var userLivestock = $('#user_livestock');
                userLivestock.empty();
                if (data.success) {
                    var userLivestocks = data.data,
                        htmlStr = '';
                    if (userLivestocks != null && userLivestocks.length > 0) {
                        for (var i = 0; i < userLivestocks.length; i++) {
                            var id = userLivestocks[i].id,
                                farmId = userLivestocks[i].farmId,//基地ID
                                name = userLivestocks[i].name,//禽畜名称
                                imageUrl = userLivestocks[i].imageUrl;//订单ID
                            htmlStr += '<div class="swiper-slide"><a href="livestockOrderInfo.html?farmId=' + farmId + '&id=' + id + '"><img src="' + imageUrl + '"/><p>' + name + '</p></div>';
                        }
                    } else {
                        htmlStr += '<div class="no-data">暂未认养禽畜！</div>';
                    }
                    userLivestock.append(htmlStr);
                }
            }
        });
    }
    //获取当前登录用户的所有农场
    var getFarmAll = function () {
        $.ajax({
            type: "GET",
            url: "/api/farm/getAllFarm",
            data: {},
            success: function (e) {
                var len = e.data.length;
                var select = $('#base');
                select.empty();
                var opt = '';

                if (e.data == null || len == 0) {
                    opt = '<option>暂无基地</option>';
                } else {
                    for (var i = 0; i < len; i++) {
                        if (farmId == null) {
                            //farmId = e.data[0].id;
                            opt += '<option value="' + e.data[0].id + '" selected="selected">' + e.data[0].name + '</option>';
                        } else {
                            if (e.data[i].id == farmId) {
                                opt += '<option value="' + e.data[i].id + '" selected="selected">' + e.data[i].name + '</option>';
                            } else {
                                opt += '<option value="' + e.data[i].id + '">' + e.data[i].name + '</option>';
                            }
                        }
                    }
                }
                select.append(opt);
            }
        });
    }
    //大广告轮播图
    var getSlideShow = function (){
        $.ajax({
            type: "GET",
            url: "/api/sliderShow/getPic",
            data: {},
            success: function (e) {
                if(e.success){
                    if (e.data != null && e.data.length >0) {
                        for (var i = 0; i < e.data.length; i++) {
                            $('#index_slider').append('<div class="swiper-slide"><a href="#">' +
                                '<img src="'+e.data[i].imageAbsUrl+'" id="one"/></a></div>');
                        }
                    }
                }
            }
        }).done(function () {
            new Swiper('.banner_info', {
                pagination: '.swiper-pagination', // 分页器
                autoplay: 2000,//可选选项，自动滑动
                autoplayDisableOnInteraction: false,
            });
        });

    };
    //监听农场的改变
    $('#base').change(function () {
        farmId = $('#base option:selected').val();
        /*farmId = $('#base option:selected').val();
        getUserLand(farmId);
        getUserFruitTrees(farmId);
        getUserLivestocks(farmId);*/
        window.location.href = 'index.html?farmId=' + farmId;
    });

    getFarmAll();
    getUserLand(farmId);
    getUserFruitTrees(farmId);
    getUserLivestocks(farmId);
    getSlideShow();







    $(document).ajaxComplete(function (event) {
        // banner
        // 认领认种 左右滑动
        var swiper = new Swiper('.add_soil', {
            slidesPerView: 'auto', // 显示栏数
            spaceBetween: 15, // 间距(px)
            freeMode: true // 自由滑动
        });
    });

    $("#adoptLand").on("click", function () {
        window.location.href = "selectLand.html?farmId=" + farmId;
    });
    $("#addFruitTrees").on("click", function () {
        window.location.href = "adoptFruitTrees.html?farmId=" + farmId;
    });
    $("#adoptLivestock").on("click", function () {
        window.location.href = "adoptLivestock.html?farmId=" + farmId;
    });
    $(".my_icon").on("click", function () {
        window.location.href = "personal.html?farmId=" + farmId;
    });
    $("#abs").on("click", function () {
        window.location.href = "visitFarm.html?farmId=" + farmId;
    });



});
