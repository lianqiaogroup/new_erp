require(['jquery', 'widget'], function ($){
    window.widget.repeatOrder.init();
    window.widget.repeatOrder.getproattr();
    // sms open check
    window.widget.smsvalid && window.widget.smsvalid.init();//短信验证

});

$(document).ready(function(){
    // 赋值数量
    var count = Cjs.url.getParamByName('count');
    $("#mun").val(count);
    $('.product_numtext').each(function(){
        var num = $(this).parent().attr('data-num')*count;
        $(this).html("   ×"+num);
    })
    // 产品
    var combo_id = Cjs.url.getParamByName('combo_id');
    $("input[name=combo_id]").val(combo_id);
    var product_id = Cjs.url.getParamByName('product_id');
    $("input[name=product_id]").val(product_id);
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
    if(shuxing){
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
    }
    //
    $('input[name=payment_type]').eq(0).next().addClass('check');
    $('input[name=payment_type]').eq(0).prop('checked', true);

    $('#form').append(str.join(''));
    // 刷新价格
    refresh_price();
});
function refresh_price() {

    $.ajax({
        url: '/checkout.php?',
        type: 'post',
        data: $('input[name=combo_id], #act, input[name=\'num\']'),
        dataType: 'json',
        success: function(json) {
           if(json.ret){
                $('combprice').html(json.total);
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


$('input:radio[name="payment_type"]').change(function () {
    var val=$('input:radio[name="payment_type"]:checked').val();
    $('.cell label').removeClass('check');
    $('.cell label').eq(val).addClass('check');
})
if(($('select[name="province"]').val()) == 15){
    $('#province').css('width','45%');

}
$('.back').on('click',function(){
    history.go(-1);
})