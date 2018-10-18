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
})
//图文详情选项卡切换
$('.bTitle span').on('click',function(){
    $(this).siblings().removeClass('select');
    $(this).addClass('select');
})
$('.bTitle .pinglun').on('click',function(){
    $('.pinlun_content').show();
    $('.User_notes').hide();
    $('.m-img').hide();
})
$('.bTitle .info').on('click',function(){
    $('.pinlun_content').hide();
    $('.User_notes').show();
    $('.m-img').show();
})
if ($(".lab p").length <= 0) {
    $(".pinglun").hide();
    $(".bTitle .info").css({width: "48%"});
    $(".bTitle .order_query").css({width: "48%"});
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
//订单查询
$('.order_query').on('click',function(){
    var url = '/order_quality.php';
    window.location.href = url;
})

//隐藏属性层
$('.back').on('click',function(){
    var screenWidth = $(window).width();
    $('#page-order').animate({left:screenWidth},500);
    $('#page-order').hide(400).css({'width':'0','visibility':'hidden'});;
    $('#page-index').css('display','block');
})
