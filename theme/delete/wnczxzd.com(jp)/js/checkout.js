require(['jquery', 'widget'], function ($){
    $(document).ready(function(){
        //默认第一个属性选中
         $('#product_attr .item').each(function(){
             $(this).find('input[type=radio]').eq(0).attr("checked", true);
         }) ;
        $("#combo").find('input[type=radio]').eq(0).attr("checked", true);
        refresh_price();

        //付款方式
        $('input[name="payment_type"]').eq(0).parent('label').addClass('check');
        $('input[name="payment_type"]').eq(0).attr('checked', true);
        if($('input[name="payment_type"]').eq(0).val() == 4){
            $('#ocean-div').fadeIn();
        }else{
            $('#ocean-div').fadeOut();
        }
        $('input[name="payment_type"]').change(function () {
            var val=$('input:radio[name="payment_type"]:checked').val();
            if(val == 4){
                $('#ocean-div').fadeIn();
            }else{
                $('#ocean-div').fadeOut();
            }
            $('.cell label').removeClass('check');
            $('.cell label[rel="'+ val +'"]').addClass('check');
        })
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
});

// 根据套餐初始化
function setCombPrototypeInit(sectionIndex){
    $('section[data-loopindex]').eq(sectionIndex-1).show().siblings().hide().find('input').prop('checked', false);
    $('section[data-loopindex]').eq(sectionIndex-1).find('[data-prototype-group]').each(function(){
        $(this).find('.dxbox label').removeClass('').eq(0).addClass('').find('input').prop("checked", true);
    });
}

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
        data: $('#combo input[type=\'radio\']:checked,#product_attr input[type=\'hidden\'],input[name=\'num\']'),
        dataType: 'json',
        success: function(json) {
           if(json.ret)
           {
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

$("#address1, #address2, #address3").change(function(event) {
    event.preventDefault();
    var ad1 = $('#address1').val();
    var ad2 = $('#address2').val();
    var ad3 = $('#address3').val();
    $("[name=address]").val(ad1+ad2+ad3);
    //console.log($("[name=address]").val());
});

// function postcheck(){
//     var pay_type = $("input[name='payment_type']:checked").val();
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
//     return true;
// }