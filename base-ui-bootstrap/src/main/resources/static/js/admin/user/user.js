/**
 * Created by david on 2017/6/12.
 */
//用户id
var user_id = '';
$(function () {
    //用户列表
    var user_list = $('#user_list').bootstrapTable({
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
            if (params.data.filter == undefined || params.data.filter == '') {
                if (params.data.search !== undefined && params.data.search != '') {
                    var aa = encodeURI('%');
                    str += '&terms[0].column=username&terms[0].value=' + aa + params.data.search + aa + '&terms[0].termType=like&terms[0].type=or';
                    str += '&terms[1].column=name&terms[1].value=' + aa + params.data.search + aa + '&terms[1].termType=like&terms[1].type=or';

                }
            }
            if (params.data.sort !== undefined && params.data.sort != '' && params.data.order !== undefined && params.data.order != '') {
                str += '&sorts[0].name=' + params.data.sort + '&sorts[0].order=' + params.data.order;
            }
            if (params.data.filter !== undefined && params.data.filter != "") {
                var status = JSON.parse(params.data.filter).status;
                str += '&terms[2].column=status&terms[2].value=' + status;
            }

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
    //角色列表
    $('#role_list').DataTable({
        "language": lang,
        "paging": false,
        "lengthChange": true,
        "searching": false,
        "ordering": false,
        "info": false,
        "autoWidth": false,
        "bStateSave": true,
        "serverSide": true,
        "sPaginationType": "full_numbers",
        "singleSelect": true,
        "ajax": function (data, callback, settings) {
            $.ajax({
                url: BASE_PATH + "role?paging=false",
                type: "GET",
                cache: false,
                dataType: "json",
                success: function (result) {

                    console.log(result);

                    var resultData = [];
                    resultData.draw = data.draw;
                    resultData.recordsTotal = result.total;
                    resultData.recordsFiltered = result.total;
                    resultData.data = result;
                    callback(resultData);
                },
                error: function (jqXhr) {
                    toastr.warning("请求列表数据失败, 请重试");
                }
            });
        },
        columns: [
            {
                "sClass": "text-center",
                "data": "id",
                "render": function (data, type, full, meta) {
                    return '<input  type="checkbox" name="userRoles" class="checkchild"  value="' + data + '" />';
                },
                "bSortable": false
            },
            {"data": "id"},
            {"data": "name"},
            {"data": "remark"}
        ]
    });
    //全选复选框
    $(".checkall").click(function () {
        var check = $(this).prop("checked");
        $(".checkchild").prop("checked", check);

    });

    /* 数组转json
     * @param array 数组
     * @param type 类型 json array
     */
    function formatArray(array, type) {
        var dataArray = {};
        $.each(array, function () {
            if (dataArray[this.name]) {
                if (!dataArray[this.name].push) {
                    dataArray[this.name] = [dataArray[this.name]];
                }
                dataArray[this.name].push(this.value || '');
            } else {
                dataArray[this.name] = this.value || '';
            }
        });
        return ((type == "json") ? JSON.stringify(dataArray) : dataArray);
    }

    jQuery.validator.addMethod("telphoneValid", function (value, element) {
        var tel = /^(13|14|15|17|18)\d{9}$/;
        return tel.test(value) || this.optional(element);
    }, "请输入正确的手机号码");


    //新增或修改用户验证
    $("form#user_form").validate({
        rules: {
            username: {required: true},
            password: {required: true},
            email: {required: true, email: true},
            phone: {required: true, telphoneValid: true}
        },
        messages: {
            username: {required: "请输入用户名."},
            password: {required: "请输入密码"},
            email: {required: "请输入 E-Mail 地址", email: "请输入正确的 E-Mail 地址"},
            phone: {required: "请输入手机号码", telphoneValid: "请输入正确的手机号码"}
        },
        submitHandler: function (form) {

            //提交数据
            var data = $("#user_form").serializeArray();
            var roles = new Array();
            for (var item in data) {
                if (data[item]["name"] == "userRoles") {
                    roles.push({roleId: data[item]["value"]});
                    delete data[item];
                }

            }
            data.push({name: "userRoles", value: roles});
            var dataJson = formatArray(data, "json");
            console.log(dataJson);
            if (user_id == '') {
                var api = "user/";
                // ajax
                toastr.info("提交中...");
                $('button[type="submit"]').attr('disabled', true);
                Request.post(api, dataJson, function (e) {
                    console.log(e);
                    $('button[type="submit"]').attr('disabled', false);
                    if (e.success) {
                        toastr.info("新增用户成功");
                        $("#modal-add").modal('hide');
                        user_list.bootstrapTable('refresh');
                    }
                    else {
                        toastr.error(e.message);
                    }

                });
            }
            else {
                var api = "user/" + user_id;
                // ajax
                toastr.info("修改中...");
                $('button[type="submit"]').attr('disabled', true);
                Request.put(api, dataJson, function (e) {
                    console.log(e);
                    $('button[type="submit"]').attr('disabled', false);

                    if (e.success) {
                        toastr.info("修改用户成功");
                        $("#modal-add").modal('hide');
                        user_list.bootstrapTable('refresh');

                    }
                    else {
                        toastr.error(e.message);
                    }

                });
            }
        }
    });
    //新增用户弹出操作
    $(".box-tools").off('click', '.btn-add').on('click', '.btn-add', function () {
        user_id = '';
        $(".modal-title").html("新增用户");
        $("#modal-add").modal('show');
        clearData();
    });

    //编辑用户弹出操作
    $("#user_list").off('click', '.btn-edit').on('click', '.btn-edit', function () {
        var that = $(this);
        var id = that.data('id');
        user_id = id;
        $(".modal-title").html("编辑用户");
        $("#modal-add").modal('show');
        clearData();
        //加载编辑数据
        Request.get("user/" + id, {}, function (e) {
            if (e.success) {
                e.data.password = "$default";
                var data = e.data;
                $("input#username").val(data.username);
                $("input#password").val(data.password);
                $("input#name").val(data.name);
                $("input#phone").val(data.phone);
                $("input#email").val(data.email);
                var roles = [];
                for (var i = 0; i < data.userRoles.length; i++) {
                    roles.push(data.userRoles[i]["roleId"])
                }
                var checkchilds = $("input.checkchild");
                for (var i = 0; i < checkchilds.length; i++) {
                    if (contains(roles, checkchilds[i].value)) {
                        checkchilds[i].checked = true;
                    }

                }

            }
        });

    });
    //用户禁用
    $("#user_list").off('click', '.btn-close').on('click', '.btn-close', function () {
        var that = $(this);
        var id = that.data('id');
        user_id = id;
        $("#modal-delete").modal('show');

    });
    $("#modal-delete").off('click', '.btn-close-sure').on('click', '.btn-close-sure', function () {
        var id = user_id;
        toastr.info("注销中...");
        Request.put("user/" + id + "/disable", {}, function (e) {
            if (e.success) {
                toastr.info("注销成功!");
                user_list.bootstrapTable('refresh');
            } else {
                toastr.error(e.message);
            }
        });
    });
    //用户启用
    $("#user_list").off('click', '.btn-open').on('click', '.btn-open', function () {
        var that = $(this);
        var id = that.data('id');
        toastr.info("启用中...");
        Request.put("user/" + id + "/enable", {}, function (e) {
            if (e.success) {
                toastr.info("启用成功!");
                user_list.bootstrapTable('refresh');
            } else {
                toastr.error(e.message);
            }
        });
    });

    //表单数据清空
    function clearData() {
        $("input#username").val("");
        $("input#password").val("");
        $("input#name").val("");
        $("input#phone").val("");
        $("input#email").val("");
        $("input.checkchild").prop("checked", false);
    }

    //数组是否存在元素
    function contains(arr, obj) {
        var i = arr.length;
        while (i--) {
            if (arr[i] === obj) {
                return true;
            }
        }
        return false;
    }

    //复选框单选
    $("#role_list").off('click', '.checkchild').on('click', '.checkchild', function () {
        if ($(this).is(':checked'))
            $(this).parents('tr').siblings().find('.checkchild').prop("checked", false);
    })


});



