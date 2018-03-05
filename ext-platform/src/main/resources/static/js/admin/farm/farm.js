jQuery(document).ready(function ($) {

//页面列表
    var pageList = $('#page_list').bootstrapTable({
     //   url: "farm", //BASE_PATH + "farm/",
        search: true,  //是否显示搜索框功能
        sidePagination: 'server',
        pagination: true,  //是否分页
        formatSearch: function () {
            return '基地名称、负责人姓名';
        },
        showRefresh: true, //是否显示刷新功能
        showToggle: true,
        showColumns: true,
        iconSize: 'normal',
        filterShowClear:false,
        pageList : [ 10, 20, 50, 100 ],
      //  toolbar: '#exampleTableEventsToolbar', 可以在table上方显示的一条工具栏，
        icons: {
            refresh: 'glyphicon-repeat',
            toggle: 'glyphicon-list-alt',
            columns: 'glyphicon-list'
        },
        ajax: function (params) {
            var param = {};
            param.pageSize = params.data.limit;
            param.pageIndex = params.data.offset / params.data.limit;
            var str = 'pageSize=' + param.pageSize + '&pageIndex=' + param.pageIndex;
            if (params.data.filter == '' || params.data.filter == undefined) {
                if (params.data.search !== undefined && params.data.search != '') {
                    var aa = encodeURI('%');
                    str += '&terms[0].column=name&terms[0].value=' + aa + params.data.search + aa + '&terms[0].termType=like&terms[0].type=or';
                    str += '&terms[0].terms[0].column=userName&terms[0].terms[0].value=' + aa + params.data.search + aa + '&terms[0].terms[0].termType=like&terms[0].terms[0].type=or';
                }
            }
            if (params.data.sort !== undefined && params.data.sort != '' && params.data.order !== undefined && params.data.order != '') {
                str += '&sorts[0].name=' + params.data.sort + '&sorts[0].order=' + params.data.order;
            } else {
                str += '&sorts[0].name=createTime&sorts[0].order=desc';
            }

            $.ajax({
                type: 'GET',
                url: BASE_PATH + 'farm/',
                data: str,
                dataType: 'json',
                success: function (e) {
                    params.success({
                        'rows': e.data.data,
                        'total': e.data.total
                    });
                },
                error: function (err) {
                    params.error(err);
                }
            });
        },
        columns: [
            {
                field: 'id',
                title: '#',
                formatter: function (value, row, index) {
                    return index+1;
                }
            }, {
                field: 'name',
                title: '基地名称'
            }, {
                field: 'userName',
                title: '负责人姓名'
            }, {
                field: 'createTime',
                title: '创建时间',
                sortable:true
            }, {
                field: 'id',
                title: '操作',
                align: 'center',
                formatter: function (val, row, index) {
                    var button = '';
                   if (accessBind) {
                       button += '<button type="button" data-id="' + val + '" class="btn btn-xs btn-banding">绑定</button>\n';
                   }
                   if(accessQuery){
                        button += '<button type="button" data-id="' + val + '" class="btn  btn-xs btn-info">详情</button>\n';
                   }
                   if (accessUpdate) {
                        button += '<button type="button" data-id="' + val + '" class="btn btn-xs btn-edit">编辑</button>\n';
                    }
                    return button;
                },
                events: function (event, val, row, index) {

                }
            }
        ]

    });


    // 按钮事件
    // 新增
    $('.btn-add').off('click').on('click', function () {
        dialogFormReset(null, 0);
        $("#farm-modal").modal({backdrop: 'static', keyboard: false}, 'show');
    });
    //编辑
    $("#page_list").off('click', '.btn-edit').on('click', '.btn-edit', function () {
        var btn = $(this);
        var id = btn.data('id');
        btn.attr('disabled', true);
        Request.get('farm/' + id, {}, function (e) {
            if (e.success) {
                dialogFormReset(e.data, 1);
                $('#farm-modal').modal({backdrop: 'static', keyboard: false}, 'show');
            }
            btn.removeAttr('disabled');
        });
    });
    //详情
    $("#page_list").off('click', '.btn-info').on('click', '.btn-info', function () {
        var btn = $(this);
        var id = btn.data('id');
        btn.attr('disabled', true);
        //界面不可操作
        $('#name').attr('disabled',true);
        $('#userId').attr('disabled',true);
        $('#userName').attr('disabled',true);
        $('#province').attr('disabled',true);
        $('#city').attr('disabled',true);
        $('#district').attr('disabled',true);
        $('#street').attr('disabled',true);
        editor.readonly(true);
        $('.address').hide();
        $('#map').hide();
        Request.get('farm/' + id, {}, function (e) {
            if (e.success) {
                dialogFormReset(e.data, -1);
                $('#farm-modal').modal({backdrop: 'static', keyboard: false}, 'show');
            }
            btn.removeAttr('disabled');
        });
    });
    //绑定
    $("#page_list").off('click', '.btn-banding').on('click', '.btn-banding', function () {
        var btn = $(this);
        var id = btn.data('id');
        $('#type-form').data('id',id);
        btn.attr('disabled', true);
        Request.get('farm/selectByFarmId/' + id, {}, function (e) {
            if(e.success){
                if(e.data!=null&&e.data.length!=0){
                    bandingModalInit(id,1);
                    $("#band-modal").modal({backdrop:'static',keyboard: false},'show');
                }else {
                    bandingModalInit(id,0);
                    $("#band-modal").modal({backdrop:'static',keyboard: false},'show');
                }
            }
            btn.removeAttr('disabled');
        });
    });
    // 删除
    $('#page_list').off('click', '.btn-del').on('click', '.btn-del', function () {
        var id = $(this).data('id');
        //  var title = $(this).data('title');
        dialog.delete('警告', '真的要删除吗？', function () {
            Request.delete('farm/' + id, {}, function (e) {
                if (e.success) {
                    pageList.bootstrapTable('refresh');
                    toastr.success('已删除', opts);
                } else {
                    toastr.warning('出现错误');
                }
            });
        });
    });


    var city = $("#city").find("option:selected").text();
    // 百度地图API功能
    var map = new BMap.Map("allmap");
    //map.setCurrentCity("北京市");
    map.centerAndZoom(city, 12);
    map.enableScrollWheelZoom(true);//可收缩
    //单击获取点击的经纬度
    map.addEventListener("click",function(e){
        //alert("经度："+e.point.lng+" 纬度:"+e.point.lat);
        $("input[name='longitude']").val(e.point.lng);
        $("input[name='latitude']").val(e.point.lat);
    });
    $(".distpicker").on('change','select',function(){
        var that = $(this);
        map.centerAndZoom(that.find("option:selected").text(), 12);
    });
    //如果用户没有点击地图，把当前地图中心点的经纬度赋值到输入框
    var pointInit = function () {
        if($("#farm-modal").find('#longitude').val()==''){
            $("#farm-modal").find('#longitude').val(map.getCenter().lng)
        }
        if($("#farm-modal").find('#latitude').val()==''){
            $("#farm-modal").find('#latitude').val(map.getCenter().lat)
        }
    }


    // 表单重置和初始化
    var dialogFormReset = function (obj, type) {
        getFarmAdmin(obj);

        var modal = $("#farm-modal");
        modal.data('type', type);
        //初始化省市县联动
        modal.find('#province').val('');
        modal.find('#city').val('');
        modal.find('#district').val('');
        modal.find('#street').val('');

        // 0 新增, 1 编辑
        var flag = type == 0 ? true : false;
        modal.data('id', (flag ? '' : obj.id));
        modal.find('#name').val(flag ? '' : obj.name);
        modal.find('#userId').val(flag ? '' : obj.userId);
        modal.find('#userName').val(flag ? '' : obj.userName);
        modal.find('#longitude').val(flag ? '' : obj.longitude);
        modal.find('#latitude').val(flag ? '' : obj.latitude);
        // 新增
        if (type === 0) {
            pointInit();
            $('#name').removeAttr('disabled');
            $('#userId').removeAttr('disabled');
            $('#province').removeAttr('disabled');
            $('#city').removeAttr('disabled');
            $('#district').removeAttr('disabled');
            $('#street').removeAttr('disabled');
            editor.readonly(false);
            $('.address').show();
            $('#map').show();
            //初始化图文信息框
            editor.html('');
        }else if(type === 1){//修改
            $('#name').removeAttr('disabled');
            $('#userId').removeAttr('disabled');
            $('#province').removeAttr('disabled');
            $('#city').removeAttr('disabled');
            $('#district').removeAttr('disabled');
            $('#street').removeAttr('disabled');
            editor.readonly(false);
            $('.address').show();
            $('#map').show();

            var arr = obj.address.split("-");
            if(arr.length==1){
                modal.find('#province').val(arr[0]);
            }else if(arr.length==2){
                modal.find('#province').val(arr[0]);
                modal.find('#province').trigger('change');
                modal.find('#city').val(arr[1]);
            }else if(arr.length==3){
                modal.find('#province').val(arr[0]);
                modal.find('#province').trigger('change');
                modal.find('#city').val(arr[1]);
                modal.find('#city').trigger('change');
                modal.find('#district').val(arr[2]);
            }else if(arr.length==4){
                modal.find('#province').val(arr[0]);
                modal.find('#province').trigger('change');
                modal.find('#city').val(arr[1]);
                modal.find('#city').trigger('change');
                modal.find('#district').val(arr[2]);
                modal.find('#street').val(arr[3]);
            }
            window.editor.html(obj.info);

        }else if(type === -1){//详情
            var arr = obj.address.split("-");
            if(arr.length==1){
                modal.find('#province').val(arr[0]);
            }else if(arr.length==2){
                modal.find('#province').val(arr[0]);
                modal.find('#province').trigger('change');
                modal.find('#city').val(arr[1]);
            }else if(arr.length==3){
                modal.find('#province').val(arr[0]);
                modal.find('#province').trigger('change');
                modal.find('#city').val(arr[1]);
                modal.find('#city').trigger('change');
                modal.find('#district').val(arr[2]);
            }else if(arr.length==4){
                modal.find('#province').val(arr[0]);
                modal.find('#province').trigger('change');
                modal.find('#city').val(arr[1]);
                modal.find('#city').trigger('change');
                modal.find('#district').val(arr[2]);
                modal.find('#street').val(arr[3]);
            }
            window.editor.html(obj.info);
        }

    }
    //获取所有的基地管理员账号

    var getFarmAdmin = function (obj) {
            $.ajax({
                type: 'GET',
                url:'user/getFarmAdmin', //BASE_PATH + 'farm/',
                dataType: 'json',
                async : false,
                success: function (e) {
                        var select = $('#userId');
                        select.empty();
                        var opt='';
                        for(var i=0;i<e.data.length;i++) {
                            if(obj!=null&&obj.farmId!=null&&obj.farmId!=""){
                                if(obj.farmId==e.data[i].userId){
                                    opt += '<option value="'+e.data[i].id+'" selected="selected">'+e.data[i].userName+'</option>';
                                }else {
                                    opt += '<option value="'+e.data[i].id+'">'+e.data[i].userName+'</option>';
                                }
                            }else {
                                opt += '<option value="'+e.data[i].id+'">'+e.data[i].userName+'</option>';
                            }
                        }
                        select.append(opt);
                },
                error: function (e) {
                    toastr.warning("获取基地管理员失败，请重试", opts);
                }

            });
        }
    //基地管理员账号选择
    $('#userId').on('change',function(){
        var id= $('#userId option:selected').val();
        $.ajax({
            type: 'GET',
            url:'user/'+id, //BASE_PATH + 'farm/',
            dataType: 'json',
            async : false,
            success: function (e) {
                $('#farm-modal').find('#userName').val(e.data.username);
            },
            error: function (e) {
                toastr.warning("获取基地管理员失败，请重试", opts);
            }

        });
    });
    

    //新增或者修改基地校验
    $("form#farm-form").validate({
        rules:{
            name:{required: true},
            userName:{required: true},
        },
        messages: {
            name: {required: "请输入基地名称"},
            userName: {required: "请选择负责人"},
        },
        errorElement:'em',
        submitHandler: function(form){
            $(".btn-save").attr('disabled',true);
            var form = $(form);

            var params = {
                'name':form.find('#name').val(),
                'userId':form.find('#userId').val(),
                'userName':form.find('#userName').val(),
                'longitude':form.find('#longitude').val(),
                'latitude':form.find('#latitude').val(),
                'point':map.getCenter(),
                'info':window.editor.html()
            };
            if(form.find('#province').val()!=null&&''!=form.find('#province').val()){
                params.address = form.find('#province').val();
                if(form.find('#city').val()!=null&&''!=form.find('#city').val()){
                    params.address += '-'+form.find('#city').val();
                    if(form.find('#district').val()!=null&&''!=form.find('#district').val()){
                        params.address += '-'+form.find('#district').val();
                        if(form.find('#street').val()!=null&&''!=form.find('#street').val()){
                            params.address += '-'+form.find('#street').val();
                        }
                    }
                }
            }

            if(params.name==null||params.name.length<=0){
                toastr.warning('基地名称不能为空！', opts);
                $(".btn-save").removeAttr('disabled');
                return false;
            }
            if(params.userName==null||params.userName.length<=0){
                toastr.warning('负责人姓名不能为空！', opts);
                $(".btn-save").removeAttr('disabled');
                return false;
            }
            var requestType = $('#farm-modal').data('type') == '0';
            var uid = $('#farm-modal').data('id');
            var req = requestType ? Request.post : Request.put;
            req('farm/' + (requestType ? '' : uid), params, function (e) {
                if (e.success) {
                    toastr.info('保存成功', opts);
                    $('#farm-modal').modal('hide');

                    pageList.bootstrapTable('refresh');
                } else {
                    toastr.warning('保存失败', opts)
                }
                $(".btn-save").removeAttr('disabled');
            });

        }
    });


    //新增或者修改绑定表单
    $("form#type-form").validate({
        submitHandler: function(form){
            $(".btn-save").attr('disabled',true);
            var form = $(form);
            var resources = [];
            $('input[name="fruitTrees"]:checked').each(function () {
                resources.push({'farmId':$(this).data('farmid'),'resourceType':'3','resourceId':$(this).data('id')});
            });
            $('input[name="vegetable"]:checked').each(function () {
                resources.push({'farmId':$(this).data('farmid'),'resourceType':'2','resourceId':$(this).data('id')});
            });
            $('input[name="livestock"]:checked').each(function () {
                resources.push({'farmId':$(this).data('farmid'),'resourceType':'4','resourceId':$(this).data('id')});
            });
            var uid = $('#type-form').data('id');
            var obj = {};
            obj.data = resources;
            Request.post('farm/insertBind', obj,function (e) {
                if (e.success) {
                    toastr.info('保存成功', opts);
                    $('#band-modal').modal('hide');
                    pageList.bootstrapTable('refresh');
                    $(".btn-save").removeAttr('disabled');
                } else {
                    toastr.warning('保存失败', opts)
                    $('#band-modal').modal('hide');
                    $(".btn-save").removeAttr('disabled');
                }
            });


        }
    });

    var bandingModalInit = function(id,type){
        $('#type-form').data('type',type);
        getFruitTrees(id);
        getVegetable(id);
        getLivestock(id);
    };

    //获取果树种类
    var getFruitTrees = function (id) {
        $.ajax({
            type: 'GET',
            url:'fruitTrees/getChecked/'+id,
            dataType: 'json',
            async : false,
            success: function (e) {
                    var checkBox = $('#fruitCheckBox');
                    checkBox.empty();
                    var opt='';
                    for(var i=0;i<e.data.length;i++) {
                        if(e.data[i].resourceId!=null&&e.data[i].resourceId!=""){
                            opt += '<input style="width: 70px;" type="checkbox" checked="checked" disabled="disabled" data-farmId='+id+' name="fruitTrees" data-id="'+e.data[i].id+'" value="'+e.data[i].name+'"/>'+e.data[i].name;
                                        var j = 7;
                                        if(i>0&&i%j==0){
                                            opt +='</br>'
                                        }
                        }else {
                            opt += '<input style="width: 70px;" type="checkbox" data-farmId='+id+' name="fruitTrees" data-id="'+e.data[i].id+'" value="'+e.data[i].name+'"/>'+e.data[i].name;
                                    var j = 7;
                                    if(i>0&&i%j==0){
                                        opt +='</br>'
                                }
                        }
                    }
                checkBox.append(opt);
            },
            error: function (e) {
                toastr.warning("获取果树种类失败，请重试", opts);
            }

        });
    }
    //获取蔬菜种类
    var getVegetable = function (id) {
        $.ajax({
            type: 'GET',
            url:'vegetable/getChecked/'+id,
            dataType: 'json',
            async : false,
            success: function (e) {
                    var checkBox = $('#vegetableCheckBox');
                    checkBox.empty();
                    var opt='';
                    for(var i=0;i<e.data.length;i++) {
                        if(e.data[i].resourceId!=null&&e.data[i].resourceId!=""){
                            opt += '<input style="width: 70px;" type="checkbox" checked="checked" disabled="disabled" data-farmId='+id+' name="vegetable" data-id="'+e.data[i].id+'" value="'+e.data[i].name+'"/>'+e.data[i].name;
                            var j = 7;
                            if(i>0&&i%j==0){
                                opt +='</br>'
                            }
                        }else {
                            opt += '<input style="width: 70px;" type="checkbox" data-farmId='+id+' name="vegetable" data-id="'+e.data[i].id+'" value="'+e.data[i].name+'"/>'+e.data[i].name;
                            var j = 7;
                            if(i>0&&i%j==0){
                                opt +='</br>'
                            }
                        }
                    }
                    checkBox.append(opt);
            },
            error: function (e) {
                toastr.warning("获取蔬菜种类失败，请重试", opts);
            }

        });
    }
    //获取禽畜种类
    var getLivestock = function (id) {
        $.ajax({
            type: 'GET',
            url:'livestock/getChecked/'+id,
            dataType: 'json',
            async : false,
            success: function (e) {
                    var checkBox = $('#livestockCheckBox');
                    checkBox.empty();
                    var opt='';
                    for(var i=0;i<e.data.length;i++) {
                        if(e.data[i].resourceId!=null&&e.data[i].resourceId!=""){
                            opt += '<input style="width: 70px;" type="checkbox" checked="checked" disabled="disabled" data-farmId='+id+' name="livestock" data-id="'+e.data[i].id+'" value="'+e.data[i].name+'"/>'+e.data[i].name;
                            var j = 7;
                            if(i>0&&i%j==0){
                                opt +='</br>'
                            }
                        }else {
                            opt += '<input style="width: 70px;" type="checkbox" data-farmId='+id+' name="livestock" data-id="'+e.data[i].id+'" value="'+e.data[i].name+'"/>'+e.data[i].name;
                            var j = 7;
                            if(i>0&&i%j==0){
                                opt +='</br>'
                            }
                        }
                    }
                    checkBox.append(opt);
            },
            error: function (e) {
                toastr.warning("获取禽畜种类失败，请重试", opts);
            }

        });
    }
});