/**
 * Created by david on 2017/6/12.
 */
//用户id
var user_id = '';
$(function () {
    //用户列表
    var user_list = $('#dictionary_list').bootstrapTable({
        idField: 'id',
        uniqueId:'id',
        // url: BASE_PATH + "user/",
        search: true,  //是否显示搜索框功能
        formatSearch: function () {
            return '用户名、昵称';
        },
        sidePagination: 'server',
        pagination: true,  //是否分页
        showRefresh: true, //是否显示刷新功能
        pageList: [10, 20, 50, 100],
        showToggle: true,
        showColumns: true,
        iconSize: 'normal',
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
            $.ajax({
                type: 'GET',
                url: BASE_PATH + 'user/',
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
                title: '序号',
                halign:'center',
                formatter: function (value, row, index) {
                    return index + 1;
                }
            }, {
                field: 'username',
                title: '用户名',
                halign:'center',
                sortable: true
            }, {
                field: 'name',
                title: '昵称',
                halign:'center',
            }, {
                field: 'phone',
                title: '手机号',
                align: 'center',
                halign:'center',
            }, {
                field: 'createDate',
                title: '注册时间',
                halign:'center',
                align: 'center',
                sortable: true
            }, {
                field: 'status',
                title: '状态',
                halign:'center',
                align: 'center',
                filterControl: 'select',
                formatter: function (val, row, index) {
                    var str;
                    switch (val) {
                        case 1:
                            str = '<strong style="color:#00a65a;">正常</strong>';
                            break;
                        case 2:
                        default:
                            str = '<strong style="color:red;">禁用</strong>';
                            break;
                    }
                    return str;
                }
            }, {
                field: 'id',
                title: '操作',
                halign:'center',
                align: 'center',
                formatter: function (val, row, index) {
                    var buttons = '';
                    if (accessUpdate) {
                        buttons += '<button type="button" data-id="' + val + '" class="btn btn-default btn-xs btn-edit">修改</button>\n';
                    }
                    if (accessDelete) {
                        if (row.status == 1) {
                            buttons += '<button type="button" data-id="' + val + '" class="btn btn-danger btn-xs btn-close">禁用</button>';
                        } else {
                            buttons += '<button type="button" data-id="' + val + '" class="btn btn-success btn-xs btn-open">启用</button>';
                        }

                    }
                    return buttons;
                },
                events: function (event, val, row, index) {

                }
            }
        ],
        onDblClickRow: function (row, ele, field) {

        }

    });

});



