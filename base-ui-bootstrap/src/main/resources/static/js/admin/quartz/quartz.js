$(document).ready(function () {
    var CONSTANT = {
        _ACTION: {EDIT: 'edit', ADD: 'add'}
    }
// 加载列表数据
    var quartzList = $('#quartz_list').bootstrapTable({
        idField:'id',
        uniqueId:'id',
        //  url: BASE_PATH + "pric
        search: true,  //是否显示搜索框功能
        formatSearch: function () {
            return '任务名';
        },
        sidePagination: 'server',
        pagination: true,  //是否分页
        showRefresh: true, //是否显示刷新功能
        pageList: [10, 20, 50, 100],
        showToggle: true,
        showColumns: true,
        ajax: function (params) {
            var param = {};
            param.pageSize = params.data.limit;
            param.pageIndex = params.data.offset / params.data.limit;
            var str = 'pageSize=' + param.pageSize + '&pageIndex=' + param.pageIndex;
            if (params.data.search !== undefined && params.data.search != '') {
                var aa = encodeURI('%');
                str += '&terms[0].column=name&terms[0].value=' + aa + params.data.search + aa + '&terms[0].termType=like&terms[1].type=or';
            }
            str += '&sorts[0].name=operDate&sorts[0].order=desc';
            $.ajax({
                url: BASE_PATH + 'quartz',
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
                formatter: function (value, row, index) {
                    return index + 1;
                }
            }, {
                field: 'name',
                title: '任务名称'
            }, {
                field: 'cron',
                title: 'cron表达式'
            }, {
                field: 'script',
                title: '执行脚本'
            }, {
                field: 'language',
                title: '脚本语言'
            }, {
                field: 'enabled',
                title: '是否启用'
            }, {
                field: 'parameters',
                title: '启动参数'
            }, {
                field: 'type',
                title: '任务类型'
            }, {
                field: 'id',
                title: '操作',
                formatter: function (val, row, index) {
                    var button = '';
                    button = button + '<button type="button" data-id="' + val + '" class="btn btn-info btn-xs btn-edit">编辑</button>\n';
                    return button
                }
            }
        ]
    });

    //新增弹出操作
    $(".box-tools").off('click', '.btn-add').on('click', '.btn-add', function () {
        $(".modal-title").html("新增任务");
        resetForm(CONSTANT._ACTION.ADD);
        $("#quartz_modal").modal('show');
    });

    //编辑
    $('#quartz_list').off('click', '.btn-edit').on('click', '.btn-edit', function() {
        var _this = $(this);
        var idStr = _this.data('id');
        var rowData =   $('#quartz_list').bootstrapTable('getRowByUniqueId', idStr);
        resetForm(CONSTANT._ACTION.EDIT,rowData);
        $("#quartz_modal").modal({backdrop: 'static', keyboard: false}, 'show');
    });

    //填充表单or清空表单
    var resetForm = function (action, data) {
        quartzValidate.resetForm();
        var modal = $('#quartz_modal');
        switch(action)
        {
            case CONSTANT._ACTION.ADD://清空表单
                $(".modal-title").html("新增任务");
                modal.data('id', '');
                break;
            case CONSTANT._ACTION.EDIT: //填充表单
                $(".modal-title").html("编辑任务");
                modal.data('id', data.id);
                modal.find('#quartz_name').val(data.name);
                modal.find('#quartz_cron').val(data.cron);
                modal.find('#quartz_script').val(data.script);
                modal.find('#quartz_language').val(data.language);
                modal.find('#quartz_parameters').val(data.parameters);
                modal.find('#quartz_type').val(data.type);
                modal.find('#quartz_remark').val(data.remark);
                break;
            default:
                break;
        }
    };

    var quartzValidate = $("#quartz_form").validate({
        submitHandler: function (form) {
            var modal = $('#quartz_modal'),
                id = modal.data('id'),
                btnSave = $('.btn-save');
            btnSave.attr('disabled', true);
            var params = {
                id:modal.data('id'),
                name: modal.find('#quartz_name').val(),
                cron: modal.find('#quartz_cron').val(),
                script: modal.find('#quartz_script').val(),
                language: modal.find('#quartz_language').val(),
                parameters: '',//modal.find('#quartz_parameters').val(),
                type: modal.find('#quartz_type').val(),
                remark: modal.find('#quartz_remark').val()
            };
            var req = ( id != '')? Request.put : Request.post;
            req('quartz/', params, function(e) {
                if (e.success) {
                    toastr.success('处理完成');
                    modal.modal('hide');
                    quartzList.bootstrapTable('refresh');
                } else {
                    toastr.warning('请重试');
                }
                btnSave.removeAttr('disabled');
            });
        }
    });
});