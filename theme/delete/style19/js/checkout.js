$(document).ready(function(){
    setCombPrototypeInit(1);
    //默认第一个属性选中
    $("#combo").find('input[type=radio]').eq(0).attr("checked", true);
    //默认第一个套餐选中
    $("#combo .dxbox label").eq(0).addClass('check');
    refresh_price();

    // 支付方式
    $('input[name=payment_type]').eq(0).attr('checked', true);
    if ($('#img_pay input').length<=1) {
        $('#img_pay input').css('opacity','0');
    }
    
});
//选择属性
$('#dxbox label').click(function() {
    $(this).addClass('check').siblings().removeClass('check');
});
$('#combo .dxbox label').click(function () {
    $(this).addClass('check').siblings().removeClass('check');
    // 刷新价格
    refresh_price();
    // 显示对应产品和属性
    var index = $(this).find('input').attr("data-loopindex");
    if (index) {
    setCombPrototypeInit(index);
    }
});
function addnumber(){
    $('#num').val(parseInt($('#num').val())+1);
    $('.num_done span').html(parseInt($('#num').val()));
    $('.goods_num span').html(parseInt($('#num').val()));
    refresh_price() ;
}
function minnumber(){
    if($('#num').val()>1){
        $('#num').val(parseInt($('#num').val())-1);
        $('.num_done span').html(parseInt($('#num').val()));
        $('.goods_num span').html(parseInt($('#num').val()));
        refresh_price() ;
    }
}
function inputnumber(){

    var number=parseInt($('#num').val());
    if(isNaN(number)||number <= 1){
        $('#num').val('1');
        $('.num_done span').html(1);
        $('.goods_num span').html(1);
        refresh_price();
    }else if(number > 1){
        $('#num').val(number);
        $('.num_done span').html(number);
        $('.goods_num span').html(number);
    }
    refresh_price();
}
function refresh_price() {
    $.ajax({
        url: 'checkout.php?',
        type: 'post',
        data: $('#combo input[type=\'radio\']:checked,#product_attr input[type=\'hidden\'],input[name=\'num\']'),
        dataType: 'json',
        success: function(json) {
           if(json.ret)
           {
              $("input[name='price']").val(json.total);
              $('.text3box span').eq(0).html(json.total);
           }
           else{
               alert(json.msg)
           }
        },
        error: function(xhr, ajaxOptions, thrownError) {
        }
    });
}
function setCombPrototypeInit(sectionIndex){
    $('section[data-loopindex]').hide();
    $('section[data-loopindex]').eq(sectionIndex-1).show();
    //清除选中
     $('section').find('input').removeAttr("checked");
    $('section[data-loopindex]').eq(sectionIndex-1).find('li.item').each(function(){
        $(this).find('input[type=radio]').eq(0).prop("checked", true);
    });
    var section = $('section[data-loopindex]').eq(sectionIndex-1).show();
    section.find('.dxbox').each(function(){
        var first = $(this).find('label').removeClass('check').eq(0).addClass('check');
        var id = first.attr('data-id');
        $(this).attr('data-select', id);
    });
}
require(['jquery', 'widget'], function ($){
    window.widget.repeatOrder.init();
    // sms open check
    window.widget.smsvalid && window.widget.smsvalid.init();
    function attrval(){
        var count = $('input[name="num"]').val();
        var combo_id = $('input[name="combo_id"]:checked').val() ? $('input[name="combo_id"]:checked').val() : $('input[name="combo_id"][checked]').val();
        var product_id = $('input[name="product_id"]').val();
        var sectionIndex = $('input[name="combo_id"]:checked').attr('data-loopIndex') ? $('input[name="combo_id"]:checked').attr('data-loopIndex') : $('input[name="combo_id"][checked]').attr('data-loopIndex');
        
        if(parseInt(combo_id) == 0){
            var attrs = [];
            $('section[data-loopIndex]').eq(sectionIndex-1).find('[data-prototype-group]').each(function(){
                var a = $(this).find('input[type="radio"]:checked').val();
                attrs.push(a);
            });
        }else{
            var attrs = [];
            $('section[data-loopIndex]').eq(sectionIndex-1).find('[comboproduc]').each(function(index,element){
                attrs[index] = [];
                attrs[index].push(product_id);
                attrs[index].push(count);
                var a = [];
                $(this).find('[data-prototype-group]').each(function(i,e){
                    var that = this;
                    a.push($(that).find('input[type="radio"]:checked').val());
                });
                attrs[index].push(a);
            });
        }
        console.log(attrs)
        window.widget.repeatOrder.getproattr(product_id,attrs,combo_id);
    }
    $('input[type="submit"]').click(function(){
        attrval();
    })
});