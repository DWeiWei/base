"use strict";
$(document).ready(function () {
    var sendData = null,
        RESOURCE_TYPE = '4';//蔬菜类型
// 加载列表数据
    var livestockPriceList = $('#livestockPrice_list').bootstrapTable({
        idField:'id',
        uniqueId:'id',
        //  url: BASE_PATH + "price/livestockPriceList",
        search: true,  //是否显示搜索框功能
        sidePagination: 'server',
        pagination: true,  //是否分页
        showRefresh: true, //是否显示刷新功能
        pageList : [ 10, 20, 50, 100 ],
        showToggle: true,
        showColumns: true,
        formatSearch: function () {
            return '禽畜名称、基地名称';
        },
        ajax: function (params) {
            var param = {};
            param.pageSize = params.data.limit;
            param.pageIndex = params.data.offset / params.data.limit;
            var str = 'pageSize=' + param.pageSize + '&pageIndex=' + param.pageIndex;
            if (params.data.search !== undefined && params.data.search != '') {
                var aa = encodeURI('%');
                str += '&terms[0].column=livestockName&terms[0].value=' + aa + params.data.search + aa + '&terms[0].termType=like&terms[1].type=or';
                str += '&terms[0].terms[0].column=farmName&terms[0].terms[0].value=' + aa + params.data.search + aa + '&terms[0].terms[0].termType=like&terms[0].terms[0].type=or';
            }
            //默认排序
            //str += '&sorts[0].name=updateTime&sorts[0].order=desc';
            $.ajax({
                type: 'GET',
                url: BASE_PATH + 'price/'+RESOURCE_TYPE+'/resourcesPriceList',
                data: str,
                dataType: 'json',
                success: function (e) {
                    console.log(e);
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
                field: 'livestockName',
                title: '禽畜名称',
                halign:'center',
                align: 'left'
            }, {
                field: 'farmName',
                title: '所属基地',
                halign:'center',
                align: 'left'
            }, {
                field: 'price',
                title: '禽畜价格（元）',
                halign:'center',
                align: 'right',
                formatter: function (val, row, index) {
                    return val.toFixed(2);
                }
            },
            {
                field: 'priceUnit',
                title: '购买单位',
                halign:'center',
                align: 'right'
            },{
                field: 'remark',
                title: '备注',
                align: 'left'
            }, {
                field: 'updateTime',
                title: '修改时间',
                align: 'center'
            }, {
                field: 'id',
                title: '操作',
                align: 'center',
                formatter: function (val, row, index) {
                    var button = "";
                    if(accessSetPrice){//判断是否有设置价格权限
                        button = '<button type="button" data-id="' + val + '" class="btn btn-info btn-xs btn-set-price">设置价格</button>\n';
                    }
                    if(accessSetShelves){
                        if(row.isShelves == '1'){
                            button += '<button type="button" data-id="' + val + '" data-price="'+row.price+'" data-shelves="'+row.isShelves+'" data-title="' + row.livestockName + '" class="btn btn-danger btn-xs btn-set-shelves">下架</button>';
                        }else{
                            button += '<button type="button" data-id="' + val + '" data-price="'+row.price+'" data-shelves="'+row.isShelves+'" data-title="' + row.livestockName + '" class="btn btn-warning btn-xs btn-set-shelves">上架</button>';
                        }
                    }
                    return button;
                }
            }
        ]
    });
    //设置价格
    $("#livestockPrice_list").off('click', '.btn-set-price').on('click', '.btn-set-price', function () {
        $(".modal-title").html("设置价格");
        //填充表单数据
        var _this = $(this);
        var idStr = _this.data('id');
        var rowData =  $('#livestockPrice_list').bootstrapTable('getRowByUniqueId', idStr);
        if(rowData.isShelves == '1'){
            toastr.info("该禽畜已上架（请先下架）！", opts);
            return false;
        }
        $("#livestockPrice_modal").modal('show');
        initForm(rowData);
        sendData = rowData;
    });
    //上下架
    $('#livestockPrice_list').off('click', '.btn-set-shelves').on('click', '.btn-set-shelves', function() {
        var _this = $(this);
        if(_this.data('price') == '' ||_this.data('price') == 0 ||_this.data('price') == '0' ||_this.data('price') == null ){
            toastr.info("该禽畜未设置价格！", opts);
            return false;
        }
        var shelves =  _this.data('shelves'),
            infoMSG = '*****',
            method = '';
        if(shelves == '1'){
            infoMSG = '下架';
            method = 'downShelves';
        }else{
            infoMSG = '上架';
            method = 'upShelves';
        }
        dialog.confirm('确认', '确认' + infoMSG + _this.data('title') + ' 吗?', function() {
            Request.post('price/'+method+ '/'+ _this.data('id'), {type:'4'}, function(e) {
                if (e.success) {
                    toastr.info(infoMSG+'成功！', opts);
                    livestockPriceList.bootstrapTable('refresh');
                } else {
                    toastr.info(infoMSG+'失败！', opts);
                }
            },false);
        });
    });
    //提交数据
    var initSendData = function(rowData,formData) {
        var sendJosn = {
            id:  rowData.priceId,
            farmId:rowData.farmId,
            resourceId:rowData.id,
            type:RESOURCE_TYPE,
            price:formData.price,
            priceUnit:formData.priceUnit,
            remark:formData.remark
        }
        return sendJosn
    }
    //重置表单
    var initForm = function(rowData) {
        var modal = $('#livestockPrice_modal');
        modal.data('id', rowData.id);
        livestockPriceValidate.resetForm();
        modal.find('#price').val(rowData.price ? rowData.price :'');
        modal.find('#priceUnit').val(rowData.priceUnit ? rowData.priceUnit:"只");
        modal.find('#remark').val(rowData.remark ? rowData.remark:"");

    }
    //表单验证
    var livestockPriceValidate = $("#livestockPrice_form").validate({
        rules: {
            price: {required: true},
            priceUnit:{required: true}
        },
        messages: {
            price: {required: "请输入价格"},
            priceUnit:{required:"请选择购买单位"}
        },
        submitHandler: function (form) {
            var form = $(form),
                modal = $('#livestockPrice_modal'),
                btnSave = $('.btn-primary'),
                id = modal.data('id'),
                price =  form.find('#price').val(),
                priceUnit = form.find('#priceUnit').val(),
                remark = form.find('#remark').val();
            btnSave.attr('disabled', true);
            var formData = {price:price,remark:remark,priceUnit:priceUnit};
            var params = initSendData(sendData,formData);
            Request.post('price/setPrice/'+id, params, function(e) {
                if (e.success) {
                    toastr.success('处理完成');
                    modal.modal('hide');
                    livestockPriceList.bootstrapTable('refresh');
                } else {
                    toastr.warning('请重试');
                }
                btnSave.removeAttr('disabled');
            });
        }
    });
})