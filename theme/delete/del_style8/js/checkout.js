$(document).ready(function(){
    // 赋值数量
    var count = Cjs.url.getParamByName('count');
    $("#mun").val(count);
    $('.product_numtext').html("   ×"+count);
    // 产品
    var combo_id = Cjs.url.getParamByName('comb_id');
    $("input[name=combo_id]").val(combo_id);
    //获取套餐
    var combokey = '.combosid_'+combo_id.toString();
    //console.log(combokey);
    $(combokey).show();
    //$(combokey).show();
    // 获取属性
    var shuxing = Cjs.url.getParamByName('proto') || "";
    var shuxingArr = shuxing.split('|');
    var str = [];
    //console.log(combo_id);
    if(parseInt(combo_id) != 0){
        shuxingArr.map(function(elem, index) {
            var obj = elem.split('-');
            var goodsid = obj[0]
            var group = obj[1];
            var value = obj[2]; 
            str.push('<input type="hidden" name="attr['+ obj[0]+'-'+ obj[1] +']" value="'+ obj[2] +'">');
            $('[optionsGroup]').siblings("[goodid='"+goodsid+"'][group='"+group+"'][attrid='"+value+"']").show();
                //domgroup.find('[data-id='+value+']').show();

        });
    }else{
        shuxingArr.map(function(elem, index) {
            var obj = elem.split('-');
            //var goodsid = obj[0]
            var group = obj[0];
            var value = obj[1];
            str.push('<input type="hidden" name="attr['+obj[0] +']" value="'+ obj[1] +'">');
            $('[optionsKey][data-id="'+ value +'"]').show();
            //var domgroup = $('[optionsGroup]').siblings("[goodid='"+goodsid+"'][group='"+group+"'][attrid='"+value+"']").show();
                //domgroup.find('[data-id='+value+']').show();

        });
    }

    //
    $('input[name=payment_type]').eq(0).prop('checked', true);

    $('#form').append(str.join(''));
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
           if(json.ret){
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