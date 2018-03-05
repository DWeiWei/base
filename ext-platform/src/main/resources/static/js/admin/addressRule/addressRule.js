jQuery(document).ready(function ($) {

//页面列表
    var pageList = $('#page_list').bootstrapTable({
        url: "addressRule", //BASE_PATH + "farm/",
        search: true,  //是否显示搜索框功能
        sidePagination: 'server',
        pagination: true,  //是否分页
        formatSearch: function () {
            return '用户名、联系电话';
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
           // var se = '<button type="button" data-id="' + 'search' + '" data-title="' +'' + '" class="btn btn-primary btn-sm btn-search">+"搜索"+</button>';

            var param = {};

            param.pageSize = params.data.limit;
            param.pageIndex = params.data.offset / params.data.limit;
            var str = 'pageSize=' + param.pageSize + '&pageIndex=' + param.pageIndex;
            if(params.data.filter == undefined || params.data.filter == ""){
                if (params.data.search !== undefined && params.data.search != '') {
                    var aa = encodeURI('%');
                    str += '&terms[0].column=userName&terms[0].value=' + aa + params.data.search + aa + '&terms[0].termType=like&terms[0].type=or';
                    str += '&terms[2].column=linkTel&terms[2].value=' + aa + params.data.search + aa + '&terms[2].termType=like&terms[2].type=or';
                    //str += '&terms[1].column=remark&terms[1].value=' + aa + params.data.search + aa + '&terms[1].termType=like';
                }
            }
            if (params.data.filter !== undefined && params.data.filter != "") {
                var status =JSON.parse(params.data.filter).status;
                str += '&terms[1].column=status&terms[1].value=' + status + '&terms[1].type=or';
                //str += '&terms[1].column=remark&terms[1].value=' + aa + params.data.search + aa + '&terms[1].termType=like';
            }
           /* if (params.data.sort !== undefined && params.data.sort  != '' && params.data.order !== undefined && params.data.order != '') {
                str += '&sorts[0].name=' + params.data.sort + '&sorts[0].order=' + params.data.order;
            }else {
                str += '&sorts[0].name=createTime&sorts[0].order=desc';
            }*/

            $.ajax({
                type: 'GET',
                url: BASE_PATH + 'addressRule/',
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
                field: 'userName',
                title: '用户名'
            },{
                field: 'linkName',
                title: '收货人'
            }, {
                field: 'linkTel',
                title: '联系电话'
            }, {
                field: 'linkAddress',
                title: '地址'
            }, {
                field: 'isDefault',
                title: '是否默认' ,
                formatter: function (val, row, index) {
                    if(val=="1"){
                        return "是";
                    }else if(val=="0"){
                        return "否";
                    }
                }
            },
        ]

    });



























});