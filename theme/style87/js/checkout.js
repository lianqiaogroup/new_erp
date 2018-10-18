//删除元素
var screenWidth = parseInt($(window).width());
if(screenWidth > 1000){
    $('.panel_small').remove()
}else{
    $('.panel_large').remove()
}

require(['jquery','widget'],function(){
$(document).ready(function(){
    // 赋值数量
    var count = Cjs.url.getParamByName('count');
    $("input[name='num']").val(count);
    $('.goodNum').html("   ×"+count);
    $('.product_numtext').each(function(){
        var num = $(this).parent().attr('data-num')*count;
        $(this).html("   ×"+num);
    })
    // 产品
    var combo_id = Cjs.url.getParamByName('combo_id');
    if (combo_id){
        $('.m-orderItem').hide()
        $('#goods_'+combo_id).show();
    }
    
    $("input[name=combo_id]").val(combo_id);
    var product_id = Cjs.url.getParamByName('product_id');
    $("input[name=product_id]").val(product_id);
    //获取套餐
    var combokey = '.combosid_'+combo_id.toString();
    $(combokey).show();
    // 获取属性
    var shuxing = Cjs.url.getParamByName('proto') || "";
    var shuxingArr = shuxing.split('|');
    var str = [];
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
// sms open check
window.widget.repeatOrder.init();
window.widget.repeatOrder.getproattr();
window.widget.smsvalid && window.widget.smsvalid.init();

})
function refresh_price() {
    $.ajax({
        url: '/checkout.php?',
        type: 'post',
        data: $('input[name=combo_id], #act,input[name=\'product_id\'], input[name=\'num\']'),
        dataType: 'json',
        success: function(json) {
           if(json.ret){
                $('combprice').html(json.total);
                $(".price").html(json.total);
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
//展开套餐
$(".fold").on('click',function(){
    var self = $(this);
    if(self.hasClass('active')){
        self.removeClass('active').html(self.data('text2'));
        $('.m-attrs').slideUp();
    }else{
        self.addClass('active').html(self.data('text1'));
        $('.m-attrs').slideDown();
    }
})
//获取焦点事件
$('.item').on('click',function(){
    $(this).find('input,textarea').focus().parent().prev().addClass('focus');
    
})
//失去焦点事件
$('.item input,.item textarea').on('blur',function(){
    var placeholder =  $(this).parent().prev().removeClass('focus');
    if($(this).val() == ''){
        placeholder.addClass('empty');
    }else{
        placeholder.removeClass('empty');
    }
})
//订单查询
$('.check').on('click',function(){
    window.location.href = "/order_quality.php";
})
//获取域名
var host = window.location.host;
$('.copyright span').html(host.match(/^www\.(\S*)\./)[1]);