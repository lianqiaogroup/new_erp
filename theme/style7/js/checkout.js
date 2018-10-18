$(document).ready(function(){
    // 赋值数量
    var count = Cjs.url.getParamByName('count');
    $("#num").val(count);
    // 产品
    var combo_id = Cjs.url.getParamByName('comb_id');
    $("input[name=combo_id]").val(combo_id);
    // 获取属性
    var shuxing = Cjs.url.getParamByName('proto') || "";
    var shuxingArr = shuxing.split('|');
    if(combo_id == 0){
        shuxingArr.map(function(elem, index) {
            var obj = elem.split('-')
            var key = obj[0];
            var value = obj[1];
            $("input[name='attr["+key+"]']").val(value);
            var domgroup = $('[optionsGroup]').filter("[data-id="+key+"]")
                domgroup.find('[data-id='+value+']').show();
        });
    }else{
        shuxingArr.map(function(elem, index) {
            var obj = elem.split('-');
            var goods = obj[0];
            var key = obj[1];
            var value = obj[2];
            $('#good_'+goods).show();
            //$("input[name='attr["+goods+"-"+key+"]']").val(value);
            $('#form').append("<input type='hidden' name='attr["+goods+"-"+key+"]' value='"+ value +"'>");
            var domgroup = $('[optionsGroup]').filter("[data-id="+goods+"-"+key+"]");
                domgroup.find('[data-id='+value+']').show();
        });
    }
    // 刷新价格
    refresh_price();
}) ;

$('.combo').click(function () {
    refresh_price();
}) ;

function addnumber(){
    $('#num').val(parseInt($('#num').val())+1);
    refresh_price() ;
}
function minnumber(){
    if($('#num').val()>1){
        $('#num').val(parseInt($('#num').val())-1);
        refresh_price() ;
    }
}
    
function refresh_price() {
    $('[render=num]').html($('#num').val());
    $.ajax({
        url: '/checkout.php?',
        type: 'post',
        data: $('input[name=combo_id], #act, input[name=\'num\']'),
        dataType: 'json',
        success: function(json) {
           if(json.ret)
           {
                $('[render="price"]').html(moneyFormat(json.price));
                $('[render="total"]').html(moneyFormat(json.total));
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

    var paymethod = $('[name="payment_type"]');
    if( paymethod.val() === "" ){
        alert(paymethod.attr('alt'));
        paymethod.focus();
        return false;
    }
    return true;
}


function moneyFormat(input) {
    var number = new Number(input);
    var str = number.toString();
    var newstr = str.replace(/\d{1,3}(?=(\d{3})+$)/g,function(s){
        return s+','
    });
    return newstr;
}

