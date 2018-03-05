jQuery(document).ready(function ($) {

    $("#dateReserve").calendar({
        value:new Date().Format(''),
        minDate:new Date().Format('yyyy-MM-dd')
    })
    Request.get('api/farm/selectById/' + farmId, {}, function (e) {
        if (e.success) {
            $('#farm_content').html(e.data.info);
        } else {
            $.toast("获取农场信息失败！", 1000);
        }
    });

    $('#sba').on('click', function () {
        var linkPerson = document.getElementById("name").value;
        var linkTel = document.getElementById("tel").value;
        var appointmentTime = document.getElementById("dateReserve").value;
        var params = {};
        params.linkPerson = linkPerson;
        params.linkTel = linkTel;
        params.appointmentTime = appointmentTime+' 00:00:00';
        params.farmId = farmId;

        var reg = /^1[3|4|5|7|8][0-9]{9}$/; //验证规则
        var flag = reg.test(linkTel); //true
        if (params.linkPerson == null || params.linkPerson == '') {
            $.toast('联系人不能为空', "text");
            return false;
        }

        if (params.linkTel == null || params.linkTel == '') {
            $.toast('手机号不能为空', "text");
            return false;
        } else {
            if (!flag) {
                $.toast('请输入正确的手机号', "text");
                return false;
            }
        }
        if (appointmentTime == null || params.appointmentTime == '') {
            $.toast('预约时间不能为空', "text");
            return false;
        }
        Request.post('api/appointment/addInfo',
            params, function (e) {
                if (e.success) {
                    $.toast("预约成功", 3000);
                      setInterval(function () {
                        window.location.href="visitFarm.html?farmId"+farmId;
                      },3000);
                } else {
                    $.toast("预约失败", 1000);
                }

            });
    });
});

