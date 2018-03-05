"use strict";
$(document).ready(function () {
    var sendData = null;
    // 加载列表数据
    var landPriceList = $('#landPrice_list').bootstrapTable({
        idField:'id',
        uniqueId:'id',
      //  url: BASE_PATH + "price/landPriceList",
        search: true,  //是否显示搜索框功能
        sidePagination: 'server',
        pagination: true,  //是否分页
        showRefresh: true, //是否显示刷新功能,
        pageList : [ 10, 20, 50, 100 ],
        showToggle: true,
        showColumns: true,
        formatSearch: function () {
            return '地块名称、基地名称';
        },
        ajax: function (params) {
            var param = {};
            param.pageSize = params.data.limit;
            param.pageIndex = params.data.offset / params.data.limit;
            var str = 'pageSize=' + param.pageSize + '&pageIndex=' + param.pageIndex;
            if (params.data.search !== undefined && params.data.search != '') {
                var aa = encodeURI('%');
                str += '&terms[0].column=landName&terms[0].value=' + aa + params.data.search + aa + '&terms[0].termType=like&terms[0].type=or';
                str += '&terms[0].terms[0].column=farmName&terms[0].terms[0].value=' + aa + params.data.search + aa + '&terms[0].terms[0].termType=like&terms[0].terms[0].type=or';
            }
            //默认排序
           // str += '&sorts[0].name=updateTime&sorts[0].order=asc';
           // str += '&sorts[1].name=farmName&sorts[1].order=desc';
            $.ajax({
                type: 'GET',
                url: BASE_PATH + 'price/landPriceList',
                data: str,
                dataType: 'json',
                success: function (e) {
                   // console.log(e);
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
                field: 'landName',
                title: '地块名称',
                halign:'center',
                align: 'left'
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
                field: 'price',
                title: '地块价格（元／块）',
                halign:'center',
                align: 'right',
                formatter: function (val, row, index) {
                    return val.toFixed(2);
                }
            }, {
                field: 'priceUnit',
                title: '购买单位',
                align: 'center'
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
                        button += '<button type="button" data-id="' + val + '" class="btn  btn-info btn-xs btn-set-price">设置价格</button>\n';
                    }
                    if(accessSetShelves){
                        if(row.isShelves == '1'){
                            button += '<button type="button" data-id="' + val + '" data-price="'+row.price+'" data-shelves="'+row.isShelves+'" data-title="' + row.landName + '" class="btn btn-danger btn-xs btn-set-shelves">下架</button>';
                        }else{
                            button += '<button type="button" data-id="' + val + '" data-price="'+row.price+'" data-shelves="'+row.isShelves+'" data-title="' + row.landName + '" class="btn btn-warning btn-xs btn-set-shelves">上架</button>';
                        }
                    }
                    return button;
                }
            }
        ]
    });
    //设置价格
    $("#landPrice_list").off('click', '.btn-set-price').on('click', '.btn-set-price', function () {
        $(".modal-title").html("设置价格");
        //填充表单数据
        var _this = $(this);
        var idStr = _this.data('id');
        var rowData =  $('#landPrice_list').bootstrapTable('getRowByUniqueId', idStr);
        if(rowData.isShelves == '1'){
            toastr.info("该地块已上架（请先下架）！", opts);
            return false;
        }
        $("#landPrice_modal").modal('show');
        initForm(rowData);
        sendData = rowData;
    });
    //上下架
    $('#landPrice_list').off('click', '.btn-set-shelves').on('click', '.btn-set-shelves', function() {
        var _this = $(this);
        if(_this.data('price') == '' ||_this.data('price') == 0 ||_this.data('price') == '0' ||_this.data('price') == null ){
            toastr.info("该地块未设置价格！", opts);
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
            Request.post('price/'+method+'/' + _this.data('id'), {type:'1'}, function(e) {
                if (e.success) {
                    toastr.info(infoMSG+'成功！', opts);
                    landPriceList.bootstrapTable('refresh');
                } else {
                    toastr.info(infoMSG+'失败！', opts);
                }
            },false);
        });
    });
    //提交数据
    var initSendData = function(rowData,price,priceUnit,remark) {
        var sendJosn = {
            id:  rowData.priceId,
            farmId:rowData.farmId,
            resourceId:rowData.id,
            greenhousesId:rowData.greenhousesId,
            type:'1',
            price:price,
            priceUnit:priceUnit,
            remark:remark
        }
        return sendJosn;
    }
    //重置表单
    var initForm = function(rowData) {
        var modal = $('#landPrice_modal');
        modal.data('id', rowData.id);
        landPriceValidate.resetForm();
        modal.find('#price').val(rowData.price ? rowData.price :'');
        modal.find('#priceUnit').val(rowData.priceUnit ? rowData.priceUnit:"年");
    }
    //表单验证
   var landPriceValidate = $("#landPrice_form").validate({
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
                btnSave = $('.btn-primary'),
                modal = $('#landPrice_modal'),
                id = modal.data('id'),
                price =  form.find('#price').val(),
                priceUnit = form.find('#priceUnit').val();
            btnSave.attr('disabled', true);
            var params = initSendData(sendData,price,priceUnit);
            Request.post('price/setPrice/'+id, params, function(e) {
                if (e.success) {
                    toastr.success('设置成功！');
                    modal.modal('hide');
                    landPriceList.bootstrapTable('refresh');
                } else {
                    toastr.warning('请重试');
                }
                btnSave.removeAttr('disabled');
            });
        }
    });
})