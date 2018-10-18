require(['jquery', 'swiper','widget','gallery'],function($, Swiper){
    var mySwiper1 = new window.Swiper('.swiper-container', {
        autoplay: 3000,
        loop: false,
        autoHeight:true,
        pagination: '.swiper-pagination',
    });
    var video = document.getElementById("video");
    if(video){
        video.addEventListener("play", function () {
            mySwiper1.stopAutoplay();
        }, false);
        $(".swiper-container").on("touchmove", function () {
            video.pause();
        });
        $(".swiper-container").on("mouseup", function () {
            video.pause();
        });
        $(document).scroll(function () {
            var top = $(document).scrollTop();
            var h = $(".title").outerHeight() + $("#video").height();
            if (top > h) {
                video.pause();
            }
        });
    }
    
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
    $('.product_info').on('click','.tab',function(){
        $(this).addClass('active').siblings('li').removeClass('active');
        var dom = $(this).attr('data');
        if(parseInt(dom) == 1){
            $('.info_box').show();
            $('.comment_box').hide();
        }else{
            $('.info_box').hide();
            $('.comment_box').show();
        }
    })
})
//返回顶部
$('.top').on('click',function(){
	$('html,body').animate({scrollTop:0},'slow');
})
function custom_check_order(){
    var mob = $('.inquiry_mob').val();
    var identity_tag = $('#identity_tag').val();
    window.widget.goto_checkOrder({
        phone: mob,
        identity_tag: identity_tag
    });
}
//最新订单
require(['commentsScroll', 'gallery']);