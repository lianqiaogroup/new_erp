require(['jquery', 'swiper','widget','gallery'],function($, Swiper){
    var mySwiper1 = new window.Swiper('.swiper-container', {
        autoplay: 3000,
        loop: false,
        autoHeight:true,
        pagination: '.swiper-pagination',
        paginationType: 'custom',
        paginationCustomRender: function(swiper, current, total) {
            var text = "";
            text = '<span class="swiper-pagination-current">' + current + ' / <span class="swiper-pagination-total">'+ total +'</span>';
            return text;
        }
    });
//倒计时
    widget.timeSet(2018,4,20,'timer','tw'); //timer:倒计时的id，tw:地区语言
    setCombPrototypeInit(1);
    //属性选择框初始化
    height = parseInt($('#page-order').height())+82;
    $('#page-order').css('bottom',-height);
    singleCombo();
    $('.package select').on('change',function(){
        $('#comb').attr('data-price', $(this).find("option:selected").attr('data-price'));
        $('[currentprice]').html($(this).find("option:selected").attr('data-price'));
        var index = $(this).get(0).selectedIndex+1;
        setCombPrototypeInit(index);
        refresh_price();
        singleCombo();
    })
})
var height;
//切换选项卡
$('.bTitle>span').on('click',function(){
    $(this).siblings().removeClass('select');
    $(this).addClass('select')
})
$('.info').on('click',function(){
    $('.m-img').show();
    $('.User_notes').show();
    $('.pinlun_content').hide();
})
$('.pinglun').on('click',function(){
    $('.m-img').hide();
    $('.User_notes').hide();
    $('.pinlun_content').show();
})
//订单查询
$('.order_query').on('click',function(){
    var url = '/order_quality.php';
    window.location.href = url;
})
//显示隐藏属性

$('.package select').on('change',function(){
    height = parseInt($('#page-order').height())+80;
})
$('.buy_now').on('click',function(){
    if($('#add').hasClass('ok')){
        postcheckGuige();
    }else{
        $('#add').addClass('ok');
        $('#page-order').animate({bottom:'0'},500);
        
    }
})
$('.close').on('click',function(){
    $('#page-order').animate({'bottom':-height},500);
    var attr = $('select.count_atrr:visible');
    for (var i = attr.length - 1; i >= 0; i--) {
        if (attr.eq(i).val() == 0) {
            $('#add').removeClass('ok');
            break;
        }
    }
})
// 根据套餐初始化
function setCombPrototypeInit(sectionIndex){
    $('section[data-loopindex]').hide();
    var section = $('section[data-loopindex]').eq(sectionIndex-1).show();
}
//套餐是否可选数量
function singleCombo(){
    var single_c =  $('.package select').find('option:selected').attr('single_c');
    if(parseInt(single_c) == 1){
        $('#num').val(1);
        $('#num').parents('.count_num').hide();
    }else{
        $('#num').parents('.count_num').show();
    }
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
        data: $('#comb input[checked=checked], #act, input[name=\'num\']'),
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
if ($('.lab').length<=0) {
    $('.pinglun').css('display','none');
    $('.bTitle > span').css('border','none')
}
//评论大图弹出
$(".msKeimgBox img").click(function (event) {
    var dj = $(this).index();
    var obj = $(this).parent().parent().find('.hidden');
    var onoff = obj.eq(dj).css('display');
    for (var i = 0; i < obj.length; i++) {
        if (i !== dj) {
            obj.eq(i).hide();
        }
    }
    if(onoff == 'none'){
        obj.eq(dj).fadeIn();
    }else{
        obj.eq(dj).fadeOut();
    }
})