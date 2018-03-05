jQuery(document).ready(function ($) {

//页面列表
    var pageList = $('#refund_list').bootstrapTable({
        url: "localhost:8080/appointmentInfo", //BASE_PATH + "farm/",
       // search: true,  //是否显示搜索框功能
        sidePagination: 'server',
        pagination: true,  //是否分页
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
                    str += '&terms[0].column=name&terms[0].value=' + aa + params.data.search + aa + '&terms[0].termType=like';
                    //str += '&terms[1].column=remark&terms[1].value=' + aa + params.data.search + aa + '&terms[1].termType=like';
                }
            }
            if (params.data.filter !== undefined && params.data.filter != "") {
                var status =JSON.parse(params.data.filter).status;
                str += '&terms[1].column=status&terms[1].value=' + status;
                //str += '&terms[1].column=remark&terms[1].value=' + aa + params.data.search + aa + '&terms[1].termType=like';
            }
            if (params.data.sort !== undefined && params.data.sort  != '' && params.data.order !== undefined && params.data.order != '') {
                str += '&sorts[0].name=' + params.data.sort + '&sorts[0].order=' + params.data.order;
            }else {
                str += '&sorts[0].name=createTime&sorts[0].order=desc';
            }

            $.ajax({
                type: 'GET',
                url: BASE_PATH + 'appointmentInfo/',
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
                field: 'linkPerson',
                title: '联系人'
            },{
                field: 'farmName',
                title: '基地名称'
            },  {
                field: 'linkTel',
                title: '联系电话'
            }, {
                field: 'appointmentTime',
                title: '预约时间',
                sortable:true,
                formatter: function(val, row, index) {
                    if(val != null || val != undefined || val != ''){
                        var data = new Date(val);
                        return data.format('yyyy-MM-dd');
                    }
                }
            }, {
                field: 'createTime',
                title: '申请时间',
                sortable:true,
            }
        ]

    });



























});