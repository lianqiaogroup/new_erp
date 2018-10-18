require(['jquery', 'swiper','widget','gallery'],function($, Swiper){
    var mySwiper1 = new window.Swiper('.swiper-container', {
        autoplay: 3000,
        loop: false,
        autoHeight:true,
        pagination: '.swiper-pagination',
        paginationType: 'bullets',
    });
//倒计时
    widget.timeSet(2018,4,20,'timer','tw'); //timer:倒计时的id，tw:地区语言
})
//折叠
$('.detail_tt').on('click',function(){
	var self = $(this);
	if (self.hasClass('down')) {
		self.removeClass('down');
		self.next().fadeIn();
	}else{
		self.addClass('down');
		self.next().fadeOut();
	}
})
//添加评论
$('.comment_button').on('click',function(){
    $('#add_comment').fadeIn();
})
//关闭添加评论
$(".close").on('click',function(){
    $('#add_comment').fadeOut();
})
//评论满意度
$('span.right span').on('click',function(){
    var index = $(this).index();
    $('span.right span').removeClass('star');
    for (var i = 0; i<=index;i++) {
        $('span.right span').eq(i).addClass('star');
    }
})

var fbqstatus = {
    AddToCart: 0,
    InitiateCheckout: 0
};
var region_code = $("#region_code").val();
if (region_code == 'Rp') {
    //fb加入购物车事件
    var bigleg = $(".protoLayer").length;
    var smleg = $(".con .tab").length;
    var judge = false;
    if (smleg == bigleg){
        judge = true;
    }
    $('.buy_now').on('click', function () {
        if (fbqstatus.AddToCart == 0) {
            fbq('track', 'AddToCart');
            fbqstatus.AddToCart++;
            if (judge && fbqstatus.InitiateCheckout == 0){
                fbq('track', 'InitiateCheckout');
                fbqstatus.InitiateCheckout++;
            }
        };
    });
    //fb发起结账事件
    var list = $('.con .tab ');
    for (var i = 0; i < list.length; i++) {
        list[i].onclick = function () {
            if (fbqstatus.InitiateCheckout == 0) {
                fbq('track', 'InitiateCheckout');
                fbqstatus.InitiateCheckout++;
            };
            if (fbqstatus.AddToCart == 0) {
                fbq('track', 'AddToCart');
                fbqstatus.AddToCart++;
            };
        }
    };
};
