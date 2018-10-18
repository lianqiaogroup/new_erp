require(['jquery'], function ($){
	//初始化选择
    setCombPrototypeInit(1);
    var is_single = $('.package select').find("option:selected").attr('data-single');
    if(is_single == 1){
        $('.count_num').hide();
    }
    //属性选择框初始化
    height = parseInt($('#page-order').height());
    $('#page-order').css('bottom',-height);

    $('.package select').on('change',function(){
        is_single = $(this).find("option:selected").attr('data-single');
        if (is_single == 1) {
            $('.count_num').hide();
        }else{
            $('.count_num').show();
        }
        $('#comb').attr('data-price', $(this).find("option:selected").attr('data-price'));
        $('[currentprice]').html($(this).find("option:selected").attr('data-price'));
        var index = parseInt($(this).find("option:selected").attr('data-loopindex'));
        setCombPrototypeInit(index);
        refresh_price();
    });
    refresh_price();
})
// 根据套餐初始化
function setCombPrototypeInit(sectionIndex){
    $('section[data-loopindex]').hide();
    $('section[data-loopindex]').eq(sectionIndex-1).show();
}
function addnumber(){
    $('#num').val(parseInt($('#num').val())+1);
        $('.textWrap .tt').html($('#num').val());
    refresh_price(); 
}

function minnumber(){
    if($('#num').val() > 1){
        $('#num').val(parseInt($('#num').val())-1);
        $('.textWrap .tt').html($('#num').val());
        refresh_price();
    }
}

// 刷新价格
function refresh_price() {
    var param = {
        product_id: $('input[name=\'product_id\']').val()
        , combo_id: $('#comb select').val()
        , act: "getAttrPrice"
        , num: $('input[name="num"]').val()
    }
    $.ajax({
        url: '/checkout.php?',
        type: 'post',
        data: param,
        dataType: 'json',
        success: function(json) {
           if(json.ret)
           {
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

// 提交表单
function postcheckGuige() {
    var url = "/checkout.php?";

    // 数量
    var count = parseInt($('input#num').val()) || 1;
    url = url + "count="+count;

    // 产品ID
    var comb_id = $(".package select").val();
    var productId = $('input[name="product_id"]').val();
    url = url + "&combo_id="+comb_id + '&product_id=' + productId;
    
    /* Act on the event */
    var prototype = [];
    var attr_num = $('section[data-loopIndex]:visible .count_atrr').length;
    if( attr_num > 0 ){
        $('section[data-loopIndex]:visible .count_atrr').each(function(){
            var groupId = $(this).attr('data-group');
            var prototypeId = $(this).val();
            if( parseInt(prototypeId)>0 ){
                prototype.push(groupId+"-"+prototypeId);
            }
        });
        if( prototype.length < attr_num ){
            alert($('#page-order').attr('data-error'));
            return false;
        }
        url = url + "&proto="+prototype.join('|');
    }
    // 跳转
    window.location.href = url;
    return false;
}
//选择属性
$('.buy_now').on('click',function(){
    location.href='#page-order';
}) 
