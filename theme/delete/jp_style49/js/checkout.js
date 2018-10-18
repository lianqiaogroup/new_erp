require(['jquery', 'widget'], function ($){
    $(document).ready(function(){
        // 初始化套餐选择
        $("#combo").find('input[type=radio]').eq(0).attr("checked", true);

        // 初始化属性选择
        setCombPrototypeInit(1);
        singleCombo();
        // 支付方式
        $('input[name=payment_type]').eq(0).prop('checked', true);
        
        // 刷新价格
        refresh_price();
    });
    window.widget.repeatOrder.init();
    function attrval(){
        var count = $('input[name="num"]').val();
        var combo_id = $('input[name="combo_id"]:checked').val();
        var product_id = $('input[name="product_id"]').val();
        var sectionIndex = $('input[name="combo_id"]:checked').parent('label').attr('data-loopindex');
        if(parseInt(combo_id) == 0){
            var attrs = [];
            $('section[data-loopindex]').eq(sectionIndex-1).find('[data-prototype-group]').each(function(){
                var a = $(this).find('input[type="radio"]:checked').val();
                attrs.push(a);
            });
        }else{
            var attrs = [];
            $('section[data-loopindex]').eq(sectionIndex-1).find('[comboproduc]').each(function(index,element){
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
        console.log(attrs);
        window.widget.repeatOrder.getproattr(product_id,attrs,combo_id);
    }
    $('input[type="submit"]').click(function(){
        attrval();
    })
    // sms open check
    window.widget.smsvalid && window.widget.smsvalid.init();
})
$('.combo').click(function () {
    // 刷新价格
    refresh_price();
    // 显示对应产品和属性
    var index = $(this).attr("data-loopindex");
    setCombPrototypeInit(index);
    singleCombo();
});

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
function inputnumber(){
    var number=parseInt($('#num').val());
    if(isNaN(number)||number < 1){
        $('#num').val('1');
        refresh_price();
    }else if(number > 1){
        $('#num').val(number);
    }
    refresh_price();
}
function refresh_price() {
    $.ajax({
        url: '/checkout.php?',
        type: 'post',
        data: $('#combo input[type=\'radio\']:checked,input[name=\'product_id\'],#product_attr input[name=\'act\'],input[name=\'num\']'),
        dataType: 'json',
        success: function(json) {
           if(json.ret){
              //$("input[name='price']").val(json.total);
              $('.totals').html(json.total);
              console.log(12)
           }
           else{
               alert(json.msg)
           }
        },
        error: function(xhr, ajaxOptions, thrownError) {
        }
    });
}
// 根据套餐初始化
function setCombPrototypeInit(sectionIndex){
    $('section[data-loopindex]').eq(sectionIndex-1).show().siblings().hide().find('input').prop('checked', false);
    $('section[data-loopindex]').eq(sectionIndex-1).find('[data-prototype-group]').each(function(){
        $(this).find('.dxbox label').removeClass('').eq(0).addClass('').find('input').prop("checked", true);
    });
}
//套餐是否可选数量
function singleCombo(){
    var single_c =  $('input[name="combo_id"]:checked').parent('.combo').attr('single_c') ? $('input[name="combo_id"]:checked').parent('.combo').attr('single_c') : $('input[name="combo_id"][checked]').parent('.combo').attr('single_c');
    if(parseInt(single_c) == 1){
        $('#num').val(1);
        $('#num').parents('.bdbox').hide();
    }else{
        $('#num').parents('.bdbox').show();
    }
}