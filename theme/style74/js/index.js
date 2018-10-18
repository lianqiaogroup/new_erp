require(['jquery', 'swiper','widget','gallery'],function($, Swiper){
	var mySwiper = new window.Swiper('.swiper-container',{
		autoplay: 3000,
        loop: false,
        autoHeight:true,
        spaceBetween:14,
	})
    //倒计时
    widget.timeSet(2018,4,20,'timer','tw'); //timer:倒计时的id，tw:地区语言
})
//评论滚动
require(['commentsScroll', 'gallery']);