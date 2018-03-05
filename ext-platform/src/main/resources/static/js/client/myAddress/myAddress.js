jQuery(document).ready(function ($) {


    //添加地址信息
    $.ajax({
        type: "GET",
        url: "/api/userAddress",
        success: function (e) {
            var cal = '';
            if (e.data != null && e.data.length > 0) {
                var str='';
                for (var i = 0; i < e.data.length; i++) {
                    if (e.data[i].isDefault == "1") {
                        cal = "active";
                    } else {
                        cal = "";
                    }
                    str +='<div class="my_address">' +
                        '<div class="address">' +
                        '<a href="javascript:void(0);">' +
                        '<div class="right">' +
                        '<div class="title">' +
                        '<div class="name">收货人:' + e.data[i].linkName + '</div>' +
                        '<div class="tel">电话：' + e.data[i].linkTel + '</div>' +
                        '</div>' +
                        '<div class="info">收货地址：' + e.data[i].linkProvince + e.data[i].linkCity + e.data[i].linkArea + e.data[i].linkAddress +
                        '</div>' +
                        '</div>' +
                        '</a>' +
                        '</div>' +
                        '<div class="edit">' +
                        '<div class="add_flag ' + cal + '" id="' + e.data[i].id + '">' + '<span></span>默认地址</div>' +
                        '<a href="javascript:void(0);" class="edit_btn" id="' + e.data[i].id + '">' + '<img src="/images/dz_bj.png" alt=""/>编辑</a>' +
                        '<a href="javascript:void(0);" class="del_btn" id="' + e.data[i].id + '">' + '<img src="/images/dz_del.png" alt=""/>删除</a>' +
                        '</div>' +
                        '</div>';
                  //  $(".my_add_address").html(str);
                }
                $(".my_add_address").html(str);
            }else{
                $(".my_add_address").html('<div class="no-data">暂无地址，请添加！</div>');
            }
        },
        error: function (e) {

        }
    });
    //编辑地址
    $(".my_add_address").on("click", ".edit_btn", function () {
        var id = $(this).attr('id');
        Request.get('api/userAddress/' + id, {}, function (e) {
            if (e.success) {

                window.location.href = "editAddress.html?farmId=" + farmId +"&id=" + id;
            } else {
                $.alert("请重试");
            }
        });
    });
    // 删除地址
    $(".my_add_address").on('click', ".del_btn", function () {
        var id = $(this).attr('id');
        $.confirm({
            title: '提示',
            text: '确定要删除地址吗？',
            onOK: function () {
                //点击确认的回调函数
                Request.delete('api/userAddress/' + id, {}, function (e) {
                    if (e.success) {
                        setInterval(function () {
                            window.location.href = "myAddress.html?farmId=" + farmId;
                        }, 500);
                        $.toast("删除成功");
                    } else {
                        $.alert("请重试");
                    }

                });
            },
            onCancel: function () {
                //点击取消后的回调函数
            }
        });
    });
    //默认设置
    $(".my_add_address").on("click", ".add_flag", function () {
        $(this).parents().parent().find('.add_flag').removeClass('active');
        $(this).addClass('active');
        var id = $(this).attr("id");
        Request.put('api/userAddress/editIsDefault/' + id, {}, function (e) {
            if (e.success) {
                window.location.href = "myAddress.html?farmId=" + farmId;
            } else {
                $.toast("请重试", 1000);
            }
        });
    });


});

