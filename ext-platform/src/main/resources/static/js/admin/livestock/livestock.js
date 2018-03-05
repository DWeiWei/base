jQuery(document).ready(function ($) {

//页面列表
    var pageList = $('#page_list').bootstrapTable({
        url: "livestock",
        search: true,  //是否显示搜索框功能
        sidePagination: 'server',
        pagination: true,  //是否分页
        formatSearch: function () {
            return '禽畜名称';
        },
        showRefresh: true, //是否显示刷新功能
        showToggle: true,
        showColumns: true,
        iconSize: 'normal',
        filterShowClear:false,
        pageList : [ 10, 20, 50, 100 ],
        //toolbar: '#exampleTableEventsToolbar', 可以在table上方显示的一条工具栏，
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
            if (params.data.search !== undefined && params.data.search != '') {
                var aa = encodeURI('%');
                str += '&terms[0].column=name&terms[0].value=' + aa + params.data.search + aa + '&terms[0].termType=like&terms[0].type=or';
            }
            if (params.data.sort !== undefined && params.data.sort  != '' && params.data.order !== undefined && params.data.order != '') {
                str += '&sorts[0].name=' + params.data.sort + '&sorts[0].order=' + params.data.order;
            }else {
                str += '&sorts[0].name=createTime&sorts[0].order=desc';
            }
            $.ajax({
                type: 'GET',
                url: BASE_PATH + 'livestock',
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
                field: 'name',
                title: '蔬菜名称'
            },{
                field: 'createTime',
                title: '创建时间'
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
        $("#livestock-modal").modal({backdrop: 'static', keyboard: false}, 'show');
    });
    //编辑
    $("#page_list").off('click', '.btn-edit').on('click', '.btn-edit', function () {
        var btn = $(this);
        var id = btn.data('id');
        btn.attr('disabled', true);
        Request.get('livestock/' + id, {}, function (e) {
            if (e.success) {
                dialogFormReset(e.data, 1);
                $('#livestock-modal').modal({backdrop: 'static', keyboard: false}, 'show');
            }
            btn.removeAttr('disabled');
        });
    });
    //详情
    $("#page_list").off('click', '.btn-info').on('click', '.btn-info', function () {
        var btn = $(this);
        var id = btn.data('id');
        btn.attr('disabled', true);
        Request.get('livestock/' + id, {}, function (e) {
            if (e.success) {
                dialogFormReset(e.data, -1);
                $('#livestock-modal').modal({backdrop: 'static', keyboard: false}, 'show');
            }
            btn.removeAttr('disabled');
        });
    });

    // 删除
    $('#page_list').off('click', '.btn-del').on('click', '.btn-del', function () {
        var id = $(this).data('id');
        dialog.delete('警告', '真的要删除吗？', function () {
            Request.delete('livestock/' + id, {}, function (e) {
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
        //getAllFarm(obj);
        var fileImg = $('#image');
        var initialPreview = [], initialPreviewConfig = [];

        //销毁
        if (fileImg.data('fileinput')) {
            fileImg.fileinput('destroy');
        }

        var modal = $("#livestock-modal");
        modal.data('type', type);
        // 0 新增, 1 编辑
        var flag = type == 0 ? true : false;
        modal.data('id', (flag ? '' : obj.id));
        modal.find('#name').val(flag ? '' : obj.name);

        // 清空图片上传，销毁并重建上传控件
        modal.find('#uploaded_image').val(flag ? '' : obj.imageUrl);

        // 新增
        if (type === 0) {
            $('#name').removeAttr('disabled');
            $('#image').removeAttr('disabled');
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
                    $('#livestock-modal #uploaded_image').val( data.md5 );
                }
            }, function (event, id, index) {
                $('#livestock-modal #uploaded_image').val('');
            });

        } else if (type === 1) {//修改
            $('#name').removeAttr('disabled');
            $('#image').removeAttr('disabled');
            editor.readonly(false);
            window.editor.html(obj.info);
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
                $('#livestock-modal #uploaded_image').val(obj.imageUrl);
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
                    $('#livestock-modal #uploaded_image').val( data.md5 );
                }
            }, function (event, id, index) {
                $('#livestock-modal #uploaded_image').val('');
            });

        } else if (type === -1) {//详情
            //界面不可操作
            $('#name').attr('disabled', true);
            $('#image').attr('disabled',true);
            editor.readonly(true);
            window.editor.html(obj.info);

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
                $('#livestock-modal #uploaded_image').val(obj.imageUrl);
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
                    $('#livestock-modal #uploaded_image').val( data.md5 );
                }
            }, function (event, id, index) {
                $('#livestock-modal #uploaded_image').val('');
            });

        }
    }

    //新增或者修改校验
    $("form#livestock-form").validate({
        rules:{
            name:{required: true},
        },
        messages: {
            name: {required: "请输入禽畜名称"},
        },
        errorElement:'em',
        submitHandler: function(form){
            $(".btn-save").attr('disabled',true);
            var form = $(form);
            var image = form.find('#uploaded_image').val();
            var params = {
                'name':form.find('#name').val(),
                'info':window.editor.html(),
                'imageUrl':image
            };
            //判断图片是否上传
            if(params.imageUrl===''&&params.imageUrl.length==0){
                toastr.warning('您的图片未上传', opts)
                $(".btn-save").removeAttr('disabled');
                return false;
            }
            var requestType = $('#livestock-modal').data('type') == '0';
            var uid = $('#livestock-modal').data('id');
            var req = requestType ? Request.post : Request.put;
            req('livestock/' + (requestType ? '' : uid), params, function (e) {
                if (e.success) {
                    toastr.info('保存成功', opts);
                    $('#livestock-modal').modal('hide');

                    pageList.bootstrapTable('refresh');
                } else {
                    toastr.warning('保存失败', opts)
                    $('#livestock-modal').modal('hide');
                }
                $(".btn-save").removeAttr('disabled');
            });
        }
    });

    var defaultFileInputOpts = {
        language: 'zh', //设置语言
        uploadUrl: BASE_PATH + 'file/upload', //上传的地址
        allowedFileExtensions : ['jpg', 'png','gif'],//接收的文件后缀
        showUpload: true, //是否显示上传按钮
        showCaption: true,//是否显示标题
        showBrowse: true,
        dropZoneTitle: '请选择图片，最多一张',
        minFileCount: 0,
        maxFileCount: 1,
        overwriteInitial: false,
        validateInitialCount:true,
        initialPreviewAsData: true,
        previewClass: '',
        browseClass: "btn btn-primary" //按钮样式
    };

    var initFileInput = function (control, defaultFileInputOpts, fileuploadedCallback, filedeletedCallback) {
        control.fileinput(defaultFileInputOpts).on('filepreremove', function(event, id, index) {
            console.log('filepreremove -> ', 'id = ' + id + ', index = ' + index);
        }).on('fileremoved', function (event, id, index) {
            console.log('fileremoved -> ', 'id = ' + id + ', index = ' + index);
        }).on('filesuccessremove', function(event, data, previewId, index) {
            console.log('filesuccessremove -> ', data, 'id = ' + previewId + ', index = ' + index);
        }).on('fileuploaded', fileuploadedCallback)
            .on('filedeleted', filedeletedCallback);
    };


});

