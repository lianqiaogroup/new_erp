$(document).ready(function(){
    //默认第一个属性选中
     $('#product_attr .bdbox').each(function(){
         $(this).find('input[type=radio]').eq(0).attr("checked", true);
         var obj = $(this).find(".dxbox label")
         obj.eq(0).addClass('on1').children('input').attr("checked", 'true');
     }) ;
    $("#combo").find('input[type=radio]').eq(0).attr("checked", true);
    refresh_price();
    // 支付方式
    $('input[name=payment_type]').eq(0).attr('checked', true);
});

$('.combo').click(function () {
    refresh_price();
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
        url: 'checkout.php?',
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
$(function () {
    //点击选择属性
    $("#dxbox label").eq(0).addClass("on1")
    $("#combo .dxbox label").eq(0).addClass("on1")
    $("#dxbox label").click(function(){
        $(this).addClass("on1").siblings().removeClass("on1");
    })
    $("#combo .dxbox label").click(function(){
        $(this).addClass("on1").siblings().removeClass("on1");
    })
    //判断图片是否超出范围
    if("#iin"){
        $("#dxbox label img").css({'width':'100%','max-height':'50px'})
    }else {
        $("#dxbox label img").css({'width':'100%','max-height':'100%'})
    }
    /*$("#dxbox label.on1").click(function () {
        $(".nav_top_left").html($("#dxbox label.on1 img"))
    })*/
})
$(document).ready(function(){
    $("input[name='combo_id']").each(function(){
        if($(this).attr('checked')){
            $(".tc"+$(this).val()).show();
        }else{
            $(".tc"+$(this).val()).hide();
        }
        $(this).click(function(){
            $(".tc").hide();
             $(".tc .dxbox.red label").addClass('on1').removeClass('on1');
             $(".tc .dxbox.red label").children('input').removeAttr("checked");
             $(".tc"+$(this).val()+" .dxbox.red ").each(function () {
                 var obj = $(this).find("label")
                 obj.eq(0).addClass('on1').children('input').attr("checked", 'true');

             })
             $(".tc"+$(this).val()).show();
        });
    })


});