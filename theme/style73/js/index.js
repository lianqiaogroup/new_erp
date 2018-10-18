require(['jquery', 'swiper','widget','gallery'],function($, Swiper){
	var mySwiper = new window.Swiper('.swiper-container',{
		autoplay: 3000,
        loop: false,
        autoHeight:true,
        spaceBetween:14,
	})
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
$('.choose').on('click',function(){
	$('#ui-paramselect').toggle();
})
//最新订单
require(['commentsScroll', 'gallery']);

// 回到顶部
var $doc=$(document);
$(".m-goToTop").hide();
$(".m-goToTop").click(back);
//窗口加滚动触发
$(window).scroll(scrollfun);
function scrollfun(){
    // var hei=$(window).height();
    var hei = window.screen.height;
    //如果滚动高度>窗口的高度,隐藏
    if($doc.scrollTop()>hei){
        $(".m-goToTop").slideDown();
    } else {
        $(".m-goToTop").slideUp();
    }
}
function back(){
    //全兼容各浏览器
    $('html,body').scrollTop(0);
}