require(['jquery', 'swiper','widget','gallery'],function($, Swiper){
    var mySwiper1 = new window.Swiper('.swiper-container', {
        autoplay: 3000,
        loop: false,
        autoHeight:true,
        pagination: '.swiper-pagination',
        paginationType: 'custom',
        paginationCustomRender: function(swiper, current, total) {
            var text = "";
            text = '<span class="swiper-pagination-current">' + current + ' | <span class="swiper-pagination-total">'+ total +'</span>';
            return text;
        }
    });

})

//加载评论
var start = 0;
var count = $('.lab').length;
load_comment(0)
$('.load_more').on('click',function(){
    load_comment(start);
})
function load_comment(num){
    for(var i=num;i<num+6;i++){
        $('.lab').eq(i).show();
    }
    start = start+6;
    if(start>count){
        $('.load_more').hide();
    }
}
//大图弹出
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
//显示底部客服和立即购买
$(window).on('scroll',function(){
    var top = $('.buy_now').offset().top;
    var scroll = $(document).scrollTop();
    if (top < scroll) {
        $('footer').css('display','flex');
    }else{
        $('footer').hide();
    }
})

$('.top').on('click',function(){
    $('body').animate({scrollTop:0})
})

var fbqstatus = {
    AddToCart: 0,
    InitiateCheckout: 0
};
var region_code = $("#regionCode").val();
//台湾地区加入fb事件；
if (region_code == 'TW' || region_code == 'HK') {
    //fb加入购物车事件
    $('[data-cuckootag="buy_now"]').on('click', function () {
        if (fbqstatus.AddToCart == 0) {
            fbq('track', 'AddToCart');
            fbqstatus.AddToCart++;
        };
    });
    //fb发起结账事件
    $('[data-cuckootag="confirm_arrtibute"]').click(function () {
        if (fbqstatus.InitiateCheckout == 0) {
            fbq('track', 'InitiateCheckout');
            fbqstatus.InitiateCheckout++;
        };
        if (fbqstatus.AddToCart == 0) {
            fbq('track', 'AddToCart');
            fbqstatus.AddToCart++;
        };
    })
};
