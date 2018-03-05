"use strict";
$(document).ready(function () {
    var CONSTANT = {
        _ACTION:{EDIT:'edit',ADD:'add'},
        TYPE:{ DEFAULT:'0',LAND:'1', VEGETABLE:'2', FRUIT_TREES:'3', LIVESTOCK:'4'},
        IS_BIND:'0',
        STATES:'1'
    };
    var INDEX = 0;
    $('#putTime').datetimepicker({
        minView: "month", //选择日期后，不会再跳转去选择时分秒
        language:  'zh-CN',
        format: 'yyyy-mm-dd',
        todayBtn:  1,
        autoclose: 1
    });
    $('#produceTime').datetimepicker({
        minView: "month", //选择日期后，不会再跳转去选择时分秒
        language:  'zh-CN',
        format: 'yyyy-mm-dd',
        todayBtn:  1,
        autoclose: 1
    });
    $('#factoryTime').datetimepicker({
        minView: "month", //选择日期后，不会再跳转去选择时分秒
        language:  'zh-CN',
        format: 'yyyy-mm-dd',
        todayBtn:  1,
        autoclose: 1
    });
    // 加载列表数据
    var deviceList = $('#device_list').bootstrapTable({
        idField:'id',
        uniqueId:'id',
      //  url: BASE_PATH + "price/landPriceList",
        search: true,  //是否显示搜索框功能
        sidePagination: 'server',
        pagination: true,  //是否分页
        showRefresh: true, //是否显示刷新功能
        pageList : [ 10, 20, 50, 100 ],
        showToggle: true,
        showColumns: true,
        formatSearch: function () {
            return '设备名称、设备编号';
        },
      /*  iconSize: 'normal',
        icons: {
            refresh: 'glyphicon-repeat',
            toggle: 'glyphicon-list-alt',
            columns: 'glyphicon-list'
        },*/
        ajax: function (params) {
            var param = {};
            param.pageSize = params.data.limit;
            param.pageIndex = params.data.offset / params.data.limit;
            var str = 'pageSize=' + param.pageSize + '&pageIndex=' + param.pageIndex;
            if (params.data.search !== undefined && params.data.search != '') {
                var aa = encodeURI('%');
                str += '&terms[0].column=name&terms[0].value=' + aa + params.data.search + aa + '&terms[0].termType=like&terms[1].type=or';
                str += '&terms[1].column=no&terms[1].value=' + aa + params.data.search + aa + '&terms[1].termType=like&terms[1].type=or';
            }
            //默认排序
            str += '&sorts[0].name=createTime&sorts[0].order=desc';
            $.ajax({
                type: 'GET',
                url: BASE_PATH + 'device',
                data: str,
                dataType: 'json',
                success: function (e) {
                    params.success({
                        'rows': e.data,
                        'total': e.total
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
                halign:'center',
                align: 'left',
                formatter: function (value, row, index) {
                    return index+1;
                }
            }, {
                field: 'name',
                title: '设备名称',
                halign:'center',
                align: 'left'
            }, {
                field: 'serialNumber',
                title: '设备序号',
                halign:'center',
                align: 'center'
            },{
                field: 'no',
                title: '设备编号',
                halign:'center',
                align: 'center'
            }, {
                field: 'putTime',
                title: '投放时间',
                halign:'center',
                align: 'center',
                formatter: function(val, row, index) {
                    if(val != null || val != undefined || val != ''){
                        var data = new Date(val);
                        return data.format('yyyy-MM-dd');
                    }
                }
            },{
                field: 'remark',
                title: '备注',
                halign:'center',
                align: 'left',
                formatter: function (val, row, index) {
                    if(val){
                        if(val.length > 10){
                            return '<span title="'+val+'">'+val.substring(0,10)+'...</span>';
                        }else{
                            return '<span title="'+val+'">'+val+'</span>';
                        }
                    }

                }
            }, {
                field: 'id',
                title: '操作',
                align: 'center',
                formatter: function (val, row, index) {
                    var button = "";
                    if(accessUpdate){
                        button = button + '<button type="button" data-id="' + val + '" class="btn btn-info btn-xs btn-edit">编辑</button>\n';
                    }
                    if(row.isBind == '1'){
                        if(accessUnBind) {
                            button = button +  '<button type="button" data-id="' + val + '" data-title="'+row.name+'" class="btn btn-warning btn-xs btn-unbing">解绑</button>\n';
                        }
                    }else {
                        if(accessAssign) {
                            button = button +  '<button type="button" data-id="' + val + '" class="btn btn-default btn-xs btn-assign">分配</button>\n';
                        }
                    }
                    if(accessDel){
                        button = button +  '<button type="button" data-id="' + val + '" data-bind="'+row.isBind +'" data-title="' + row.name + '" class="btn btn-danger btn-xs btn-del">删除</button>\n';
                    }
                    return button;
                }
            }
        ]
    });
    // 新增
    $('.btn-add').off('click').on('click', function () {
        //清空表单
        resetForm(CONSTANT._ACTION.ADD,{});
        $("#device_modal").modal({backdrop: 'static', keyboard: false}, 'show');
    });
    //编辑
    $('#device_list').off('click', '.btn-edit').on('click', '.btn-edit', function() {

        var _this = $(this);
        var idStr = _this.data('id');
        var rowData =   $('#device_list').bootstrapTable('getRowByUniqueId', idStr);
        resetForm(CONSTANT._ACTION.EDIT,rowData);
        $("#device_modal").modal({backdrop: 'static', keyboard: false}, 'show');
    });
    //删除
    $('#device_list').off('click', '.btn-del').on('click', '.btn-del', function() {
        var _this = $(this);
        var bind = _this.data('bind');
        if(bind == '1'){
            toastr.warning('该设备已绑定', opts);
            return false;
        }
        dialog.delete('警告', '真的要删除 ' + _this.data('title') + ' 吗?', function() {
            Request.delete('device/' + _this.data('id'), {}, function(e) {
                if (e.success) {
                    toastr.info('完成', opts);
                    deviceList.bootstrapTable('refresh');
                } else {
                    toastr.info('失败', opts);
                }
            });
        });
    });
    //分配
    $('#device_list').off('click', '.btn-assign').on('click', '.btn-assign', function() {
        var _this = $(this);
        var idStr = _this.data('id');
        buildAssignForm(idStr);
        $("#assign_modal").modal({backdrop: 'static', keyboard: false}, 'show');
    });
    //解绑
    $('#device_list').off('click', '.btn-unbing').on('click', '.btn-unbing', function() {
        var _this = $(this);

        dialog.confirm('提示', '确定要解绑 ' + _this.data('title') + ' 吗?', function() {
            Request.post('device/' + _this.data('id')+'/unBind', {}, function(e) {
                if (e.success) {
                    toastr.info('完成', opts);
                    deviceList.bootstrapTable('refresh');
                } else {
                    toastr.info('失败', opts);
                }
            });
        });
    });
    $('#resource_type').on('change',function () {
        var farmId = $('#farm_id option:selected').val();
        var type = $('#resource_type option:selected').val();
        if(farmId == '0'){
            toastr.warning('请选择基地！', opts);
            $("#resource_type").val(CONSTANT.TYPE.DEFAULT);
            return false;
        }
        switch(type) {
            case CONSTANT.TYPE.LAND:
                //初始化大棚下拉框
                $('#greenhouses_tr').show();
                $('#land_tr').show();
             //   $('#vegetable_tr').hide();
                $('#fruitTrees_tr').hide();
                $('#livestock_tr').hide();
                initGreenHousesSelect(farmId);
                var greenhousesId = $('#greenhouses_id option:selected').val();
                if(greenhousesId != '0'){
                    initLandList(farmId,greenhousesId);
                }
                break;
            case CONSTANT.TYPE.FRUIT_TREES:
                //隐藏大棚下拉框
                $('#greenhouses_tr').hide();
                $('#fruitTrees_tr').show();
                $('#land_tr').hide();
               // $('#vegetable_tr').hide();
                $('#livestock_tr').hide();
                initFruitTreesList(farmId)
                break;
            case CONSTANT.TYPE.LIVESTOCK:
                //隐藏大棚下拉框
                $('#greenhouses_tr').hide();
                $('#livestock_tr').show();
                $('#land_tr').hide();
               // $('#vegetable_tr').hide();
                $('#fruitTrees_tr').hide();
                initLivestockList(farmId);
                break;
            case CONSTANT.TYPE.DEFAULT:
                $('#greenhouses_tr').hide();
                $('#livestock_tr').hide();
                $('#land_tr').hide();
                $('#vegetable_tr').hide();
                $('#fruitTrees_tr').hide();
                break;
            default:
                break;
        };
    });

    $('#farm_id').on('change',function () {
        var farmId = $('#farm_id option:selected').val();
        if(farmId == '0'){
            $("#resource_type").val(CONSTANT.TYPE.DEFAULT);
            $('#greenhouses_tr').hide();
            $('#livestock_tr').hide();
            $('#land_tr').hide();
           // $('#vegetable_tr').hide();
            $('#fruitTrees_tr').hide();
        }
        var type = $('#resource_type option:selected').val();
        if(type == CONSTANT.TYPE.LAND){
            initGreenHousesSelect(farmId);
            $('#landCheckBox').empty();
        }
        if(type == CONSTANT.TYPE.VEGETABLE){
            initVegetableList(farmId);
        }
        if(type == CONSTANT.TYPE.FRUIT_TREES){
            initFruitTreesList(farmId);
        }
        if(type == CONSTANT.TYPE.LIVESTOCK){
            initLivestockList(farmId);
        }
    });

    $('#greenhouses_id').on('change',function () {
        var farmId = $('#farm_id option:selected').val();
        var greenhousesId = $('#greenhouses_id option:selected').val();
        if(greenhousesId != '0'){
            initLandList(farmId,greenhousesId);
        }else{
            var checkBox = $('#landCheckBox');
            checkBox.empty();
        }
    })
    //填充表单or清空表单
    var resetForm = function (action, data) {
        deviceValidate.resetForm();
        var modal = $('#device_modal');
        data.putTime = new Date(data.putTime).format('yyyy-MM-dd');
        data.produceTime = new Date(data.produceTime).format('yyyy-MM-dd');
        data.factoryTime = new Date(data.factoryTime).format('yyyy-MM-dd');
        switch(action)
        {
            case CONSTANT._ACTION.ADD://清空表单
                $(".modal-title").html("新增设备");
                modal.data('id', '');
                modal.find('#name').val('');
                modal.find('#putTime').val('');
                modal.find('#serialNumber').val('');
                modal.find('#no').val('');
                modal.find('#produceTime').val('');
                modal.find('#factoryTime').val('');
                modal.find('#remark').val('');
                break;
            case CONSTANT._ACTION.EDIT: //填充表单
                $(".modal-title").html("编辑设备");
                modal.data('id', data.id);
                modal.find('#name').val(data.name);
                modal.find('#putTime').val(data.putTime);
                modal.find('#serialNumber').val(data.serialNumber);
                modal.find('#no').val(data.no);
                modal.find('#produceTime').val(data.produceTime);
                modal.find('#factoryTime').val(data.factoryTime);
                modal.find('#remark').val(data.remark);
                break;
            default:
                break;
        }
    };

    var buildAssignForm = function (deviceId) {
        var modal = $('#assign_modal');
        modal.data('id', deviceId);
        //初始化基地下拉树
        initFarmSelect(INDEX);
        INDEX++;

    };

    var initFarmSelect = function (index) {
        $.ajax({
            type: 'GET',
            url:'farm/getAllFarm', //BASE_PATH + 'farm/',
            dataType: 'json',
            async : false,
            success: function (e) {
                if(index==0){
                    var select = $('#farm_id');
                    var opt='';
                    for(var i=0;i<e.data.length;i++) {
                        opt += '<option value="'+e.data[i].id+'">'+e.data[i].name+'</option>';
                    }
                    select.append(opt);
                }
            },
            error: function (e) {
                toastr.warning("获取基地失败，请重试", opts);
            }

        });
    };

    var initGreenHousesSelect = function (farmId) {
        $.ajax({
            type: 'GET',
            url:'greenhouses/selectNameByFarmId/'+farmId, //BASE_PATH + 'farm/',
            dataType: 'json',
            async : false,
            success: function (e) {
                var select = $('#greenhouses_id');
                select.empty();
                var opt='<option value="0">请选择大棚</option>';
                for(var i=0;i<e.data.length;i++) {
                    opt += '<option value="'+e.data[i].id+'">'+e.data[i].name+'</option>';
                }
                select.append(opt);
            },
            error: function (e) {
                toastr.warning("获取大棚失败，请重试", opts);
            }

        });
    }

    var initLandList = function (farmId,greenhousesId) {
        var params = '&paging=false&terms[0].column=farmId&terms[0].value=' +  farmId;
            params += '&terms[1].column=greenhousesId&terms[1].value=' +  greenhousesId;
        $.ajax({
            type: 'GET',
            url:'land/listNoPage', //BASE_PATH
            dataType: 'json',
            data: params,
            async : false,
            success: function (data) {
                var checkBox = $('#landCheckBox');
                checkBox.empty();
                var data = data.data;
                if(data.length == 0){
                    toastr.info("该大棚暂无地块！", opts);
                }
                var opt='';
                for(var i=0;i<data.length;i++) {
                    var land = data[i];
                    opt += '<input style="width: 25px;" type="checkbox" name="land"   data-id="'+land.id+'"  value="'+land.id+'"/>'+land.name+'&nbsp;&nbsp;';
                    var j = 5;
                    if(i>0&&i%j==0){
                        opt +='</br>'
                    }
                }
                checkBox.append(opt);
            },
            error: function (e) {
                toastr.warning("获取地块失败，请重试", opts);
            }

        });
    };

    var initFruitTreesList = function (farmId) {
        var params = '&paging=false&terms[0].column=farmId&terms[0].value=' +  farmId;
        params += '&terms[1].column=resourceType&terms[1].value=3';
        $.ajax({
            type: 'GET',
            url:'farmResourceBind', //BASE_PATH
            dataType: 'json',
            data: params,
            async : false,
            success: function (data) {
                var checkBox = $('#fruitTreesCheckBox');
                checkBox.empty();
                if(data.length == 0){
                    toastr.info("该基地暂无果树！", opts);
                }
                var opt='';
                for(var i=0;i<data.length;i++) {
                    var fruitTrees = data[i];
                    opt += '<input style="width: 25px;" type="checkbox" name="fruitTrees"  data-id="'+fruitTrees.id+'"  value="'+fruitTrees.id+'"/>'+fruitTrees.fruitTreesInfo.name+'&nbsp;&nbsp;';
                    var j = 5;
                    if(i>0&&i%j==0){
                        opt +='</br>'
                    }
                }
                checkBox.append(opt);
            },
            error: function (e) {
                toastr.warning("获取果树失败，请重试", opts);
            }

        });
    };

    var initLivestockList = function (farmId) {
        var params = '&paging=false&terms[0].column=farmId&terms[0].value=' +  farmId;
        params += '&terms[1].column=resourceType&terms[1].value=4';
        $.ajax({
            type: 'GET',
            url:'farmResourceBind', //BASE_PATH
            dataType: 'json',
            data: params,
            async : false,
            success: function (data) {
                var checkBox = $('#livestockCheckBox');
                checkBox.empty();
                if(data.length == 0){
                    toastr.info("该基地暂无禽畜！", opts);
                }
                var opt='';
                for(var i=0;i<data.length;i++) {
                    var livestock = data[i];
                    opt += '<input style="width: 25px;" type="checkbox" name="livestock"  data-id="'+livestock.id+'" value="'+livestock.id+'"/>'+livestock.livestockInfo.name+'&nbsp;&nbsp;';
                    var j = 5;
                    if(i>0&&i%j==0){
                        opt +='</br>'
                    }
                }
                checkBox.append(opt);
            },
            error: function (e) {
                toastr.warning("获取禽畜失败，请重试", opts);
            }

        });
    }


    var deviceValidate = $("#device_form").validate({
        rules: {
            name: {required: true,maxlength:100},
            serialNumber:{required: true, maxlength:32 },
            putTime:{required: true, maxlength:32},
            produceTime:{required: true},
            factoryTime:{required: true}

        },
        messages: {
            name: {required: "请输入设备名称"},
            serialNumber:{required:"请输入设备序号"},
            no:{required:"请输入设备编码"},
            putTime:{required:"请选择投放时间"},
            produceTime:{required:"请选择生产时间"},
            factoryTime:{required:"请选择出厂时间"}

        },
        submitHandler: function (form) {
            var form = $(form),
                modal = $('#device_modal'),
                id = modal.data('id'),
                btnDeviceSave = $('#btn_device_save');
            btnDeviceSave.attr('disabled', true);
            var req = ( id != '')? Request.put : Request.post;
            var params = {
                name: modal.find('#name').val(),
                putTime:modal.find('#putTime').val(),
                serialNumber:modal.find('#serialNumber').val(),
                no:modal.find('#no').val(),
                produceTime:modal.find('#produceTime').val(),
                factoryTime:modal.find('#factoryTime').val(),
                remark:modal.find('#remark').val(),
                isBind:CONSTANT.IS_BIND,
                states:CONSTANT.STATES
            };
            req('device/' + ((id != '') ? id : ''), params, function(e) {
                if (e.success) {
                    toastr.success('处理完成');
                    modal.modal('hide');
                    deviceList.bootstrapTable('refresh');
                } else {
                    toastr.warning('请重试');
                }
                btnDeviceSave.removeAttr('disabled');
            });
        }
    });

    var assignValidate = $('#assign-form').validate({
        debug:true,
        submitHandler: function (form) {
            //验证是否选择基地
            var modal = $('#assign_modal');
            var farmId = $('#farm_id option:selected').val();
            var resourceType = $('#resource_type option:selected').val();
            var greenhousesId = $('#greenhouses_id option:selected').val();
            if(farmId == '0'){
                toastr.warning('请选择基地！', opts);
                return false;
            }
            if(resourceType == '0'){
                toastr.warning('请选择类型！', opts);
                return false;
            }
            var bind = [];
            var deviceId = modal.data('id');
            switch(resourceType) {
                case CONSTANT.TYPE.LAND:
                    if(greenhousesId == '0'){
                        toastr.warning('请选择大棚！', opts);
                        return false;
                    }
                    $('input[name="land"]:checked').each(function () {
                        bind.push({
                            farmId:farmId,
                            greenhousesId:greenhousesId,
                            deviceId: deviceId,
                            deviceBindType: CONSTANT.TYPE.LAND,
                            resourceId: $(this).data('id')
                        });
                    });
                    if(bind.length <= 0){
                        toastr.warning('请选择地块！', opts);
                        return false;
                    }
                    break;
                case CONSTANT.TYPE.FRUIT_TREES:
                    $('input[name="fruitTrees"]:checked').each(function () {
                        console.log( $(this).data('id'))
                        bind.push({
                            farmId:farmId,
                            deviceId: deviceId,
                            deviceBindType: CONSTANT.TYPE.FRUIT_TREES,
                            resourceId: $(this).data('id')
                        });
                    });
                    if(bind.length <= 0){
                        toastr.warning('请选择果树！', opts);
                        return false;
                    }
                    break;
                case CONSTANT.TYPE.LIVESTOCK:
                    $('input[name="livestock"]:checked').each(function () {
                        bind.push({
                            farmId:farmId,
                            deviceId: deviceId,
                            deviceBindType: CONSTANT.TYPE.LIVESTOCK,
                            resourceId: $(this).data('id')
                        });
                    });
                    if(bind.length <= 0){
                        toastr.warning('请选择禽畜！', opts);
                        return false;
                    }
                    break;
                default:
                    break;
            }
            var  btnAssignSave = $('#btn_assign_save');
            btnAssignSave.attr('disabled', true);
            Request.post('device/'+deviceId+'/assign', JSON.stringify(bind),function (e) {
                if (e.success) {
                    toastr.success('处理完成');
                    modal.modal('hide');
                    deviceList.bootstrapTable('refresh');
                } else {
                    toastr.warning('请重试');
                }
                btnAssignSave.removeAttr('disabled');
            });
        }
    });
})