/**
 * Created by Iysin on 2017/12/22.
 */
jQuery(document).ready(function ($) {

    // 页面列表
    var pageList = $('#page_list').bootstrapTable({
        url: BASE_PATH + "sliderShow/",
        search: true,  //是否显示搜索框功能
        sidePagination: 'server',
        pagination: true,  //是否分页
        showRefresh: true, //是否显示刷新功能
        pageList : [ 10, 20, 50, 100 ],
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
            var str = 'pageSize=' +  param.pageSize  + '&pageIndex=' + param.pageIndex;
            if (params.data.search !== undefined && params.data.search != '') {
                var aa = encodeURI('%');
                str += '&terms[0].column=title&terms[0].value=' + aa + params.data.search + aa + '&terms[0].termType=like';
                //str += '&terms[1].column=remark&terms[1].value=' + aa + params.data.search + aa + '&terms[1].termType=like';
            }
            // sorts[0].name=title&sorts[0].order=desc
            if (params.data.sort !== undefined && params.data.sort  != '' && params.data.order !== undefined && params.data.order != '') {
                str += '&sorts[0].name=' + params.data.sort + '&sorts[0].order=' + params.data.order;
            }

            $.ajax({
                type: 'GET',
                url: BASE_PATH + 'sliderShow/',
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
                field: 'title',
                title: '标题(轮播备注)',
            }, {
                field: 'type',
                title: '目标类型',
                formatter: function (val, row, index) {
                    var str;
                    switch (val) {
                        case 1:
                            str = '基地详情';
                            break;
                        case 0:
                        default:
                            str = 'HTTP';
                            break;
                    }
                    return str;
                }
            }, {
                field: 'target',
                title: '目标值'
            }, {
                field: 'gmtModify',
                title: '修改时间',
                sortable:true
            }, {
                field: 'status',
                title: '状态',
                sortable : true,
                filterControl:'select',
                formatter: function(val, row, index) {
                    var str;
                    switch (val) {
                        case 1:
                            str = '禁用';
                            break;
                        case 0:
                        default:
                            str = '启用';
                            break;
                    }
                    return str;
                }
            }, {
                field: 'id',
                title: '操作',
                align: 'center',
                width: '200px',
                formatter: function (val, row, index) {
                    var button = '';
                    if (accessUpdate) {
                        button = '<button type="button" data-id="'+val+'" class="btn btn-default btn-sm btn-edit">修改</button>\n';
                    }
                    if (accessDelete) {
                        button += '<button type="button" data-id="'+val+'" data-title="'+ row.title +'" class="btn '+ (row.status == 0 ? 'btn-danger' : 'btn-success')+' btn-sm btn-change-status">' + (row.status == 0 ? '禁用' : '启用') +'</button>\n';
                        button += '<button type="button" data-id="'+val+'" data-title="'+ row.title +'" class="btn btn-danger btn-sm btn-del">删除</button>';
                    }
                    return button;
                },
                events: function (event, val, row, index) {

                }
            }
        ],
        onDblClickRow: function(row, ele, field) {
            if (row != null && row.imageAbsUrl != null && row.imageAbsUrl != '') {
                window.open(row.imageAbsUrl, '_blank');
            }
        }
    });

    // 表单验证和提交
    $('form#rotation_form').validate({
        rules: {
            title: {required: true},
            target: {required: true}
        },
        messages: {
            title: {required: "请输入标题(备注)"},
            target: {required: "请输入目标值"},
        },
        submitHandler: function (form) {
            $(".btn-save").attr('disabled',true);
            var form = $(form);
            var modal = $('#rotation-modal');

            var requestType = modal.data('type') == '1';
            var uid = modal.data('uid');
            var req = requestType ? Request.post : Request.put;

            var imageUrl = form.find('#upload_image').val();
            if (imageUrl == null || imageUrl == '') {
                toastr.warning('提示', '还没上传轮播图呢!', function(){});
                $(".btn-save").removeAttr('disabled');
                return false;
            }

            var params = {
                'title': form.find('input[name="title"]').val(),
                'status': form.find('#status').val(),
                'type': form.find('#type').val(),
                'imageUrl': imageUrl
            };
            if(params.type==0){
                params.target=form.find('#target').val();
            }else {
                params.target=$('#farmName').val();
            }

            req('sliderShow/' + (requestType ? '' : uid), params, function(e) {
                if (e.success) {
                    toastr.info('保存成功', opts);
                    $('#rotation-modal').modal('hide');
                    pageList.bootstrapTable('refresh');
                } else {
                    toastr.warning('保存失败', opts)
                }
                $(".btn-save").removeAttr('disabled');
            });

            return false;
        }
    });

    // 按钮事件
    // 新增
    $('.btn-add').off('click').on('click', function () {
        dialogFormReset(null, 1);
        $("#rotation-modal").modal({backdrop: 'static', keyboard: false},'show');
    });
    $('#page_list').off('click', '.btn-edit').on('click', '.btn-edit', function() {
        var that = $(this);
        Request.get('sliderShow/' + that.data('id'), {}, function(e) {
            if (e.success && e.data != null) {
                dialogFormReset(e.data, 0);
                $("#rotation-modal").modal({backdrop: 'static', keyboard: false},'show');
            } else {
                dialog.alert('提示', '获取数据失败，请刷新页面后重试', function() {
                    // 自动重载
                    window.location.reload();
                });
            }
        });
    });
    $('#page_list').off('click', '.btn-change-status').on('click', '.btn-change-status', function() {
        var that = $(this);
        var type = that.hasClass('btn-danger');
        var content = '真的要' + (type ? '禁用' : '启用') + that.data('title') + ' 吗?';
        dialog.error('提示', content, function() {
            Request.put('sliderShow/' + that.data('id') + '/' + (type ? 'disable' : 'enable'), {}, function(e) {
                if (e.success) {
                    toastr.info('完成', opts);
                    type ? that.removeClass('btn-danger').addClass('btn-success').text('启用') : that.removeClass('btn-success').addClass('btn-danger').text('禁用');
                     pageList.bootstrapTable('refresh');
                } else {
                    toastr.info('失败', opts);
                }
            });
        });
    });
    $('#page_list').off('click', '.btn-del').on('click', '.btn-del', function() {
        var that = $(this);
        dialog.delete('警告', '真的要删除 ' + that.data('title') + ' 吗?', function() {
            Request.delete('sliderShow/' + that.data('id'), {}, function(e) {
                if (e.success) {
                    toastr.info('完成', opts);
                    pageList.bootstrapTable('refresh');
                } else {
                    toastr.info('失败', opts);
                }
            });
        });
    });


    // 文件上传控件
    var defaultFileInputOpts = {
        language: 'zh', //设置语言
        uploadUrl: BASE_PATH + 'file/upload', //上传的地址
        allowedFileExtensions : ['jpg', 'png','gif'],//接收的文件后缀
        showUpload: true, //是否显示上传按钮
        showCaption: true,//是否显示标题
        showBrowse: true,
        dropZoneTitle: '请选择视频封面图片，最多一张',
        minFileCount: 0,
        maxFileCount: 1,
        overwriteInitial: false,
        dropZoneEnabled: false,
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
        }).on('fileuploaded', fileuploadedCallback).on('filedeleted', filedeletedCallback);
    };


    var dialogFormReset = function(data, type) {
        var modal = $('#rotation-modal');
        var imagePortrait1 = $('#imagePortrait1');

        if (imagePortrait1.data('fileinput')) {
            imagePortrait1.fileinput('destroy');
        }

        var flag = type == 1 ? true : false;
        modal.data('type', type);
        modal.data('uid',  flag ? '' : data.id);
        modal.find('#title').val(flag ? '' : data.title);
        modal.find('#type').val(flag ? '0' : data.type);
        modal.find('#status').val(flag ? '0' : data.status);
        modal.find('#upload_image').val(flag ? '' : data.imageUrl);

        if( modal.find('#type').val()==0){//网址
            $('#farmName').attr("disabled",true);
            modal.find('#target').val(flag ? '' : data.target);
        }
        else{//基地详情
            $('#target').attr("disabled",true);
            modal.find('#farmName').val(flag ? '' : data.target);
        }
        getAllFarm(data);
        // 新增
        if (type === 1) {
            var portrait1Opts = $.extend(defaultFileInputOpts, {
                initialPreview: [],
                initialPreviewFileType: 'image',
                initialPreviewConfig: [],
                previewClass: ''});
            initFileInput(imagePortrait1, portrait1Opts,
                function(event, data, previewId, index){
                    var response = data.response;
                    if (response.success) {
                        var data = response.data;
                        // 主要是不知道什么 bug, 上传成功总是根据 refresh 次数，重复调用 fileuploaded 该回调
                        $('#rotation-modal #upload_image').val(data.md5);
                    }
                }, function (event, id, index) {
                    $('#rotation-modal #upload_image').find('input[value="' + id + '"]').remove();
                });
            imagePortrait1.trigger('change');
        } else {
            var initialPreview = [], initialPreviewConfig = [];
            // 构建 已上传图片 的显示和删除功能
            if (data.imageUrl != null && data.imageUrl != '') {
                initialPreview.push(BASE_PATH + 'file/download/' + data.imageUrl);
                initialPreviewConfig.push({
                    caption: data.imageUrl,
                    width: '120px',
                    url: BASE_PATH + 'file/delete',
                    key: data.imageUrl
                });
                $('#rotation-modal #upload_image').val(data.imageUrl);
            };
            var logoFileInputOpts = {
                allowedPreviewTypes: ['image'],
                initialPreview: initialPreview,
                initialPreviewFileType: 'image',
                initialPreviewConfig: initialPreviewConfig,
                previewClass: '',
                showUpload: false,
                showRemove: false
            };
            var portrait1Opts = $.extend({},defaultFileInputOpts, logoFileInputOpts);
            initFileInput(imagePortrait1, portrait1Opts,
                function(event, data, previewId, index){
                    var response = data.response;
                    if (response.success) {
                        var data = response.data;
                        // 主要是不知道什么 bug, 上传成功总是根据 refresh 次数，重复调用 fileuploaded 该回调
                        $('#rotation-modal #upload_image').val(data.md5);
                    }
                }, function (event, id, index) {
                    $('#rotation-modal #upload_image').val('');
                });
            imagePortrait1.trigger('change');
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
    
   $('#type').on('change',function () {
        $('#farmName').removeAttr("disabled");
        $('#target').removeAttr("disabled");
        var type = $('#type option:selected').val();
        if(type==0){
            $('#farmName').attr("disabled",true);
        }else {
            $('#target').attr("disabled",true);
        }
    })    
});