require(['jquery', 'swiper','widget','gallery'],function($, Swiper){
    var galleryTop = new window.Swiper('.gallery-top', {
        autoplay: 3000,
        loop: false,
        spaceBetween: 10,
        autoHeight:true
    });
    //预计送达时间
    var myDate = new Date();
    myDate.setDate(myDate.getDate()+3);
    var date2 = new Date();
    date2.setDate(date2.getDate()+7);
    var arrival_time = (myDate.getMonth()+1) + '/' + myDate.getDate() + '-' + (date2.getMonth()+1) + '/' + date2.getDate();
    $('#timer').html(arrival_time);
    //倒计时
    widget.timeSet(2018,4,20,'times','tw');
})
$('.tabbox').on('click','.item',function(){
    $(this).siblings().removeClass('action');
    $(this).addClass('action');
    var id = $(this).attr('rel');
    $('.tab').hide();
    $('#tab'+id).show();
})
//点击选中产品
$('#combo_id').each(function(){
    $(this).find('li').eq(0).addClass('action');
    var comid = $(this).find('li').eq(0).attr('rel');
    $('input[name="combo_id"]').val(comid);
});
$('.dxbox').each(function(){
    $(this).find('label').eq(0).addClass('tab-sel');
});
refresh_price();
$('.dxbox label').on('click',function(){
    var allItem = $(this).parent().find('label');
    for(var i = 0;i<allItem.length;i++){
        allItem.eq(i).removeClass('tab-sel');
        $(this).addClass('tab-sel');
    }
})
var is_single = $("#combo_id li").eq(0).attr('data-single');
if(is_single == 1){
    $('.numdiv').hide();
}
//显示套餐内产品属性
$('#combo_id li').click(function(){
    is_single = $(this).attr('data-single');
    if (is_single == 1) {
        $('.numdiv').hide();
    }else{
        $('.numdiv').show();
        }
    var index = $(this).attr('rel');
    $(this).siblings().removeClass('action');
    $(this).addClass('action');
    $('section[data-loopindex]').hide();
    $('section[data-loopindex="'+ index +'"]').show();
    $('input[name="combo_id"]').val(index);
    refresh_price();
})

//订单查询
$('.inquiry').click(function(){
    var mob = $('input[name="inmob"]').val();
    var url = '/order_quality.php?phone='+mob;
    window.location.href = url;
})

function addnumber(){
    $('#num').val(parseInt($('#num').val())+1);
    var num = $('#num').val();
    $('.textWrap .tt span').html(num);
    refresh_price();
}
function minnumber(){
    if($('#num').val() > 1){
        $('#num').val(parseInt($('#num').val())-1);
        var num = $('#num').val();
        $('.textWrap .tt span').html(num);
        refresh_price();
    }
}
function refresh_price(){
    $.ajax({
        url: '/checkout.php?',
        type: 'post',
        data: $('input[name="combo_id"],input[name=\'product_id\'], #act, input[name=\'num\']'),
        dataType: 'json',
        success: function(json) {
            if(json.ret){
                $("#total").html(json.total);
            }else{
                alert(json.msg)
            }
        },
        error: function(xhr, ajaxOptions, thrownError) {
        }
    });

}
//产品属性

$('#buynow').click(function(){
    var url = "/checkout.php?";
    var count = parseInt($('input#num').val());
    url = url + "count="+count;
    var comboid = $('input[name="combo_id"]').val();
    var productId = $('input[name="product_id"]').val();
    url = url + "&combo_id="+comboid + '&product_id=' + productId;
    
    var len = $('section[data-loopindex="'+ comboid +'"]').find('.prodiv').length;
    var dom = $('section[data-loopindex="'+ comboid +'"]').find('.prodiv');

    var attr = [];
    dom.map(function(elem,item){
        var goudid = dom.eq(elem).find('.dxbox .tab-sel').attr('attr-pro');
        var attrid = dom.eq(elem).find('.dxbox .tab-sel').attr('attr_id');
        attr.push(goudid +'-'+ attrid);
    })
    console.log(attr);
    url = url + "&proto="+attr.join('|');
    window.location.href = url;
})