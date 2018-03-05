jQuery(document).ready(function ($) {

//页面列表
    var pageList = $('#refund_list').bootstrapTable({
        url: "fruitTreesOrder", //BASE_PATH + "farm/",
        search: true,  //是否显示搜索框功能
        sidePagination: 'server',
        pagination: true,  //是否分页
        formatSearch: function () {
            return '订单编号、用户名';
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
                    str += '&terms[0].column=orderNo&terms[0].value=' + aa + params.data.search + aa + '&terms[0].termType=like&terms[0].type=or';
                    str += '&terms[0].terms[0].column=userName&terms[0].terms[0].value=' + aa + params.data.search + aa + '&terms[0].terms[0].termType=like&terms[0].terms[0].type=or';
                }
            }

            if (params.data.sort !== undefined && params.data.sort  != '' && params.data.order !== undefined && params.data.order != '') {
                str += '&sorts[0].name=' + params.data.sort + '&sorts[0].order=' + params.data.order;
            }

            $.ajax({
                type: 'GET',
                url: 'fruitTreesOrder',
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
                title: 'ID',
                formatter: function (value, row, index) {
                    return index+1;
                }
            }, {
                field: 'orderNo',
                title: '订单编号'
            },
            {
                field: 'userName',
                title: '用户名'
            }, {
                field: 'farmName',
                title: '基地名称'
            },{
                field: 'name',
                title: '果树名称'
            },{
                field: 'amount',
                title: '数量'
            }, {
                field: 'acount',
                title: '成交总价(元)'
            }, {
                field: 'dealDate',
                title: '成交时间',
                sortable:true,
                events: function (event, val, row, index) {

                }
            }
        ]

    });



























});