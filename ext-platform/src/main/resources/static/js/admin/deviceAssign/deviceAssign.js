"use strict";
$(document).ready(function () {
    //土地设备列表
    var devicelandList = $('#device_land_list').bootstrapTable({
        idField:'id',
        uniqueId:'id',
        search: true,  //是否显示搜索框功能
        sidePagination: 'server',
        pagination: true,  //是否分页
        showRefresh: true, //是否显示刷新功能
        pageList : [ 10, 20, 50, 100 ],
        showToggle: true,
        showColumns: true,
        formatSearch: function () {
            return '设备编号、地块名称';
        },
        ajax: function (params) {
            var param = {};
            param.pageSize = params.data.limit;
            param.pageIndex = params.data.offset / params.data.limit;
            var str = 'pageSize=' + param.pageSize + '&pageIndex=' + param.pageIndex;
            if (params.data.search !== undefined && params.data.search != '') {
                var aa = encodeURI('%');
                str += '&terms[0].column=no&terms[0].value=' + aa + params.data.search + aa + '&terms[0].termType=like&terms[0].type=or';
                str += '&terms[1].column=landName&terms[1].value=' + aa + params.data.search + aa + '&terms[1].termType=like&terms[1].type=or';
            }
            //默认排序
            str += '&sorts[0].name=createTime&sorts[0].order=desc';
            $.ajax({
                type: 'GET',
                url: BASE_PATH + 'deviceAssign/1/deviceList',
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
                field: 'no',
                title: '设备编号',
                halign:'center'
            }, {
                field: 'farmName',
                title: '所属基地',
                halign:'center',
                align: 'left'
            }, {
                field: 'greenhousesName',
                title: '所属大棚',
                halign:'center',
                align: 'left'
            }, {
                field: 'landName',
                title: '地块名称',
                halign:'center',
                align: 'left'
            }, {
                field: 'createTime',
                title: '创建时间',
                align: 'center'
            }, {
                field: 'id',
                title: '操作',
                align: 'center',
                formatter: function (val, row, index) {
                    var button = "";
                    if(accessMonitor){
                        button = button + '<button type="button" data-id="' + val + '" data-table="device_land_list" class="btn btn-info btn-xs btn-monitor">监控</button>';
                    }
                    return button;
                }
            }
        ]
    });
    //果树设备列表
    var deviceFruitTreesList = $('#device_fruit_trees_list').bootstrapTable({
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
            return '设备编号、果树名称';
        },
        ajax: function (params) {
            var param = {};
            param.pageSize = params.data.limit;
            param.pageIndex = params.data.offset / params.data.limit;
            var str = 'pageSize=' + param.pageSize + '&pageIndex=' + param.pageIndex;
            if (params.data.search !== undefined && params.data.search != '') {
                var aa = encodeURI('%');
                str += '&terms[0].column=no&terms[0].value=' + aa + params.data.search + aa + '&terms[0].termType=like&terms[0].type=or';
                str += '&terms[1].column=fruitTreesName&terms[1].value=' + aa + params.data.search + aa + '&terms[1].termType=like&terms[1].type=or';
            }
            //默认排序
            str += '&sorts[0].name=createTime&sorts[0].order=desc';
            $.ajax({
                type: 'GET',
                url: BASE_PATH + 'deviceAssign/3/deviceList',
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
                field: 'no',
                title: '设备编号',
                halign:'center'
            }, {
                field: 'farmName',
                title: '所属基地',
                halign:'center',
                align: 'left'
            }, {
                field: 'fruitTreesName',
                title: '果树名称',
                halign:'center',
                align: 'left'
            },  {
                field: 'createTime',
                title: '创建时间',
                align: 'center'
            }, {
                field: 'id',
                title: '操作',
                align: 'center',
                formatter: function (val, row, index) {
                    var button = "";
                    if(accessMonitor){
                        button = button + '<button type="button" data-id="' + val + '" data-table="device_fruit_trees_list" class="btn btn-info btn-xs btn-monitor">监控</button>';
                    }
                    return button;
                }
            }
        ]
    });
    //禽畜设备列表
    var deviceLivestockList = $('#device_livestock_list').bootstrapTable({
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
            return '设备编号、禽畜名称';
        },
        ajax: function (params) {
            var param = {};
            param.pageSize = params.data.limit;
            param.pageIndex = params.data.offset / params.data.limit;
            var str = 'pageSize=' + param.pageSize + '&pageIndex=' + param.pageIndex;
            if (params.data.search !== undefined && params.data.search != '') {
                var aa = encodeURI('%');
                str += '&terms[0].column=no&terms[0].value=' + aa + params.data.search + aa + '&terms[0].termType=like&terms[0].type=or';
                str += '&terms[1].column=livestockName&terms[1].value=' + aa + params.data.search + aa + '&terms[1].termType=like&terms[1].type=or';
            }
            //默认排序
            str += '&sorts[0].name=createTime&sorts[0].order=desc';
            $.ajax({
                type: 'GET',
                url: BASE_PATH + 'deviceAssign/4/deviceList',
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
                field: 'no',
                title: '设备编号',
                halign:'center'
            }, {
                field: 'farmName',
                title: '所属基地',
                halign:'center',
                align: 'left'
            }, {
                field: 'livestockName',
                title: '禽畜名称',
                halign:'center',
                align: 'left'
            },  {
                field: 'createTime',
                title: '创建时间',
                align: 'center'
            }, {
                field: 'id',
                title: '操作',
                align: 'center',
                formatter: function (val, row, index) {
                    var button = "";
                    if(accessMonitor){
                        button = button + '<button type="button" data-id="' + val + '" data-table="device_livestock_list" class="btn btn-info btn-xs btn-monitor">监控</button>';
                    }
                    return button;
                }
            }
        ]
    });

    // 监控
    $('#tab_assign').off('click', '.btn-monitor').on('click', '.btn-monitor', function() {
        $('#monitor_info').empty();
        var _this = $(this);
        var idStr = _this.data('id'),
            table=_this.data('table');
        var rowData =   $('#'+table).bootstrapTable('getRowByUniqueId', idStr);
        //清空表单
        $("#monitor_modal").modal({backdrop: 'static', keyboard: false}, 'show');
        $.ajax({
            type: 'GET',
            url:BASE_PATH + 'deviceAssign/monitor', //BASE_PATH + 'farm/',
            data:{no:rowData.no},
            dataType: 'json',
            async : false,
            success: function (e) {
                if(e.success){
                    if(e.data !=null && e.data.length > 0){
                        var htmlStr = buildMonitor(e.data);
                        $('#monitor_info').html(htmlStr);
                    }else{
                        $('#monitor_info').html('<div class="col-xs-6 col-md-12">暂无监控信息！</div>');
                    }
                }
            },
            error: function (e) {
                toastr.warning("获取监控败，请重试", opts);
            }
        });
    });

    function buildMonitor(data) {
        var htmlStr = [];
        for(var i=0 ; i<data.length; i++){
            htmlStr.push('<div class="col-xs-6 col-md-3">' +
                '<a href="javascript:void(0);" class="thumbnail">' +
                '<img src="'+data[i]+'" alt=""/>' +
                '</a></div>');
        }
        return htmlStr.join('');
    }
});
