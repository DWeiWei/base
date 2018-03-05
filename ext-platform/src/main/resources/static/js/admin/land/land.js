jQuery(document).ready(function ($) {

//页面列表
    var pageList = $('#page_list').bootstrapTable({
        url: "land",
        search: true,  //是否显示搜索框功能
        sidePagination: 'server',
        pagination: true,  //是否分页
        formatSearch: function () {
            return '地块、基地、大棚';
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
            if(params.data.filter == undefined || params.data.filter == ""){
                if (params.data.search !== undefined && params.data.search != '') {
                    var aa = encodeURI('%');
                    str += '&terms[0].column=name&terms[0].value=' + aa + params.data.search + aa + '&terms[0].termType=like&terms[0].type=or';
                    str += '&terms[0].terms[0].column=farmName&terms[0].terms[0].value=' + aa + params.data.search + aa + '&terms[0].terms[0].termType=like&terms[0].terms[0].type=or';
                    str += '&terms[0].terms[1].column=greenhousesName&terms[0].terms[1].value=' + aa + params.data.search + aa + '&terms[0].terms[1].termType=like&terms[0].terms[1].type=or';
                }
            }
            if (params.data.filter !== undefined && params.data.filter != "") {
                var isClaim = JSON.parse(params.data.filter).isClaim;
                str += '&terms[1].column=isClaim&terms[1].value=' + isClaim;
            }
            if (params.data.sort !== undefined && params.data.sort  != '' && params.data.order !== undefined && params.data.order != '') {
                str += '&sorts[0].name=' + params.data.sort + '&sorts[0].order=' + params.data.order;
            }else {
                str += '&sorts[0].name=createTime&sorts[0].order=desc';
            }

            $.ajax({
                type: 'GET',
                url: BASE_PATH + 'land',
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
                title: '地块名称'
            }, {
                field: 'farmName',
                title: '基地名称'
            }, {
                field: 'greenhousesName',
                title: '大棚名称'
            }, {
                field: 'isClaim',
                title: '认领状态',
                filterControl: 'select',
                formatter:function (val, row, index) {
                    switch (val){
                        case '1':
                            return "已认领";
                            break;
                        case '0':
                            return "未认领";
                            break;
                    }
                }
            },{
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
        $("#lind-modal").modal({backdrop: 'static', keyboard: false}, 'show');
    });
    //编辑
    $("#page_list").off('click', '.btn-edit').on('click', '.btn-edit', function () {
        var btn = $(this);
        var id = btn.data('id');
        btn.attr('disabled', true);
        Request.get('land/' + id, {}, function (e) {
            if (e.success) {
                dialogFormReset(e.data, 1);
                $('#lind-modal').modal({backdrop: 'static', keyboard: false}, 'show');
            }
            btn.removeAttr('disabled');
        });
    });
    //详情
    $("#page_list").off('click', '.btn-info').on('click', '.btn-info', function () {
        var btn = $(this);
        var id = btn.data('id');
        btn.attr('disabled', true);
        Request.get('land/' + id, {}, function (e) {
            if (e.success) {
                dialogFormReset(e.data, -1);
                $('#lind-modal').modal({backdrop: 'static', keyboard: false}, 'show');
            }
            btn.removeAttr('disabled');
        });
    });

    // 删除
    $('#page_list').off('click', '.btn-del').on('click', '.btn-del', function () {
        var id = $(this).data('id');
        dialog.delete('警告', '真的要删除吗？', function () {
            Request.delete('land/' + id, {}, function (e) {
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
        $(".btn-save").removeAttr('disabled');
        getAllFarm(obj);
        $('#farmName').trigger('change');
        var fileImg = $('#image');
        var initialPreview = [], initialPreviewConfig = [];

        //销毁
        if (fileImg.data('fileinput')) {
            fileImg.fileinput('destroy');
        }
        var modal = $("#lind-modal");
        modal.data('type', type);
        // 0 新增, 1 编辑
        var flag = type == 0 ? true : false;
        modal.data('id', (flag ? '' : obj.id));
        modal.find('#name').val(flag ? '' : obj.name);
        if(!flag){
            modal.find('#farmName option:selected').text(obj.farmName);
            modal.find('#greenhousesName option:selected').text(obj.greenhousesName);
        }
        modal.find('#uploaded_image').val(flag ? '' : obj.imageUrl);

        // 新增
        if (type === 0) {
            $('#name').removeAttr('disabled');
            $('#farmName').removeAttr('disabled');
            $('#greenhousesName').removeAttr('disabled');
            $('#image').removeAttr('disabled');
            $('#isClaim').value = "0";
            editor.readonly(false);
            //初始化图文信息框
            editor.html('');

            var newFileInputOpts = {
                initialPreview: [],
                initialPreviewFileType: 'image',
                initialPreviewConfig: [],
                previewClass: '',
                minFileCount: 1,
                maxFileCount: 1
            };
            //初始化图片控件
            var fileInputOpts = $.extend({}, defaultFileInputOpts, newFileInputOpts);

            initFileInput(fileImg, fileInputOpts,function(event, data, previewId, index) {
                var response = data.response;
                if (response.success) {
                    var data = response.data;
                    $('#lind-modal #uploaded_image').val( data.md5 );
                }
            }, function (event, id, index) {
                $('#lind-modal #uploaded_image').find('input[value="' + id + '"]').remove();
            });
            fileImg.trigger('change');

        } else if (type === 1) {//修改
            $('#name').removeAttr('disabled');
            $('#farmName').removeAttr('disabled');
            $('#greenhousesName').removeAttr('disabled');
            $('#image').removeAttr('disabled');
            editor.readonly(false);
            window.editor.html(obj.info);
            greenhousesSelected(obj);
            //图片控件文件上传
            if (obj != null && obj.imageUrl != null) {
                initialPreview = [];
                initialPreviewConfig = [];
                // 构建 已上传图片 的显示和删除功能
                initialPreview.push(BASE_PATH + 'file/render/' + obj.imageUrl);
                initialPreviewConfig.push({
                    caption: obj.imageUrl,
                    width: '120px',
                    url: BASE_PATH + 'file/delete',
                    key: obj.imageUrl
                });
                $('#lind-modal #uploaded_image').val(obj.imageUrl);
            }

            var newFileInputOpts = {
                allowedPreviewTypes: ['image'],
                initialPreview: initialPreview,
                initialPreviewFileType: 'image',
                initialPreviewConfig: initialPreviewConfig,
                previewClass: ''
            };
            var fileInputOpts = $.extend({}, defaultFileInputOpts, newFileInputOpts);

            initFileInput(fileImg, fileInputOpts,function(event, data, previewId, index) {
                var response = data.response;
                if (response.success) {
                    var data = response.data;
                    $('#lind-modal #uploaded_image').val( data.md5 );
                }
            }, function (event, id, index) {
                $('#lind-modal #uploaded_image').val('');
            });
            fileImg.trigger('change');
        } else if (type === -1) {//详情
            //界面不可操作
            $('#name').attr('disabled', true);
            $('#farmName').attr('disabled', true);
            $('#greenhousesName').attr('disabled', true);
            $('#image').attr('disabled',true);
            editor.readonly(true);
            window.editor.html(obj.info);
            greenhousesSelected(obj);
            //图片控件文件上传
            if (obj != null && obj.imageUrl != null) {
                initialPreview = [];
                initialPreviewConfig = [];
                // 构建 已上传图片 的显示和删除功能
                initialPreview.push(BASE_PATH + 'file/render/' + obj.imageUrl);
                initialPreviewConfig.push({
                    caption: obj.imageUrl,
                    width: '120px',
                    url: BASE_PATH + 'file/delete',
                    key: obj.imageUrl
                });
                $('#lind-modal #uploaded_image').val(obj.imageUrl);
            }

            var newFileInputOpts = {
                allowedPreviewTypes: ['image'],
                initialPreview: initialPreview,
                initialPreviewFileType: 'image',
                initialPreviewConfig: initialPreviewConfig,
                previewClass: ''
            };
            var fileInputOpts = $.extend({}, defaultFileInputOpts, newFileInputOpts);

            initFileInput(fileImg, fileInputOpts,function(event, data, previewId, index) {
                var response = data.response;
                if (response.success) {
                    var data = response.data;
                    $('#lind-modal #uploaded_image').val( data.md5 );
                }
            }, function (event, id, index) {
                $('#lind-modal #uploaded_image').val('');
            });
            fileImg.trigger('change');
        }
    }


    //获取所有基地
    var getAllFarm = function (obj) {
        $.ajax({
            type:'GET',
            url:'farm/getAllFarm',
            async : false,
            success: function (e) {
                    var select = $('#farmName');
                    select.empty();
                    var opt='';
                    for(var i=0;i<e.data.length;i++) {
                        if(obj!=null&&obj.farmId!=null&&obj.farmName!=null){
                            if(e.data[i].id==obj.farmId){
                                opt += '<option value="'+e.data[i].id+'" selected="selected">'+e.data[i].name+'</option>';
                            }else {
                                opt += '<option value="'+e.data[i].id+'">'+e.data[i].name+'</option>';
                            }
                        }else {
                            opt += '<option value="'+e.data[i].id+'">'+e.data[i].name+'</option>';
                        }
                    }
                    select.append(opt);
            },
            error:function () {
                toastr.warning("获取基地失败，请重试", opts);
            }
        });
    }
    //设置大棚下拉框被选择值
    var greenhousesSelected = function (obj) {
        var select = $('#greenhousesName')
        var farmId = $('#farmName option:selected').val();
        select.empty();
        $.ajax({
            type:'GET',
            url:'greenhouses/selectNameByFarmId/'+farmId,
            dataType: 'json',
            async : false,
            success: function (e) {
                var select = $('#greenhousesName');
                select.empty();
                var opt='';
                for(var i=0;i<e.data.length;i++) {
                    if(obj!=null&&obj.greenhousesId!=null&&obj.greenhousesName!=null){
                        if(e.data[i].id==obj.greenhousesId){
                            opt += '<option value="'+e.data[i].id+'" selected="selected">'+e.data[i].name+'</option>';
                        }else
                        {
                            opt += '<option value="'+e.data[i].id+'">'+e.data[i].name+'</option>';
                        }
                    }else {
                        opt += '<option value="'+e.data[i].id+'">'+e.data[i].name+'</option>';
                    }

                }
                select.append(opt);
            },
            error: function (e) {
                toastr.warning("获取大棚失败，请重试", opts);
            }
        });
    }
    //基地下拉框change事件
    $('#farmName').on('change',function () {
        var farmId = $('#farmName option:selected').val();
        $.ajax({
            type:'GET',
            url:'greenhouses/selectNameByFarmId/'+farmId,
            dataType: 'json',
            async : false,
            success: function (e) {
                    var select = $('#greenhousesName');
                    select.empty();
                    var opt='';
                    for(var i=0;i<e.data.length;i++) {
                        opt += '<option value="'+e.data[i].id+'">'+e.data[i].name+'</option>';
                    }
                    select.append(opt);
            },
            error: function (e) {
                toastr.warning("获取大棚失败，请重试", opts);
            }
        });
    });

    //新增或者修改校验
    $("form#land-form").validate({
        rules:{
            name:{required: true},
            farmName:{required: true},
            greenhousesName:{required: true}
        },
        messages: {
            name: {required: "请输入地块名称"},
            farmName: {required: "请选择基地"},
            greenhousesName: {required: "请选择大棚"}
        },
        errorElement:'em',
        submitHandler: function(form){
            var form = $(form);
            var image = form.find('#uploaded_image').val();
            if(image==null || image== ''){
                toastr.warning('还没上传图片呢!', '提示', function(){});
                return false;
            }
            var params = {
                'name':form.find('#name').val(),
                'info':window.editor.html(),
                'imageUrl':image
            };
            params.farmName=$('#farmName option:selected').text();
            params.farmId=$('#farmName option:selected').val();

            params.greenhousesName=$('#greenhousesName option:selected').text();
            params.greenhousesId=$('#greenhousesName option:selected').val();
            params.isClaim = "0";

            // if(params.name==null||params.name.length<=0){
            //     toastr.warning('地块名称不能为空！', opts);
            //     return false;
            // }
            // if(params.farmName==null||params.farmName.length<=0){
            //     toastr.warning('基地名称不能为空！', opts);
            //     return false;
            // }
            var requestType = $('#lind-modal').data('type') == '0';
            var uid = $('#lind-modal').data('id');
            var req = requestType ? Request.post : Request.put;
            $(".btn-save").attr("disabled",true);
            req('land/' + (requestType ? '' : uid), params, function (e) {
                if (e.success) {
                    toastr.info('保存成功', opts);
                    $('#lind-modal').modal('hide');
                    pageList.bootstrapTable('refresh');
                } else {
                    toastr.warning('保存失败', opts)
                    $('#lind-modal').modal('hide');
                    $(".btn-save").removeAttr('disabled');
                }

            });
        }

    });


    // 文件上传控件
    var defaultFileInputOpts = {
        language: 'zh', //设置语言
        uploadUrl: BASE_PATH + 'file/upload', //上传的地址
        allowedFileExtensions : ['jpg', 'png','gif'],//接收的文件后缀
        showUpload: true, //是否显示上传按钮
        showCaption: true,//是否显示标题
        showBrowse: true,
        minFileCount: 0,
        maxFileCount: 1,
        overwriteInitial: false,
        validateInitialCount:true,
        dropZoneEnabled: false,
        initialPreviewAsData: true,
        previewClass: '',
        previewFileIcon: "<i class='glyphicon glyphicon-king'></i>",
        browseClass: "btn btn-primary", //按钮样式             previewFileIcon: "<i class='glyphicon glyphicon-king'></i>"
    };

    var initFileInput = function (control, defaultFileInputOpts, fileuploadedCallback, filedeletedCallback) {
        control.fileinput(defaultFileInputOpts).on('filepreremove', function(event, id, index) {
            console.log('filepreremove -> ', 'id = ' + id + ', index = ' + index);
        }).on('fileremoved', function (event, id, index) {
            console.log('fileremoved -> ', 'id = ' + id + ', index = ' + index);
        }).on('filesuccessremove', function(event, data, previewId, index) {
            console.log('filesuccessremove -> ', data, 'id = ' + previewId + ', index = ' + index);
        }).on('fileuploaded', fileuploadedCallback).on('filedeleted', filedeletedCallback);
    };


});

