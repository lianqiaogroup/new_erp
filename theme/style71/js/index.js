require(['jquery', 'swiper','widget','gallery'],function($, Swiper){

    // 
    var mySwiper1 = new window.Swiper('.swiper-container', {
        autoplay: 3000,
        loop: false,
        autoHeight:true,
        spaceBetween:14,
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
    });    
    //倒计时
    widget.timeSet(2018,4,20,'timer','tw'); //timer:倒计时的id，tw:地区语言
    //评论滚动
    var boxer = $('[data-fn=userScroll]');
    var list = $(boxer).children().eq(0);
    var clone = list.clone();
    $(boxer).append(clone);
    var speed = 35;
    function Marquee(){
        if( boxer.scrollTop() - list.height() >= 0 ){
             boxer.scrollTop(0); 
        }else{
             boxer.scrollTop(boxer.scrollTop()+1);
        }
    }
    setInterval(Marquee,speed);
})
//浏览人数
var sales = parseInt($('.browse span').html());
var count_num = parseInt(sales * (Math.random()+1));
$('.browse span').html(count_num);

//最新订单
require(['commentsScroll', 'gallery']);