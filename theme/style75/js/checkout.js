function addnumber(){
    $('#num').val(parseInt($('#num').val())+1);
    $('.num_done span').html(parseInt($('#num').val()));
    $('.textWrap .tt').html(parseInt($('#num').val()));
    refresh_price() ;
}
function minnumber(){
    if($('#num').val()>1){
        $('#num').val(parseInt($('#num').val())-1);
        $('.num_done span').html(parseInt($('#num').val()));
        $('.textWrap .tt').html(parseInt($('#num').val()));
        refresh_price() ;
    }
}

function refresh_price() {
    $.ajax({
        url: 'checkout.php?',
        type: 'post',
        data: $('#combo input[type=\'radio\']:checked,#product_attr input[type=\'hidden\'],input[name=\'product_id\'],input[name=\'num\']'),
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

require(['jquery','widget'],function($, Swiper){

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
var is_single = $('#combo .dxbox input').eq(0).attr('data-single');
if(is_single == 1){
    $('.u-fornum .con').hide();
}

$('#combo').on('click', 'label', function(event) {
    event.preventDefault();
    /* Act on the event */

    is_single = $(this).find('input').attr('data-single');
    if (is_single == 1) {
        $('.u-fornum .con').hide();
    }else{
        $('.u-fornum .con').show();
    }
    $(this).addClass('check').siblings().removeClass('check');
    console.log($(this).find('input'))
    $(this).find('input').prop('checked', true);
    // 显示对应产品和属性
    var index = $(this).find('input').attr("data-loopindex");
    if (index) {
        setCombPrototypeInit(index);
    }
});



function setCombPrototypeInit(sectionIndex){
    $('section[data-loopindex]').hide();
    $('section[data-loopindex]').eq(sectionIndex-1).show();
    //清除选中
     $('section').find('input').removeAttr("checked");
    $('section[data-loopindex]').eq(sectionIndex-1).find('li.item').each(function(){
        $(this).find('input[type=radio]').eq(0).attr("checked", true);
    });
    var section = $('section[data-loopindex]').eq(sectionIndex-1);
    section.find('.dxbox').each(function(){
        var first = $(this).find('label').removeClass('check').eq(0).addClass('check');
        $(this).find('label input[type=radio]').eq(0).prop("checked", true);
        var id = first.attr('data-id');
        $(this).attr('data-select', id);
    });
    // 刷新价格
    refresh_price();
}

    //支付方式
    $('.tab_sele').click(function(){
        $('.tab_sele').removeClass('action');
        $(this).addClass('action');

        var payt = $(this).attr('rel');
        $('input[name="payment_type"]').val(payt);
        switch(parseInt(payt)){
            case 0:
                $('.pay-type').hide();
                break;
            case 4:
                $('.pay-type').show();
                break;
        }
    });
    $('.tab_sele').eq(0).addClass('action');
    var payt = $('.tab_sele').eq(0).attr('rel');
    $('input[name="payment_type"]').val(payt);
    switch(parseInt(payt)){
        case 0:
            $('.pay-type').hide();
            break;
        case 4:
            $('.pay-type').show();
            break;
    }
    //邮编合并
    $('input[name="postal_1"],input[name="postal_2"]').change(function(){
        var left = $.trim($('input[name="postal_1"]').val());
        var right = $.trim($('input[name="postal_2"]').val());
        $('input[name="postal"]').val(left+right);
    })
    // function postcheck(){
    //     var pay_type = $("input[name='payment_type']").val();
    //     if(pay_type ==4){
    //         if(!document.getElementById("card_number").value||!document.getElementById("card_month").value||!document.getElementById("card_year").value||!document.getElementById("card_secureCode").value){
    //             var error =  document.getElementById("error").value
    //             alert(error);
    //             return false;
    //         }
    //         var code  =  document.getElementById("code").value ;
    //         var opcseForm = opcse.encryptForm("form", code);
    //         opcseForm.handleSubmit();
    //     }
    //     posting = true;
    //     $('[name="Submit"]').prop('disabled', 'disabled').addClass('submiting');
    //     var submitingText = $('[name="Submit"]').attr('data-wating-text');
    //     if( submitingText != "" ){
    //         $('[name="Submit"]').html(submitingText);
    //     }
    //     return false;
    // }
    window.widget.smsvalid && window.widget.smsvalid.init();//短信验证
    function attrval(){
        var count = $('input[name="num"]').val();
        var combo_id = $('input[name="combo_id"]:checked').val() ? $('input[name="combo_id"]:checked').val() : $('input[name="combo_id"][checked]').val();
        var product_id = $('input[name="product_id"]').val();
        var sectionIndex = $('input[name="combo_id"]:checked').attr('data-loopIndex') ? $('input[name="combo_id"]:checked').attr('data-loopIndex') : $('input[name="combo_id"][checked]').attr('data-loopIndex');
        
        if(parseInt(combo_id) == 0){
            var attrs = [];
            $('section[data-loopIndex]').eq(sectionIndex-1).find('[data-prototype-group]').each(function(){
                var a = $(this).find('input[type="radio"]:checked').val() ? $(this).find('input[type="radio"]:checked').val() : $(this).find('input[type="radio"][checked]').val();
                attrs.push(a);
            });
        }else{
            var attrs = [];
            $('section[data-loopIndex]').eq(sectionIndex-1).find('.bdbox').each(function(index,element){
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
    window.widget.repeatOrder.init();

})