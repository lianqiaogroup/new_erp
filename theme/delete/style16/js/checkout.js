require(['jquery', 'widget'], function ($){
    window.widget.repeatOrder.init();
    window.widget.repeatOrder.getproattr();
    // sms open check
    window.widget.smsvalid && window.widget.smsvalid.init();

});

$(document).ready(function(){
    // 赋值数量
    var count = Cjs.url.getParamByName('count');
    $("#mun").val(count);
    // 产品
    var combo_id = Cjs.url.getParamByName('combo_id');
    $("input[name=combo_id]").val(combo_id);
    // 隐藏其他套餐的产品
    // $('#selectedProducts li').not('[data-comboId='+combo_id+']').hide();
    $('#selectedProducts li').filter('[data-comboId='+combo_id+']').show();
    // 支付方式
    $('input[name=payment_type]').eq(0).prop('checked', true);

    // 获取属性
    var shuxing = Cjs.url.getParamByName('proto') || "";
    var shuxingArr = shuxing.split('|');
    if(parseInt(combo_id) == 0){
        shuxingArr.map(function(elem, index) {
            var obj = elem.split('-')
            var key = obj[0];
            var value = obj[1];

            $("input[name='attr["+key+"]']").val(value);
            var domgroup = $('[optionsGroup]').filter("[data-id='"+key+"']")
                domgroup.find('[data-id='+value+']').show();
            // 如果有套餐产品则显示下面
            $('#selectedProducts').find("[data-optionsGroup='"+key+"'][data-id='"+value+"']").show();
        });
    }else{
        shuxingArr.map(function(elem, index) {
            var obj = elem.split('-')
            var key = obj[0];
            var groud = obj[1];
            var value = obj[2];
            $("input[name='attr["+key+"-"+groud+"]']").val(value);
            var domgroup = $('[optionsGroup]').filter("[data-id='"+key+"-"+groud+"']")
                domgroup.find('[data-id='+value+']').show();
            // 如果有套餐产品则显示下面
            $('#selectedProducts').find("[data-optionsGroup='"+key+"-"+groud+"'][data-id='"+value+"']").show();
        });
    }
    // 删除没有选的属性
    $('.selectedPrototype input').filter('[value=""]').remove();
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