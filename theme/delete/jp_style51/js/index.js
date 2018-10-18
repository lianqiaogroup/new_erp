require(['jquery', 'swiper','widget','gallery'],function($, Swiper){
    var mySwiper1 = new window.Swiper('.swiper-container', {
        autoplay: 3000,
        loop: false,
        autoHeight:true,
        prevButton:'.swiper-button-prev',
        nextButton:'.swiper-button-next'
    });
})
//返回顶部
$(window).on('scroll',function(){
    var minscroll = $('section .buy_now').offset().top+40;
    if ($(document).scrollTop()>minscroll) {
        $('footer').show();
    }else{
        $('footer').hide();
    }
})
$('.top').on('click',function(){
    $('html, body').animate({scrollTop:0}, 'slow');
})
//订单查询
$('.buy_now a').on('click',function(){
    var url = '/order_quality.php';
    window.location.href = url;
})
