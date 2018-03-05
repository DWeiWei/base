jQuery(document).ready(function ($) {

//页面列表
    var pageList = $('#refund_list').bootstrapTable({
        url: "deliveryInfo", //BASE_PATH + "farm/",
        search: true,  //是否显示搜索框功能
        sidePagination: 'server',
        pagination: true,  //是否分页
        formatSearch: function () {
            return '订单编号、联系电话';
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
            if (params.data.filter == '' || params.data.filter == undefined) {
                if (params.data.search !== undefined && params.data.search != '') {
                    var aa = encodeURI('%');
                    str += '&terms[0].column=orderNo&terms[0].value=' + aa + params.data.search + aa + '&terms[0].termType=like&terms[0].type=or';
                    str += '&terms[2].column=linkTel&terms[2].value=' + aa + params.data.search + aa + '&terms[2].termType=like&terms[2].type=or';
                }
            }
            if (params.data.filter !== undefined && params.data.filter != "") {
                var resourceType = JSON.parse(params.data.filter).resourceType;

                str += '&terms[1].column=resourceType&terms[1].value=' + resourceType;
                //str += '&terms[1].column=remark&terms[1].value=' + aa + params.data.search + aa + '&terms[1].termType=like';
            }
            if (params.data.sort !== undefined && params.data.sort  != '' && params.data.order !== undefined && params.data.order != '') {
                str += '&sorts[0].name=' + params.data.sort + '&sorts[0].order=' + params.data.order;
            }else {
                str += '&sorts[0].name=createTime&sorts[0].order=desc';
            }

            $.ajax({
                type: 'GET',
                url: BASE_PATH + 'deliveryInfo/',
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
                    return index+1;
                }
            }, {
                field: 'farmName',
                title: '基地名'
            },
            {
                field: 'userName',
                title: '用户名'
            }, {
                field: 'orderNo',
                title: '订单编号'
            }, {
                field: 'resourceName',
                title: '资源名'
            }, {
                field: 'resourceType',
                title: '订单种类',
                filterControl: 'select',
                formatter: function (val, row, index) {
                    if(val==1){
                        return "地块"
                    }else if(val==2){
                        return "蔬菜";
                    }else if(val==3){
                        return "果树";
                    }else if(val==4){
                        return "禽畜"
                    }

                },
            }, {
                field: 'receiver',
                title: '收货人'
            }, {
                field: 'linkTel',
                title: '联系电话'
            }, {
                field: 'address',
                title: '地址',
                formatter: function (val, row, index) {
                    var str = '';
                    if (val.length > 6) {
                        var newVal = val.substring(0, 6) + '...';
                        str = '<a href="javascript:;" style="color: black" title="' + val + '">' + newVal + '</a>';
                        return str;
                    } else {
                        str = '<a href="javascript:;" style="color: black" >' + val + '</a>';
                        return str;
                    }
                    return val;
                }
            }, {
                field: 'deliveryInfo',
                title: '配送描述',
                formatter: function (val, row, index) {
                    var str = '';
                    if (val.length > 6) {
                        var newVal = val.substring(0, 6) + '...';
                        str = '<a href="javascript:;" style="color: black" title="' + val + '">' + newVal + '</a>';
                        return str;
                    } else {
                        str = '<a href="javascript:;" style="color: black" >' + val + '</a>';
                        return str;
                    }
                    return val;

                },
                events: function (event, val, row, index) {

                }
            }
        ]

    });



























});