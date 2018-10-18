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
//订单查询
$('.query').on('click',function(){
    var url = '/order_quality.php';
    window.location.href = url;
})
//商品介绍导航固定
$(window).load(function(){
	var minHeight = $('.img_tt').offset().top;
	$(window).scroll(function(){
		var scrollTop = $(document).scrollTop();
		if (scrollTop > minHeight) {
			$('.img_tt').addClass('fixed');
		}else{
			$('.img_tt').removeClass('fixed');
		}
	})

})
$(".buy_now").click(function () {
    window.location.href="checkout.php";
})