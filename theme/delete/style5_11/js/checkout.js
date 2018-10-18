$(document).ready(function(){
    // 赋值数量
    var count = Cjs.url.getParamByName('count');
    $("#mun").val(count);
    // 产品
    var combo_id = Cjs.url.getParamByName('comb_id');
    $("input[name=combo_id]").val(combo_id);
    // 隐藏其他套餐的产品
    $('#selectedProducts li').filter('[data-comboId='+combo_id+']').show();
    $('.cnt .combosid_'+combo_id).show();
    // 支付方式
    $('input[name=payment_type]').eq(0).prop('checked', true);

    // 获取属性
    var shuxing = Cjs.url.getParamByName('proto') || "";
    var shuxingArr = shuxing.split('|');
    shuxingArr.map(function(elem, index) {
        var obj = elem.split('-')
        var key = obj[0];
        var value = obj[1];
        $("input[name='attr["+key.replace('*','-')+"]']").val(value);
        var domgroup = $('[optionsGroup]').filter("[data-id='"+key+"']")
            domgroup.find('[data-id='+value+']').show();
        // 如果有套餐产品则显示下面
        $('#selectedProducts').find("[data-optionsGroup='"+key+"'][data-id='"+value+"']").show();
    });
    // 删除没有选的属性
    $('.selectedPrototype input').filter('[value=""]').remove();
    // 如果属性有图则替换
    $('#selectedProducts li:visible .forAttrImg').map(function(index, item){
        var self = $(item);
        console.log(self)
        var next = self.next().find('span[attrimg]');
            next.map(function(index, item){
                if( $(item).attr("attrimg") != "" && $(item).is(":visible") ){
                    self.attr('src', $(item).attr('attrimg'));
                }
            });
    });
    // 刷新价格
    refresh_price();
}) ;

$('.combo').click(function () {
    refresh_price();
}) ;

function addnumber(){
    $('#mun').val(parseInt($('#mun').val())+1);
    refresh_price() ;
}
function minnumber(){
    if($('#mun').val()>1){
        $('#mun').val(parseInt($('#mun').val())-1);
        refresh_price() ;
    }
}
    
function refresh_price() {
    $.ajax({
        url: '/checkout.php?',
        type: 'post',
        data: $('input[name=combo_id], #act, input[name=\'num\']'),
        dataType: 'json',
        success: function(json) {
           if(json.ret)
           {
                $('combprice').html(json.price);
                $("#price").html(json.total);
              $("input[name='price']").val(json.total);
           }
           else{
               alert(json.msg)
           }
        },
        error: function(xhr, ajaxOptions, thrownError) {
        }
    });
}

var _region = $("#_region").val();
function postcheck(){

    try{
        if (document.form.name.value==""){
            alert('請填寫姓名！');
            document.form.name.focus();
            return false;
        }
        var name = /^[a-zA-Z\u4e00-\u9fa5\s]{2,}$/;
        if (!name.test(document.form.name.value)){
            alert('姓名格式不正確，請重新填寫！');
            document.form.name.focus();
            return false;
        }
    }
    catch(ex){
    }
    try{
        // if (document.form.email.value==""){
        //     alert('請填寫郵箱地址！');
        //     document.form.email.focus();
        //     return false;
        // }
        // if (!/^([a-zA-Z0-9_-]|.)+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(document.form.email.value)) {
        //     alert('郵箱格式不正確，請重新填寫！');
        //     document.form.email.focus();
        //     return false;
        // }
    }
    catch(ex){
    }
    try{
        if (document.form.mob.value==""){
            alert('請填寫手機號碼！');
            document.form.mob.focus();
            return false;
        }
        switch(_region){
            case "台灣":
                if (/^09/.test(document.form.mob.value) && !/^\d{10}$/.test(document.form.mob.value)) {
                    alert('手機號碼格式不正確，請重新填寫！');
                    document.form.mob.focus();
                    return false;
                }
                if (!/^0\d{6,10}/.test(document.form.mob.value)) {
                    alert('手機號碼格式不正確，請重新填寫！');
                    document.form.mob.focus();
                    return false;
                }
                break;
            case "香港":

                break;
        }
    }
    catch(ex){
    }
    try{
        if (document.form.province.value==""){
            alert('请选择所在地区！');
            document.form.province.focus();
            return false;
        }
    }
    catch(ex){
    }
    try{
        if (document.form.address.value==""){
            alert('请填写详细地址！');
            document.form.address.focus();
            return false;
        }
    }
    catch(ex){
    }   
    return true;
}