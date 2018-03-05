jQuery(document).ready(function ($) {

//页面列表
    var pageList = $('#page_list').bootstrapTable({
        url: "greenhouses",
        search: true,  //是否显示搜索框功能
        sidePagination: 'server',
        pagination: true,  //是否分页
        formatSearch: function () {
            return '大棚、基地名称';
        },
        showRefresh: true, //是否显示刷新功能
        showToggle: true,
        showColumns: true,
        iconSize: 'normal',
        filterShowClear:false,
        pageList : [ 10, 20, 50, 100 ],
        // toolbar: '#exampleTableEventsToolbar', 可以在table上方显示的一条工具栏，
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
            if (params.data.filter != '' && params.data.filter == undefined || params.data.filter == "") {
                if (params.data.search !== undefined && params.data.search != '') {
                    var aa = encodeURI('%');
                    str += '&terms[0].column=name&terms[0].value=' + aa + params.data.search + aa + '&terms[0].termType=like&terms[0].type=or';
                    str += '&terms[0].terms[0].column=farmName&terms[0].terms[0].value=' + aa + params.data.search + aa + '&terms[0].terms[0].termType=like&terms[0].terms[0].type=or';
                }
            }
            if (params.data.sort !== undefined && params.data.sort  != '' && params.data.order !== undefined && params.data.order != '') {
                str += '&sorts[0].name=' + params.data.sort + '&sorts[0].order=' + params.data.order;
            }else {
                str += '&sorts[0].name=createTime&sorts[0].order=desc';
            }


            $.ajax({
                type: 'GET',
                url: BASE_PATH + 'greenhouses',
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
                title: '大棚名称'
            }, {
                field: 'farmName',
                title: '基地名称'
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
                    if(accessQuery) {
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
        Request.get('greenhouses/' + id, {}, function (e) {
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
        Request.get('greenhouses/' + id, {}, function (e) {
            if (e.success) {
                dialogFormReset(e.data, -1);
                $('#farm-modal').modal({backdrop: 'static', keyboard: false}, 'show');
            }
            btn.removeAttr('disabled');
        });
    });

    // 删除
    $('#page_list').off('click', '.btn-del').on('click', '.btn-del', function () {
        var id = $(this).data('id');
        dialog.delete('警告', '真的要删除吗？', function () {
            Request.delete('greenhouses/' + id, {}, function (e) {
                if (e.success) {
                    pageList.bootstrapTable('refresh');
                    toastr.success('已删除', opts);
                } else {
                    toastr.warning('出现错误');
                }
            });
        });
    });



    // 表单重置和初始化
    var dialogFormReset = function (obj, type) {
        getAllFarm(obj);
        var modal = $("#farm-modal");
        modal.data('type', type);
        // 0 新增, 1 编辑
        var flag = type == 0 ? true : false;
        modal.data('id', (flag ? '' : obj.id));
        modal.find('#name').val(flag ? '' : obj.name);
        modal.find('#farmId').val(flag ? '' : obj.farmId);
        if(!flag){
            modal.find('#farmName option:selected').text(obj.farmName);
        }
        // 新增
        if (type === 0) {
            $('#name').removeAttr('disabled');
            $('#farmName').removeAttr('disabled');
            editor.readonly(false);
            //初始化图文信息框
            editor.html('');
        }else if(type === 1){//修改
            $('#name').removeAttr('disabled');
            $('#farmName').removeAttr('disabled');
            editor.readonly(false);
            window.editor.html(obj.info);

        }else if(type === -1){//详情
            //界面不可操作
            $('#name').attr('disabled',true);
            $('#farmName').attr('disabled',true);
            editor.readonly(true);
            window.editor.html(obj.info);
        }
    }


    //获取所有基地
    var getAllFarm = function(obj){
        $.ajax({
           type:'GET',
            url:'farm/getAllFarm',
            async : false,
            success: function (e) {
                    var select = $('#farmName');
                    select.empty();
                    var opt='';
                    for(var i=0;i<e.data.length;i++) {
                        if(obj!=null&&obj.farmId!=null){
                            if(obj.farmId==e.data[i].id){
                                opt += '<option selected="selected" value="'+e.data[i].id+'">'+e.data[i].name+'</option>';
                            }else {
                                opt += '<option value="'+e.data[i].id+'">'+e.data[i].name+'</option>';
                            }
                        }else {
                            opt += '<option value="'+e.data[i].id+'">'+e.data[i].name+'</option>';
                        }

                    }
                    select.append(opt);
            }
        });
    }
    //新增或者修改基地校验
    $("form#farm-form").validate({
        rules:{
            name:{required: true},
            farmName:{required: true},
        },
        messages: {
            name: {required: "请输入大棚名称"},
            farmName: {required: "请选择基地"},
        },
        errorElement:'em',
        submitHandler: function(form){
            var form = $(form);
            $(".btn-save").attr("disabled",true);
            var params = {
                'name':form.find('#name').val(),
                'info':window.editor.html()
            };
            params.farmName=$('#farmName option:selected').text();
            params.farmId=$('#farmName option:selected').val();

            if(params.name==null||params.name.length<=0){
                toastr.warning('大棚名称不能为空！', opts);
                $(".btn-save").removeAttr('disabled');
                return false;
            }
            if(params.farmName==null||params.farmName.length<=0){
                toastr.warning('基地名称不能为空！', opts);
                $(".btn-save").removeAttr('disabled');
                return false;
            }
            var requestType = $('#farm-modal').data('type') == '0';
            var uid = $('#farm-modal').data('id');
            var req = requestType ? Request.post : Request.put;
            req('greenhouses/' + (requestType ? '' : uid), params, function (e) {
                if (e.success) {
                    toastr.info('保存成功', opts);
                    $('#farm-modal').modal('hide');
                    pageList.bootstrapTable('refresh');
                    $(".btn-save").removeAttr('disabled');
                } else {
                    toastr.warning('保存失败', opts);
                    $(".btn-save").removeAttr('disabled');
                }
            });

        }
    });

});