require(['jquery'], function ($){
	//初始化选择
    setCombPrototypeInit(1);
    var is_single = $('.package select').find("option:selected").attr('data-single');
    if(is_single == 1){
        $('.count_num').hide()
    }
    //属性选择框初始化
    height = parseInt($('#page-order').height());
    $('#page-order').css('bottom',-height);

    $('.package select').on('change',function(){
        is_single = $(this).find("option:selected").attr('data-single');
        if(is_single == 1){
            $('.count_num').hide();
        }else{
            $('.count_num').show();
        }
        $('#comb').attr('data-price', $(this).find("option:selected").attr('data-price'));
        $('[currentprice]').html($(this).find("option:selected").attr('data-price'));
        var index = $(this).get(0).selectedIndex+1;
        setCombPrototypeInit(index);
        refresh_price();
    })
})
// 根据套餐初始化
function setCombPrototypeInit(sectionIndex){
    $('section[data-loopindex]').hide();
    var section = $('section[data-loopindex]').eq(sectionIndex-1).show();
    section.find('li.protoLayer').each(function(){
        var first = $(this).find('.tab').removeClass('tab-sel').eq(0).addClass('tab-sel');
        var id = first.attr('data-id');
        $(this).attr('data-select', id);
    });
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
    $.ajax({
        url: '/checkout.php?',
        type: 'post',
        data: $('#comb input[checked=checked],input[name=\'product_id\'], #act, input[name=\'num\']'),
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
    console.log(attr_num)
    if( $('section[data-loopIndex]:visible .count_atrr').length > 0 ){
        $('section[data-loopIndex]:visible .count_atrr').each(function(){
            var groupId = $(this).attr('data-group');
            var prototypeId = $(this).val();
            if( parseInt(prototypeId)>0 ){
                prototype.push(groupId+"-"+prototypeId);
            }
        });
        if( prototype.length < attr_num ){
            alert('옵션을 선택해 주세요.');
            return false;
        }
        url = url + "&proto="+prototype.join('|');
    }
    // 跳转
    window.location.href = url;
    return false;
}
//显示隐藏属性

$('.buy_now').on('click',function(){
    if($('.buy_now button').hasClass('ok')){
        postcheckGuige();
        $('.buy_now button').removeClass('ok');
    }else{
        $('.buy_now button').addClass('ok');
        $('#page-order').animate({bottom:'0'},500);
        
    }
})
$('.close').on('click',function(){
    height = parseInt($('#page-order').height());
    if ($(this).hasClass('up')) {
        $('#page-order').animate({bottom:-height},500);
        $(this).removeClass('up');
    }else{
        $('#page-order').animate({'bottom':'0'},500);
        $(this).addClass('up');
        $('.buy_now button').addClass('ok');
    }
})