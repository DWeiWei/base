jQuery(document).ready(function ($) {

    var isDefault = "1"
    if (id != null) {
        Request.get('api/userAddress/' + id, {}, function (e) {
            if (e.success) {
                document.getElementById("name").value = e.data.linkName;
                document.getElementById("tel").value = e.data.linkTel;
                var address = e.data.linkProvince + ' ' + e.data.linkCity + ' ' + e.data.linkArea;
                document.getElementById("city-picker").value = address;
                document.getElementById("info").value = e.data.linkAddress;
            } else {

            }
        });
    }
    //提交地址信息
    $('.btn').on('click', function () {
        var linkName = document.getElementById("name").value;
        var linkTel = document.getElementById("tel").value;
        var address = document.getElementById("city-picker").value;
        var linkAddress = document.getElementById("info").value;
        var ars = address.split(" ");
        var params = {};
        params.linkName = linkName;
        params.linkTel = linkTel;
        params.linkProvince = ars[0];
        params.linkCity = ars[1];
        params.linkArea = ars[2];
        params.linkAddress = linkAddress;
        params.isDefault = isDefault;
        params.farmId = farmId;
        var reg = /^1[3|4|5|7|8][0-9]{9}$/; //验证规则
        var flag = reg.test(linkTel); //true
        if ( linkName.length < 2 || linkName.length>15) {
            $.alert('收货人名字限定2-15个字节');
            return false;
        }
        if (!flag) {
            $.alert('请输入11位有效手机号');
            return false;
        }
        if (address == null || address.length <= 0) {
            $.alert('请选择所选地区');
            return false;
        }

        if (linkAddress.length < 5 || linkAddress.length > 60) {
            $.alert('收货地址限定5-60个字节');
            return false;
        }
        var req = (id != null) ? Request.put : Request.post;
        var n = (id != null) ?  'edit' :  'post' ;
        req('api/userAddress/' + ((id != null) ? id : ''),
            params, function (e) {
                if (e.success) {
                    setInterval(function () {
                        if(orderIdAndType!=null && orderId!=null && type!=null){
                        window.location.href = "deliverySetting.html?farmId="+farmId+"&id="+orderId+"_"+type;
                        }else{
                        window.location.href = "myAddress.html?farmId="+farmId+"&id="+n;
                        }
                    }, 3000);
                    $.toast("保存成功", 3000);

                } else {
                    $.toast("请重试", 1000);
                }

            });
    });
    $(".weui-cell__hd").on('click', function (event) {
        if (isDefault == "1") {
            isDefault = "0";
        } else {
            isDefault = "1";
        }
        event.stopPropagation();
    });
    $('#city-picker').cityPicker();
    $('#city-picker').on('click',function () {
        $('.address_box .info').blur();
    });
});

